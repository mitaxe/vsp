<?php
/**
 * Videos REST API controller
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */

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
        $response = new VideosResponse();
        $video = Videos::find([
                'conditions' => "vspVideoId = ?1",
                'bind' => [1 => $id]
        ]);
        $response->add($video);

        $videos = Videos::find([
            'limit' => 2
        ]);

        $response->add($videos);
        return $response;
    }

    public function getVideoComments($id)
    {
        $data[] = [
            "user" => "Clan ZIP",
            "link" => "#",
            "img" => "assets/img/ball-59.png",
            "text" => "Очень красивое видео!!!",
            "date" => "5 часов назад",
            "likes" => 12,
            "responses" => [[
                    "user" => "The Dude",
                    "link"=> "#",
                    "img" => "assets/img/ball-60.png",
                    "text" => "Test Test Text",
                    "date" => "12 часов назад",
                    "likes" => 2
                ],
                [
                    "user" => "Ozzy12345",
                    "link" => "#",
                    "img" => "assets/img/ball-59.png",
                    "text" => "Looks cool...",
                    "date" => "24 часов назад",
                    "likes" => 18
                ]]

        ];
        return new CommentResponse($data);
    }

    public function getRelatedVideos($id)
    {
        $response = new VideosResponse();
        $videos = Videos::find([
            'limit' => 2
        ]);
        $response->add($videos);
        return $response;
    }

    public function getRelatedChannels($id)
    {
        $response = new ChannelsResponse();
        $channels = Channels::find([
            'limit' => 2
        ]);
        $response->add($channels);
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