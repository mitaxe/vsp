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
                    $video->channel->vspChannelId,
                    $video->description,
                    $video->thumbsMedium,
                    $video->statViews,
                    $video->durationSeconds,
                    $video->channel->title,
                    0,
                    $video->datePublished,
                    $blockId
                ));
        }

    }

}
