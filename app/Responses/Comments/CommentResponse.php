<?php

class CommentResponse extends Response
{

    /**
     * @var data
     */
    public $comments = null;


    public function __construct($data)
    {
        $this->comments = $data;
        parent::__construct();
    }

}
