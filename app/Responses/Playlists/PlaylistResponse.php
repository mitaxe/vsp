<?php

class PlaylistResponse extends Response
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
    public $text = null;

    /**
     * @var string
     */
    public $img = null;


    public function __construct($id, $title, $srcId)
    {
        $this->id = $id;
        $this->title = $title;
        $this->srcId = $srcId;

        parent::__construct();
    }

}
