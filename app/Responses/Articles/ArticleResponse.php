<?php

class ArticleResponse extends Response
{

    /**
     * @var int
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
    public $dateCreated = null;
    
    /**
     * @var string
     */
    public $thumbDefault = null;

    /**
     * @var string
     */
    public $thumbHigh = null;

    /**
     * @var string
     */
    public $thumbMedium = null;

    /**
     * @var string
     */
    public $vspVideoId = null;


    public function __construct($id, $title, $description, $dateCreated, $thumbDefault, $thumbHigh, $thumbMedium, $vspVideoId = null)
    {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
        $this->dateCreated = $dateCreated;
        $this->thumbDefault = $thumbDefault;
        $this->thumbHigh = $thumbHigh;
        $this->thumbMedium = $thumbMedium;
        $this->vspVideoId = $vspVideoId;

        parent::__construct();
    }

}
