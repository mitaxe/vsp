<?php

class SearchVideosResponse extends Response
{

    /**
     * @var array
     */
    public $videos = null;

    /**
     * @var int
     */
    public $videosCount = null;
    
    
    public function __construct(Response $videos, $channelsCount)
    {
        $this->videos = $videos->getData();
        $this->videosCount = $channelsCount;
        parent::__construct();
        $this->setCount(count($videos->getData()));
    }

}
