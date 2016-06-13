<?php
/**
 * VSP API Data provider
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */

class DataProvider {

    private $config;
    private $rollingCurl;
    
    private $recordsOffset = 0;
    

    public function __construct($config)
    {
        $this->config = $config;
        $this->rollingCurl = new \RollingCurl\RollingCurl();
    }


    public function getChannels()
    {
        $channels = [];
        
        for ($i = 0; $i < 10; $i++) {
            $offset = $this->recordsOffset * $this->config->api->channelsPerRequestLimit;
            $url = $this->config->api->channelUrl . '?clientId=' . $this->config->api->clientId . '&offset=' . $offset . '&limit=' . $this->config->api->channelsPerRequestLimit;
            $this->rollingCurl->get($url);
            $this->recordsOffset++;
            //echo $url.PHP_EOL;
        }
        $start = microtime(true);
        $this->rollingCurl->setCallback(function(\RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl) use (&$channels) {
            $channels[] = json_decode($request->getResponseText(),true);
            echo $request->getUrl().PHP_EOL;
            $info = $request->getResponseInfo();
            echo 'load time - '.$info['total_time'].PHP_EOL;
            $rollingCurl->clearCompleted();
            $rollingCurl->prunePendingRequestQueue();
        })
            ->setSimultaneousLimit((int)$this->config->api->curlMaxConcurrent)
            ->execute();
        echo '10 queries time - '.(microtime(true)-$start).PHP_EOL;
        echo 'count='.count($channels).PHP_EOL;
        return $channels;
    }
    
    
    public function getChannel(array $conditions)
    {
        $channel = [];
        $url = $this->config->api->channelUrl.'?clientId='.$this->config->api->clientId.'&id='.$conditions['id'];
        $this->rollingCurl->get($url);

        $this->rollingCurl->setCallback(function(\RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl) use (&$channel) {
            $channel = json_decode($request->getResponseText(),true);

            $rollingCurl->clearCompleted();
            $rollingCurl->prunePendingRequestQueue();
        })
            ->setSimultaneousLimit((int)$this->config->api->curlMaxConcurrent)
            ->execute();


        return isset($channel[0]) ? $channel[0] : [];
    }

    public function getChannelPlaylists($channelId)
    {
        $playlists = [];
        $url = $this->config->api->playlistUrl.'?clientId='.$this->config->api->clientId.'&brandId='.$channelId;
        $this->rollingCurl->get($url);
        //echo $url.PHP_EOL;
        $this->rollingCurl->setCallback(function(\RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl) use (&$playlists) {
            $playlists = json_decode($request->getResponseText(),true);
            $rollingCurl->clearCompleted();
            $rollingCurl->prunePendingRequestQueue();
        })
            ->setSimultaneousLimit((int)$this->config->api->curlMaxConcurrent)
            ->execute();
        return $playlists;  
    }

    /**
     * @param array $conditions
     * @return mixed
     * @throws Exception
     * @todo API url helper(composer)
     */
    public function getChannelVideos($vspChannelId, $statVideos)
    {
        $videos = [];
        if (empty($statVideos)) {
            return $videos;
        }
        
        $requestsCount = ceil($statVideos / $this->config->api->videosPerRequestLimit);
        if ($requestsCount > $this->config->api->curlMaxConcurrent) {
            $requestsCount = $this->config->api->curlMaxConcurrent;
        }
//echo $requestsCount.'=='.$statVideos.PHP_EOL;exit;
        for ($i = 0; $i < $requestsCount; $i++) {
            $offset = $this->recordsOffset * $this->config->api->videosPerRequestLimit;
            $url = $this->config->api->videoUrl . '?clientId=' . $this->config->api->clientId . '&brandId=' . $vspChannelId . '&limit=' . $this->config->api->videosPerRequestLimit . '&offset=' . $offset;
            $this->rollingCurl->get($url);
            $this->recordsOffset++;
        }
        $start = microtime(true);
        echo '*******Videos REQUEST PARAMS:'.PHP_EOL;
        echo '*******statVidoes = '.$statVideos.PHP_EOL;
        echo '*******requestsCount = '.$requestsCount.PHP_EOL;
        $this->rollingCurl->setCallback(function(\RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl) use (&$videos) {
            $response = json_decode($request->getResponseText(),true);
            if (!empty($response)) {
                $videos[] = $response;
            }
            echo '=========='.$request->getUrl().PHP_EOL;
            $info = $request->getResponseInfo();
            echo '==========videosCount='.count($response).PHP_EOL;
            echo '==========load time - '.$info['total_time'].PHP_EOL;            
            $rollingCurl->clearCompleted();
            $rollingCurl->prunePendingRequestQueue();
        })
            ->setSimultaneousLimit((int)$this->config->api->curlMaxConcurrent)
            ->execute();
        if (empty($videos)) {
            $this->recordsOffset = 0;
        }
        echo '-=-10 queries time - '.(microtime(true)-$start).PHP_EOL;         
        return $videos;
    }
/*    function getChannel(array $conditions)
    {
        $channels = [];
        $url = $this->config->api->channelUrl.'?clientId='.$this->config->api->clientId.'&id='.$conditions['id'];
        $this->rollingCurl->get($url);
        echo $url.PHP_EOL;
//        $start = microtime(true);
//        echo 'Fetching..'.PHP_EOL;
//        for($i = 0; $i < 2; $i++) {
//            $this->rollingCurl->get($url.$i);
//        }


        $this->rollingCurl->setCallback(function(\RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl) use (&$channels) {
            $results = json_decode($request->getResponseText(),true);
            $channels = array_merge($results,$channels);
//            echo "Fetch complete for (" . $request->getUrl() . ")" . PHP_EOL;
            // Clear list of completed requests and prune pending request queue to avoid memory growth
            $rollingCurl->clearCompleted();
            $rollingCurl->prunePendingRequestQueue();
        })
            ->setSimultaneousLimit((int)$this->config->api->curlMaxConcurrent)
            ->execute();
//
//        echo "...done in " . (microtime(true) - $start) . PHP_EOL;
//        echo 'result count = '.count($channels).PHP_EOL;

        return $channels;
    }*/


/*    public function __construct($config)
    {
        $this->config = $config;
        $this->curlObj = new RollingCurlX($this->config->api->curlMaxConcurrent);
    }

    public function getChannels()
    {
        $url = $this->config->api->channelUrl.'?clientId='.$this->config->api->clientId.'&limit=1';
        $this->curlObj->addRequest($url, $this->postData, 'DataProvider::callback');
        $this->curlObj->execute();
    }

    static public function callback($response, $url, $requestInfo, $userData, $time) {
        print_r( $response );
    }*/

}