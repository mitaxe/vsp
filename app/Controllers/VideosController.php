<?php

use Phalcon\Mvc\Controller;

class VideosController extends RESTController
{

    public function getVideos()
    {

        $response = new VideosResponse();

        $target = $this->request->get('target');

        $videos = Videos::find(['limit' => 100]);
        foreach ($videos as $video)
        {
            $response->addResponse(
                new VideoResponse(
                    $video->id,
                    'title for video',
                    /*$video->title,*/
                    'http:://vsponline.dev',
                    'video description',
                    /*$video->description,*/
                    $video->description,
                    $video->thumbsHigh,
                    $video->statViews,
                    $video->durationSeconds,
                    'userName',
                    0,
                    0
                ));
        }        

        return $response;
    }

    public function getVideo($id)
    {
        $video = Videos::findFirst($id);

        $response = new VideosResponse();

        $response->addResponse(
            new VideoResponse(
                $video->id, $video->vspVideoId
            ));

        $response->addResponse(
            new VideoResponse(
                $video->id, $video->vspVideoId
            ));

        return $response;
    }
}