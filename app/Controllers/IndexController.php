<?php

use Phalcon\Mvc\Controller;

class IndexController extends RESTController
{

    const CURRENTLY_WATCHED_BLOCK_ID = 0;
    const NEW_VIDEOS_BLOCK_ID = 1;
    const POPULAR_VIDEOS_BLOCK_ID = 2;
    const EXCLUSIVE_VIDEOS_BLOCK_ID = 4;

    public function index()
    {
        $video = Videos::findFirst("id = 1");

        return new VideoResponse($video);
    }

    /**
     * @todo Implement dynamic blocks
     * @todo Group video by blockId
     */
    public function getVideos()
    {
        $response = new IndexVideosResponse();

        $videos = Videos::findCurrentlyWatched(['limit' => 2]);
        $response->add($videos, self::CURRENTLY_WATCHED_BLOCK_ID);

        $videos = Videos::findNew(['limit' => 12]);
        $response->add($videos, self::NEW_VIDEOS_BLOCK_ID);

        $videos = Videos::findPopular(['limit' => 12]);
        $response->add($videos, self::POPULAR_VIDEOS_BLOCK_ID);

        //custom 1
        $videos = Videos::find(['limit' => 12]);
        $response->add($videos, 3);

        $videos = Videos::findExclusive(['limit' => 12]);
        $response->add($videos, self::EXCLUSIVE_VIDEOS_BLOCK_ID);

        //custom 2
        $videos = Videos::find(['limit' => 12]);
        $response->add($videos, 5);
        //custom 2
        $videos = Videos::find(['limit' => 12]);
        $response->add($videos, 6);

        return $response;
    }


    public function getGoods()
    {

    }
    
    public function getChannels()
    {
        $response = new ChannelsResponse();

        $channels = Channels::findPopular(['limit' => 12]);
        $response->add($channels);
        
        return $response;
    }   
    
    public function search()
    {
        $itemCount = 5;
        $key = $this->request->getSearchQuery();

        $videosResponse = new VideosResponse();
        $videosParams = [
            "conditions" => "title LIKE :key:",
            "bind" => ['key' => "%" . $key . "%"],
            'limit' => $itemCount
        ];
        $videos = Videos::find($videosParams);
        $videosResponse->add($videos);

        $channelsResponse = new ChannelsResponse();

        $channelsParams = [
            "conditions" => "title LIKE :key:",
            "bind" => ['key' => "%" . $key . "%"],
            'limit' => $itemCount
        ];
        $channels = Channels::find($channelsParams);
        $channelsResponse->add($channels);

        $articlesResponse = new Response();
        return new SearchResponse($videosResponse, $channelsResponse, $articlesResponse);
    }

    public function searchVideos() {

        $itemCount = 20;
        $offset = $this->request->getOffset();
        $key = $this->request->getSearchQuery();

        $videosResponse = new VideosResponse();

        $queryParams = [
            "conditions" => "title LIKE :key:",
            "bind" => ['key' => "%" . $key . "%"],
        ];

        $videosCount = Videos::count($queryParams);

        $queryParams['limit'] = $itemCount;
        $queryParams['offset'] =  $itemCount * $offset ;

        $videos = Videos::find($queryParams);
        $videosResponse->add($videos);

        return new SearchVideosResponse($videosResponse, $videosCount);
    }

    public function searchChannels() {

        $itemCount = 20;
        $offset = $this->request->getOffset();
        $key = $this->request->getSearchQuery();

        $channelsResponse = new ChannelsResponse();

        $queryParams = [
            "conditions" => "title LIKE :key:",
            "bind" => ['key' => "%" . $key . "%"],
        ];

        $channelsCount = Channels::count($queryParams);

        $queryParams['limit']  = $itemCount;
        $queryParams['offset'] = $itemCount * $offset ;

        $channels = Channels::find($queryParams);
        $channelsResponse->add($channels);

        return new SearchChannelsResponse($channelsResponse, $channelsCount);
    }    
    
}