<?php

class SearchResponse extends Response
{

    /**
     * @var array
     */
    public $videos = null;

    /**
     * @var array
     */
    public $channels = null;

    /**
     * @var string
     */
    public $articles = null;


    public function __construct($videos, $channels, $articles)
    {
        $this->videos = $videos->getData();
        $this->channels = $channels->getData();
        $this->articles = $articles->getData();
        $totalCount = count($this->videos) + count($this->channels) + count($this->articles);
        parent::__construct();
        $this->setCount($totalCount);
    }

}
