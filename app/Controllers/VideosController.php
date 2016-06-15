<?php

use Phalcon\Mvc\Controller;

class VideosController extends RESTController
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

    public function getVideo($id)
    {
        $video = Videos::findFirst([
                'conditions' => "vspVideoId = ?1",
                'bind' => [1 => $id]
        ]);

        if (empty($video)) {
            return [];
        }
        $response = new VideoResponse(
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
        );

        return $response;
    }

    public function getExclusiveVideos()
    {
        $response = new VideosResponse();
        $queryParams = ['limit' => 12, 'conditions' => 'status=\'public\' AND exclusive=true'];

        if ($offset = $this->request->getOffset()) {
            $queryParams['offset'] = $offset;
        }
        $videos = Videos::find($queryParams);
        $response->add($videos);
        return $response;
    }

    public function getRatingsVideos()
    {
        $response = new VideosResponse();
        $queryParams = ['limit' => 12, 'conditions' => 'status=\'public\'', 'order' => 'statViews DESC'];

        if ($offset = $this->request->getOffset()) {
            $queryParams['offset'] = $offset;
        }
        $videos = Videos::find($queryParams);
        $response->add($videos);
        return $response;
    }


    public function getNewVideos()
    {
        $response = new VideosResponse();
        $queryParams = ['limit' => 12, 'conditions' => 'status=\'public\'', 'order' => 'dateCreated DESC'];

        if ($offset = $this->request->getOffset()) {
            $queryParams['offset'] = $offset;
        }
        $videos = Videos::find($queryParams);
        $response->add($videos);
        return $response;
    }    
    
}