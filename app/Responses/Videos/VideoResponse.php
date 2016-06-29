<?php

class VideoResponse extends Response
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
    public $srcId = null;

    /**
     * @var string
     */
    public $channelId = null;    

    /**
     * @var string
     */
    public $text = null;

    /**
     * @var string
     */
    public $img = null;

    /**
     * @var int
     */
    public $count = null;

    /**
     * @var string
     */
    public $length = null;

    /**
     * @var string
     */
    public $user = null;

    /**
     * @var int
     */
    public $exclusive = 0;

    /**
     * @var date
     */
    public $date = null;

    /**
     * @var date
     */
    public $statLikes = null;

    /**
     * @var date
     */
    public $statViews = null;

    public function __construct($id, $title, $srcId, $channelId, $text, $img, $count, $length, $channelTitle, $exclusive, $date, $statLikes = null, $statViews = null)
    {
        $this->id = $id;
        $this->title = $title;
        $this->srcId = $srcId;
        $this->channelId = $channelId;
        $this->text = $text;
        $this->img = $img;
        $this->count = $count;
        $this->length = $length;
        $this->user = $channelTitle;
        $this->exclusive = $exclusive;
        $this->date = $date;
        $this->statLikes = $statLikes;
        $this->statViews = $statViews;
        parent::__construct();
    }

}
