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
     * @var string
     */
    public $imgBg = null;

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

    /**
     * @var array
     */
    public $videos = null;

    
    /**
     * ChannelResponse constructor.
     * @param $id
     * @param $title
     * @param $description
     * @param $img
     * @param string $imgBg
     * @param $statVideos
     * @param $statViews
     * @param $subscribers
     * @param $videos
     */
    public function __construct($id, $title, $description, $img, $imgBg = '', $statVideos, $statViews, $subscribers, $videos = null)
    {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
        $this->img = $img;
        $this->imgBg = $imgBg;
        $this->statVideos = $statVideos;
        $this->statViews = $statViews;
        $this->statSubscribers = $subscribers;
        $this->videos = $videos;
        
        parent::__construct();
    }

}
