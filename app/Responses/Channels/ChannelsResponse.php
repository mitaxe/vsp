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
                    $channel->title,
                    $channel->description,
                    $channel->vspChannelId,
                    $channel->thumbHigh,
                    $channel->statSubscribers,
                    $channel->statVideos,
                    $channel->statViews
                ));
        }

    }

}
