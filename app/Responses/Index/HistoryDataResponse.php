<?php

class HistoryDataResponse extends Response
{

    /**
     * @var array
     */
    public $viewedVideos = null;

    /**
     * @var array
     */
    public $likedVideos = null;


    public function __construct($viewed, $liked)
    {
        $this->viewedVideos = $viewed->getData();
        $this->likedVideos = $liked->getData();
        parent::__construct();
    }

}
