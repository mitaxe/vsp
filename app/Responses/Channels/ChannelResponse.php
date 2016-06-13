<?php

class ChannelResponse extends Response
{

    /**
     * @var string
     */
    public $title = null;

    /**
     * @var string
     */
    public $description = null;

    /**
     * @var string
     */
    public $url = null;

    /**
     * @var string
     */
    public $img = null;

    /**
     * @var int
     */
    public $statVideos = null;

    /**
     * @var int
     */
    public $statViews = null;

    /**
     * @var int
     */
    public $statSubscribers = null;


    public function __construct($title, $description, $url, $img, $videos, $views, $subscribers)
    {
        $this->title = $title;
        $this->description = $description;
        $this->url = $url;
        $this->img = $img;
        $this->statVideos = $videos;
        $this->statViews = $views;
        $this->statSubscribers = $subscribers;
        parent::__construct();
    }

}
