<?php

class SearchChannelsResponse extends Response
{

    /**
     * @var array
     */
    public $channels = null;

    /**
     * @var int
     */
    public $channelsCount = null;


    public function __construct(Response $channels, $channelsCount)
    {
        $this->channels = $channels->getData();
        $this->channelsCount = $channelsCount;
        parent::__construct();
        $this->setCount(count($channels->getData()));
    }

}
