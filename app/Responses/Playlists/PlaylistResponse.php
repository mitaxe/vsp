<?php

class PlaylistResponse extends Response
{

    /**
     * @var string
     */
    public $id = null;

    /**
     * @var string
     */
    public $channelId = null;

    /**
     * @var string
     */
    public $title = null;

    /**
     * @var string
     */
    public $description = null;

    /**
     * @var array
     */
    public $videos = [];

    /**
     * @var int
     */
    public $videosCount = [];    


    public function __construct($id, $channelId, $title, $description, $videos, $videosCount)
    {
        $this->id = $id;
        $this->channelId = $channelId;
        $this->title = $title;
        $this->description = $description;
        $this->videos = $videos;
        $this->videosCount = $videosCount;


        parent::__construct();
    }

}
