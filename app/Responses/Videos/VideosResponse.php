<?php

class VideosResponse extends ResponseArray
{

    public function add($videos = [])
    {
        if (empty($videos)) {
            return false;
        }
        foreach ($videos as $video) {
            $this->addResponse(
                new VideoResponse(
                    $video->vspVideoId,
                    $video->title,
                    $video->srcId,
                    $video->description,
                    $video->thumbsHigh,
                    $video->statViews,
                    $video->durationSeconds,
                    'userName',
                    0,
                    $video->datePublished
                ));
        }        
        
    }

}
