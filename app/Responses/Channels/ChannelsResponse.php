<?php

class ChannelsResponse extends ResponseArray
{

    public function add($channels = [], $withVideos = false)
    {
        if (empty($channels)) {
            return false;
        }
        foreach ($channels as $channel) {
            $videosResponse = new VideosResponse();
            if ($withVideos == true) {
                $videosResponse->add($channel->findPopularVideos());
            }
            $this->addResponse(
                new ChannelResponse(
                    $channel->vspChannelId,
                    $channel->title,
                    $channel->description,
                    $channel->thumbHigh,
                    $channel->thumbHigh,                 
                    $channel->statVideos,
                    $channel->statViews,
                    $channel->statSubscribers,
                    $videosResponse->getData()
                ));
        }

    }

}
