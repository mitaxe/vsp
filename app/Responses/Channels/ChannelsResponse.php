<?php

class ChannelsResponse extends ResponseArray
{

    public function add($channels = [])
    {
        if (empty($channels)) {
            return false;
        }
        foreach ($channels as $channel) {
            $this->addResponse(
                new ChannelResponse(
                    $channel->vspChannelId,
                    $channel->title,
                    $channel->description,                 
                    $channel->thumbHigh,                 
                    $channel->statVideos,
                    $channel->statViews,
                    $channel->statSubscribers
                ));
        }

    }

}
