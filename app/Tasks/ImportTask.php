<?php
/**
 * Import VSP Main Data
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 *
 *
 */

use Phalcon\Db\Adapter\Pdo\Postgresql as DbAdapter;

class ImportTask extends \Phalcon\Cli\Task
{
    public function mainAction()
    {
        $this->importAllChannels();
    }

    /**
     * Console action which sync channels data
     * $params[0] optional param - channel id
     * CLI: php app/cli.php import channels [channelId]
     * @param array $params
     * @todo Divide channels update into parts(now we use findAll statement)
     */
    public function channelsAction(array $params = [])
    {
        $query = [];

        if (!empty($params[0])) {
            $query = ["conditions" => "vspChannelId = :vspChannelId:
                                       AND
                                       syncDate IS NULL",
                     "bind"       => ["vspChannelId" => $params[0]]];
            /*$query = ["conditions" => "vspChannelId = :vspChannelId:",
                      "bind"       => ["vspChannelId" => $params[0]]];*/
        } else {
            $query = ["conditions" => "syncDate IS NULL", "limit" => ['number'=>10,'offset'=>10]];
        }
        //Channels::syncDateSetNull();
        $workersActive = 0;
        $workersLimit = 20;
        $ids = [];
        $processNum = 0;
        do {

            /*$channels = Channels::findFirst($query);*/

            //$config = $this->getDI()->get('config');
            $connectionName = 'dbMain'.$processNum++;
            $this->createNewDatabaseConnection($connectionName);
            /*$this->getDI()->set($connectionName,function() use ($config) {
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
            });*/

            $query = ["conditions" => "syncDate IS NULL", "limit" => ['number'=>100,'offset'=>$processNum*100]];
            $model = new Channels();
            $model->setConnectionService($connectionName);
            $channels = $model::find($query);

            if (count($channels) == 0) {
                break;
            }
            $pid = pcntl_fork();
            if ($pid === -1) {
                die("can't fork !");
            } elseif ($pid !== 0) {
                // main process
                $workersActive++;
                $ids[$pid] = $pid;
                if ($workersActive >= $workersLimit) {
                    do {
                        $pid = pcntl_wait($status);
                        unset($ids[$pid]);
                    } while(count($ids));
                    $workersActive = 0;
                }
            } else {
                $this->getDI()->get($connectionName)->close();
                if (count($channels) > 0) {
                    $connectionName .= '-fork';
                    $this->createNewDatabaseConnection($connectionName);
                    $this->getDI()->set('dbConnectionServiceName', function () use ($connectionName) {return $connectionName;});
                    foreach ($channels as $channel) {
                        $channel->setConnectionService($connectionName);
                        $this->syncChannelData($channel);
                    }
                }
                $this->getDI()->get($connectionName)->close();
                exit(0);
            }
        } while(count($channels) != 0);

        do {
            $pid = pcntl_wait($status);
            unset($ids[$pid]);
        } while(count($ids));
    }


    private function createNewDatabaseConnection($connectionName = '')
    {
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

    public function importAllChannels()
    {
        $mainData = new MainData($this->getDI());
        $start = microtime(true);
        $workersLimit = 20;
        $workersActive = 0;
        $ids = [];
        
        while ($data = $mainData->getChannels()) {
            $pid = pcntl_fork();
            if ($pid === -1) {
                die("can't fork !");
            } elseif ($pid !== 0) {
                // main process
                $workersActive++;
                $ids[$pid] = $pid;
                if ($workersActive >= $workersLimit) {
                    do {
                        $pid = pcntl_wait($status);
                        unset($ids[$pid]);
                    } while(count($ids));
                    $workersActive = 0;
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
        do {
            $pid = pcntl_wait($status);
            unset($ids[$pid]);
        } while(count($ids));
    }

    /**
     * Get and update data from MainData service
     * Update channel's videos
     * @param Channels $channel
     * @return boolean
     * @todo Delete channel tags if they are absent in the data from MainData
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
     * @param array $videos Videos data from MainData service
     * @return boolean
     * @todo Delete videos tags if they are absent in the data from MainData
     */
    public function syncChannelVideosData(array $videosData)
    {
        if (empty($videosData)) {
            return false;
        }
        /*foreach ($videosData as $videos) {
            foreach ($videos as $video) {
                $query = ["conditions" => "vspVideoId = :vspVideoId:",
                    "bind"       => ["vspVideoId" => $video['vspVideoId']]];
                $model = Videos::findFirst($query);
                $model = empty($model) ? new Videos() : $model;
                $model->assignData($video);
                $model->save();
            }
        }*/
        
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
}