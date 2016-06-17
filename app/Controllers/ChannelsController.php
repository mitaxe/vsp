<?php

use Phalcon\Mvc\Controller;

class ChannelsController extends RESTController
{

    public function getChannel($id)
    {
        $channel = Channels::findFirst([
            'conditions' => "vspChannelId = ?1",
            'bind' => [1 => $id]
        ]);
        if (!empty($channel)) {
            return new ChannelResponse(
                $channel->vspChannelId,
                $channel->title,
                $channel->description,
                $channel->thumbMedium,
                $channel->skinHeader,
                $channel->statVideos,
                $channel->statViews,
                $channel->statSubscribers
            );
        }

        return new Response;
    }

    public function getPlaylists()
    {
        return new Response();
    }

    public function getGoods()
    {
        return new Response();
    }    
    
    public function getVideos($id)
    {
        $response = new VideosResponse();

        $queryParams = ['vspChannelId' => $id,'limit'=>12];
        if ($offset = $this->request->getOffset()) {
            $queryParams['offset'] = $offset;
        }

        $videos = Videos::find($queryParams);
        $response->add($videos);
        return $response;
    }

    public function getPopular()
    {
        $response = new ChannelsResponse();
        $queryParams = ['limit' => 12, 'order' => 'statViews DESC'];

        if ($offset = $this->request->getOffset()) {
            $queryParams['offset'] = $offset;
        }
        $channels = Channels::find($queryParams);
        $response->add($channels);
        return $response;
    }


}