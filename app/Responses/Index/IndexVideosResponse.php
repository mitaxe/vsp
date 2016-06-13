<?php

class IndexVideosResponse extends ResponseArray
{

    public function add($videos = [], $blockId)
    {
        if (empty($videos)) {
            return false;
        }
        foreach ($videos as $video) {
            $this->addResponse(
                new IndexVideoResponse(
                    $video->vspVideoId,
                    $video->title,
                    $video->srcId,
                    $video->description,
                    $video->thumbsHigh,
                    $video->statViews,
                    $video->durationSeconds,
                    'userName',
                    0,
                    $video->datePublished,
                    $blockId
                ));
        }

    }

}
