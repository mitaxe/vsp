<?php
/**
 * Import VSP Main Data
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */

use Phalcon\Db\Adapter\Pdo\Postgresql as DbAdapter;

class ImportTask extends \Phalcon\Cli\Task
{
    public function mainAction()
    {
        $this->importAllChannelsFork();
    }
    
    
    public function importAllChannelsFork()
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
                        echo PHP_EOL.'FINISHED - '.$pid.PHP_EOL;
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
                echo "CHILD IS DONE!!!!!!!!!".PHP_EOL;
                exit(0);
            }             
        }
        do {
            $pid = pcntl_wait($status);
            echo PHP_EOL.'FINISHED - '.$pid.PHP_EOL;
            unset($ids[$pid]);
        } while(count($ids));        
        echo 'script time - "'.(microtime(true) - $start).'"'.PHP_EOL;
    }
    
    
    public function importAllChannels()
    {
        $mainData = new MainData($this->getDI());
        $start = microtime(true);
        while ($data = $mainData->getChannels()) {
            $dataAvailable = false;
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
                    $dataAvailable = true;
                }
            }
            $newChannels->bulkInsert();
            if ($dataAvailable == false) {
                break;
            }
        }
        echo 'script time - "'.(microtime(true) - $start).'"'.PHP_EOL;
    }



    public function channelsActionNOTFORK(array $params = [])
    {
        $query = [];
        $params[0] = 'MBRN2x3h2zSZqh0W-TqiF4Pl'; // channel with 10k videos
        //$params[0] = 'MBRNsbwu8nqa8Z30zUyUSsZh'; // channel with 1045 videddos
        //$params[0] = 'MBRNFn-LNscKF7kbkeSPsfgY'; // channel with playlist

        if (!empty($params[0])) {
            $query = ["conditions" => "vspChannelId = :vspChannelId: 
                                       AND  
                                       syncDate IS NULL",
                "bind"       => ["vspChannelId" => $params[0]]];
        } else {
            $query = ["conditions" => "syncDate IS NULL", "limit" => 5000];
        }
        Channels::syncDateSetNull();
        echo "STARTING ALL CHANNELS SYNC";
        $start = microtime(true);

        while ($channels = Channels::find($query)) {
            if (count($channels) == 0) {
                break;
            }
            foreach ($channels as $channel) {
                $this->syncChannelData($channel);
            }
        }
        echo PHP_EOL;
        echo "TOTAL CHANNEL TIME = ".ceil(microtime(true)-$start).' sec';
        echo PHP_EOL.PHP_EOL.PHP_EOL;
    }


    /**
     * Console action which sync channels data
     * $params[0] should contain channel id
     * CLI: php app/cli.php import channels :channelId
     * @param array $params
     * @todo Divide channels update into parts(now we use findAll statement)
     */
    public function channelsAction(array $params = [])
    {
        $query = [];
        //$params[0] = 'MBRN2x3h2zSZqh0W-TqiF4Pl'; // channel with 10k videos
        //$params[0] = 'MBRNsbwu8nqa8Z30zUyUSsZh'; // channel with 1045 videos
        //$params[0] = 'MBRNFn-LNscKF7kbkeSPsfgY'; // channel with playlist

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
        echo "STARTING ALL CHANNELS SYNC";
        $start = microtime(true);
        $workersActive = 0;
        $workersLimit = 20;
        $ids = [];
        $processNum = 0;
        do {
            
            /*$channels = Channels::findFirst($query);*/

            $config = $this->getDI()->get('config');
            $connectionName = 'dbMain'.$processNum++;
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

            $query = ["conditions" => "syncDate IS NULL", "limit" => ['number'=>100,'offset'=>$processNum*100]];
            $model = new Channels();
            $model->setConnectionService($connectionName);
            $channels = $model::find($query);
            
            //$channels = Channels::findByRawSql(["conditions" => "dt_sync IS NULL","limit" => '10 OFFSET '.$i*10], $connectionName);

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
                        echo PHP_EOL.'FINISHED - '.$pid.PHP_EOL;
                        unset($ids[$pid]);
                    } while(count($ids));
                    $workersActive = 0;
                }
                
            } else {
                $this->getDI()->get($connectionName)->close();
                if (count($channels) > 0) {
                    $connectionName .= '-fork';
                    $this->getDI()->set($connectionName, function () use ($config) {
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
            echo PHP_EOL.'FINISHED - '.$pid.PHP_EOL;
            unset($ids[$pid]);
        } while(count($ids));

        echo PHP_EOL;
        echo "TOTAL CHANNEL TIME = ".ceil(microtime(true)-$start).' sec';
        echo PHP_EOL.PHP_EOL.PHP_EOL;
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
                    //echo 'videos got - '.count($videos).PHP_EOL;
                    $this->syncChannelVideosData($videos);
                }
                //echo PHP_EOL.'END OF VIDEOS'.PHP_EOL;
                //$playlists = $mainData->getChannelPlaylists($channel);
                //$this->syncChannelPlaylistsData($playlists);
                //echo PHP_EOL.'updated playlist'.PHP_EOL;
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

    public function syncPlaylistVideosData(Playlists $playlistModel, $videos = []) {
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