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


    /**
     * DataProvider constructor.
     * @param $config
     */
    public function __construct($config)
    {
        $this->config = $config;
        $this->rollingCurl = new \RollingCurl\RollingCurl();
    }

    /**
     * Get all channels
     * @return array
     * @throws Exception
     */
    public function getChannels()
    {
        $channels = [];
        for ($i = 0; $i < $this->config->api->curlMaxConcurrent; $i++) {
            $offset = $this->recordsOffset * $this->config->api->channelsPerRequestLimit;
            $url = $this->config->api->channelUrl. 
                '?clientId=' . $this->config->api->clientId. 
                '&offset='   . $offset. 
                '&limit='    . $this->config->api->channelsPerRequestLimit;
            $this->rollingCurl->get($url);
            $this->recordsOffset++;
        }
        
        $this->rollingCurl->setCallback(
            function(\RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl) use (&$channels) {
                $channels[] = json_decode($request->getResponseText(),true);
                $rollingCurl->clearCompleted();
                $rollingCurl->prunePendingRequestQueue();
            }
        )
        ->setSimultaneousLimit((int)$this->config->api->curlMaxConcurrent)
        ->execute();
        
        return $channels;
    }


    /**
     * Get channel data
     * @param array $conditions
     * @return array|mixed
     * @throws Exception
     */
    public function getChannel(array $conditions)
    {
        $channel = [];
        $url = $this->config->api->channelUrl.
               '?clientId=' . $this->config->api->clientId.
               '&id='       . $conditions['id'];
        $this->rollingCurl->get($url);

        $this->rollingCurl->setCallback(
            function(\RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl) use (&$channel) {
                $channel = json_decode($request->getResponseText(),true);
                $rollingCurl->clearCompleted();
                $rollingCurl->prunePendingRequestQueue();
            }
        )
        ->setSimultaneousLimit((int)$this->config->api->curlMaxConcurrent)
        ->execute();
        
        return isset($channel[0]) ? $channel[0] : [];
    }


    /**
     * Get channel's playlists
     * @param $channelId
     * @return array
     * @throws Exception
     */
    public function getChannelPlaylists($channelId)
    {
        $playlists = [];
        $url = $this->config->api->playlistUrl.
            '?clientId='.$this->config->api->clientId.
            '&brandId='.$channelId;
        $this->rollingCurl->get($url);
        $this->rollingCurl->setCallback(
            function(\RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl) use (&$playlists) {
                $playlists = json_decode($request->getResponseText(),true);
                $rollingCurl->clearCompleted();
                $rollingCurl->prunePendingRequestQueue();
            }
        )
        ->setSimultaneousLimit((int)$this->config->api->curlMaxConcurrent)
        ->execute();
        
        return $playlists;  
    }

    /**
     * Get all channel's videos
     * @param $vspChannelId
     * @param $statVideos
     * @return array
     * @throws Exception
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
        for ($i = 0; $i < $requestsCount; $i++) {
            $offset = $this->recordsOffset * $this->config->api->videosPerRequestLimit;
            $url = $this->config->api->videoUrl.
                '?clientId='. $this->config->api->clientId.
                '&brandId=' . $vspChannelId.
                '&limit='   . $this->config->api->videosPerRequestLimit.
                '&offset='  . $offset;
            $this->rollingCurl->get($url);
            $this->recordsOffset++;
        }

        $this->rollingCurl->setCallback(
            function(\RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl) use (&$videos) {
                $response = json_decode($request->getResponseText(),true);
                if (!empty($response)) {
                    $videos[] = $response;
                }
                $rollingCurl->clearCompleted();
                $rollingCurl->prunePendingRequestQueue();
            }
        )
        ->setSimultaneousLimit((int)$this->config->api->curlMaxConcurrent)
        ->execute();
        
        if (empty($videos)) {
            $this->recordsOffset = 0;
        }
        return $videos;
    }

    /**
     * Get all channel's goods
     * @param string $vspChannelId     
     * @return array
     * @throws Exception
     */
    public function getChannelGoods($vspChannelId)
    {
        $goods = [];
        
        if (empty($vspChannelId)) {
            return [];
        }

        for ($i = 0; $i < $this->config->api->curlMaxConcurrent; $i++) {
            $offset = $this->recordsOffset * $this->config->api->goodsPerRequestLimit;
            $url = $this->config->api->goodsUrl.
                '?clientId='. $this->config->api->clientId.
                '&brandId=' . $vspChannelId.
                '&limit='   . $this->config->api->videosPerRequestLimit.
                '&offset='  . $offset;
            $this->rollingCurl->get($url);
            $this->recordsOffset++;
        }

        $this->rollingCurl->setCallback(
            function(\RollingCurl\Request $request, \RollingCurl\RollingCurl $rollingCurl) use (&$goods) {
                $response = json_decode($request->getResponseText(),true);
                if (!empty($response)) {
                    $goods[] = $response;
                }
                $rollingCurl->clearCompleted();
                $rollingCurl->prunePendingRequestQueue();
            }
        )
            ->setSimultaneousLimit((int)$this->config->api->curlMaxConcurrent)
            ->execute();

        if (empty($goods)) {
            $this->recordsOffset = 0;
        }
        return $goods;
    }    
}