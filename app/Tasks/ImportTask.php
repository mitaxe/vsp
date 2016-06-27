<?php
/**
 * Import VSP Main Data
 *
 * There are two actions:
 * - php app/cli.php import - import all channels from MainData
 * - php app/cli.php import channels [channelId] - import all channels data (videos, playlist, goods)
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */

use Phalcon\Db\Adapter\Pdo\Postgresql as DbAdapter;

class ImportTask extends \Phalcon\Cli\Task
{
    /**
     * Set max number of processes which could work at the same time
     */
    const WORKERS_LIMIT = 20;
    
    /**
     * Set channels limit for each query
     */
    const CHANNELS_LIMIT = 100;


    /**
     * Default action - cli.php import
     */
    public function mainAction()
    {
        /**
         * Insert or update all available channels from the MainData service
         */
        $this->importAllChannels();
    }

    /**
     * Console action which sync channels data
     * $params[0] optional param - channel id
     * CLI: php app/cli.php import channels [channelId]
     * @param array $params
     */
    public function channelsAction(array $params = [])
    {
        //$params[0] = 'MBRN2x3h2zSZqh0W-TqiF4Pl'; // channel with 10k videos
        $processNum = 0;
        $queryParams = [];
        $processesIds = [];
        $workersActive = 0;
        $workersLimit = $this->getWorkersLimit();
        $channelsLimit = $this->getChannelsLimit();

        do {
            // it's mandatory to create a new db connection for each child process
            $connectionName = 'mainConnection'.$processNum++;
            $this->createNewDbConnection($connectionName);

            if (!empty($params[0])) {
                $queryParams = ["conditions" => "vspChannelId = :vspChannelId:",
                                "bind"       => ["vspChannelId" => $params[0]]];
            } else {
                $queryParams["limit"] = ['number' => $channelsLimit, 'offset' => $processNum * $channelsLimit];
                $queryParams["order"] = 'id ASC';
            }

            // have to create a new model and set a new dbConnection before query
            $model = new Channels();
            $model->setConnectionService($connectionName);
            $channels = $model::find($queryParams);

            // sync is done, no channels are left
            if (count($channels) == 0) {
                break;
            }
            
            //create a new process
            $pid = pcntl_fork();
            
            if ($pid === -1) {
                die("can't fork !");
            } elseif ($pid !== 0) {
                
                // main process
                $workersActive++;
                $processesIds[$pid] = $pid;
                
                // handle workers number limit
                while ($workersActive >= $workersLimit) {
                    $pid = pcntl_wait($status);
                    unset($processesIds[$pid]);
                    $workersActive--;
                }
            } else {
                // child process
                $this->getDI()->get($connectionName)->close();
                
                // create a new db connection for child process db queries
                $connectionName .= '-fork';
                $this->createNewDbConnection($connectionName);
                $this->getDI()->set('dbConnectionServiceName', function () use ($connectionName) {
                    return $connectionName;
                });
                
                foreach ($channels as $channel) {
                    $channel->setConnectionService($connectionName);
                    $this->syncChannelData($channel);
                }
                
                $this->getDI()->get($connectionName)->close();
                
                // close the child process, db connection will be closed(!)
                exit(0);
            }
        } while(count($channels) == $channelsLimit);

        // wait till all child processes will be finished
        do {
            $pid = pcntl_wait($status);
            unset($processesIds[$pid]);
        } while(count($processesIds));
    }

    /**
     * Get and update data from MainData service
     * Update channel's videos
     * @param Channels $channel
     * @return null
     */
    public function syncChannelData(Channels $channel)
    {
        if (empty($channel->vspChannelId)) {
            return false;
        }
        $mainData = new MainData($this->getDI());
        if ($data = $mainData->getChannelData($channel->vspChannelId)) {
            $channel->setSyncDate();
            $channel->assignData($data);
            $channel->save();
            if ($channel->save()) {
                while ($videos = $mainData->getChannelVideos($channel)) {
                    $this->syncChannelVideosData($videos);
                }
                $playlists = $mainData->getChannelPlaylists($channel);
                $this->syncChannelPlaylistsData($playlists);
            }
        }
    }

    /**
     * Update channel's videos
     * @param  array $videosData
     * @return null
     */
    public function syncChannelVideosData(array $videosData)
    {
        if (empty($videosData)) {
            return false;
        }
        
        $newVideos = new Videos();
        $newVideos->setConnectionService($this->getDI()->get('dbConnectionServiceName'));
        foreach ($videosData as $videos) {
            foreach ($videos as $video) {
                $query = ["conditions" => "vspVideoId = :vspVideoId:",
                          "bind"       => ["vspVideoId" => $video['vspVideoId']]];
                $model = new Videos();
                $model->setConnectionService($this->getDI()->get('dbConnectionServiceName'));
                $model = $model::findFirst($query);
                if (!empty($model)) {
                    $model->assignData($video);
                    $model->save();
                } else {
                    $newVideos->assignTags($video);
                    $newVideos->addToBulkInsert($video);
                }
            }
        }
        $newVideos->bulkInsert();
    }

