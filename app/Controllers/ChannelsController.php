<?php

use Phalcon\Mvc\Controller;

class ChannelsController extends RESTController
{

    public function getVideos()
    {
        $response = new VideosResponse();
        $videos = Videos::find(['limit' => 8]);
        foreach ($videos as $video) {
            $response->addResponse(
                new VideoResponse(
                    $video->id,
                    $video->title,
                    $video->vspVideoId,
                    $video->description,
                    $video->description,
                    $video->thumbsHigh,
                    $video->statViews,
                    $video->durationSeconds,
                    'userName',
                    0
                ));
        }
        return $response;
    }

    public function getPopularChannels()
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