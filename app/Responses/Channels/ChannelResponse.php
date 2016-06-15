<?php

class ChannelResponse extends Response
{

    /**
     * @var string
     */
    public $id = null;    
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


    public function __construct($id, $title, $description, $img, $videos, $views, $subscribers)
    {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
        $this->img = $img;
        $this->statVideos = $videos;
        $this->statViews = $views;
        $this->statSubscribers = $subscribers;
        parent::__construct();
    }

}