    /**
     * Synchronize channel's playlists data
     * @param $playlists array with Playlists model objects
     * @return null
     */

    public function syncChannelPlaylistsData($playlists)
    {
        if (empty($playlists)) {
            return false;
        }

        foreach ($playlists as $playlist) {
            $query = ["conditions" => "vspPlaylistId = :vspPlaylistId:",
                      "bind"       => ["vspPlaylistId" => $playlist['vspPlaylistId']]];
            $model = Playlists::findFirst($query);
            $model = empty($model) ? new Playlists() : $model;
            $model->assign($playlist);
            if ($model->save()) {
                $this->syncPlaylistVideosData($model, $playlist['videos']);
            }
        }
    }

    /**
     * Synchronize playlist's videos data
     * @param Playlists $playlistModel
     * @param array $videos
     * @return void
     */
    public function syncPlaylistVideosData(Playlists $playlistModel, $videos = []) 
    {
        if (empty($videos)) {
            return false;
        }
        foreach ($videos as $video) {
            if (empty($video['brandVideoId'])) {
                continue;
            }
                
            $query = ["conditions" => "vspVideoId = :vspVideoId:",
                      "bind" => ["vspVideoId" => $video['brandVideoId']]];
            $videoModel = Videos::findFirst($query);
            if (empty($videoModel)) {
                continue;
            }
            $query = ["conditions" => "playlistId = :playlistId: AND videoId = :videoId:",
                      "bind" => ["videoId" => $videoModel->id, "playlistId" => $playlistModel->id]];
            $playlistVideosModel = PlaylistsVideos::findFirst($query);
            if (empty($playlistVideosModel)) {
                $playlistVideosModel = new PlaylistsVideos();
                $playlistVideosModel->playlistId = $playlistModel->id;
                $playlistVideosModel->videoId = $videoModel->id;
            }
            $playlistVideosModel->position = !empty($video['position']) ? $video['position'] : 0;
            $playlistVideosModel->status = !empty($video['status']) ? $video['status'] : '';
            $playlistVideosModel->title = !empty($video['title']) ? $video['title'] : '';
            $playlistVideosModel->save();
        }
    }

    /**
     * Insert or update all channels from the MainData service 
     */
    public function importAllChannels()
    {
        $workersActive = 0;
        $processesIds = [];
        $mainData = new MainData($this->getDI());
        $workersLimit = $this->getWorkersLimit();

        while ($data = $mainData->getChannels()) {
            
            $pid = pcntl_fork();
            
            if ($pid === -1) {

                die("can't fork !");

            } elseif ($pid !== 0) {

                // main process
                $workersActive++;
                $processesIds[$pid] = $pid;
                while ($workersActive >= $workersLimit) {
                    $pid = pcntl_wait($status);
                    unset($processesIds[$pid]);
                    $workersActive--;
                }
            } else {

                // child process
                $newChannels = new Channels();
                foreach ($data as $channels) {
                    if (empty($channels)) {
                        continue;
                    }
                    foreach ($channels as $channelData) {
                        $query = ["conditions" => "vspChannelId = :vspChannelId:",
                            "bind" => ["vspChannelId" => $channelData['vspChannelId']]];
                        $model = Channels::findFirst($query);
                        if (!empty($model)) {
                            $model->setSyncDate();
                            $model->assignData($channelData);
                            $model->save();
                        } else {
                            $newChannels->assignTags($channelData);
                            $newChannels->addToBulkInsert($channelData);
                        }
                    }
                }
                $newChannels->bulkInsert();
                exit(0);
            }
        }
        // wait till all the child processes will be finished
        do {
            $pid = pcntl_wait($status);
            unset($processesIds[$pid]);
        } while(count($processesIds));
    }

    /**
     * Get max number of simultaneously working processes
     * @return int
     */
    private function getWorkersLimit()
    {
        $config = $this->getDI()->get('config');
        if (!empty($config->import->workersLimit)) {
            return $config->import->workersLimit;
        }
        return self::WORKERS_LIMIT;
    }

    /**
     * Get max number of channels per one query
     * @return int
     */
    private function getChannelsLimit()
    {
        $config = $this->getDI()->get('config');
        if (!empty($config->import->channelsLimit)) {
            return $config->import->channelsLimit;
        }
        return self::CHANNELS_LIMIT;
    }

    /**
     * Create a new database connection
     * @param string $connectionName
     * @return null
     */
    private function createNewDbConnection($connectionName = '')
    {
        if (empty($connectionName)) {
            return null;
        }
        $config = $this->getDI()->get('config');
        $this->getDI()->set($connectionName,function() use ($config) {
            $db = new DbAdapter(
                array(
                    "host" => $config->database->host,
                    "username" => $config->database->username,
                    "password" => $config->database->password,
                    "dbname" => $config->database->dbname,
                    "persistent" => false
                )
            );
            return $db;
        });
    }
}