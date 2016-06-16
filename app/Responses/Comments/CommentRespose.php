<?php

class CommentResponse extends Response
{

    /**
     * @var data
     */
    public $data = null;


    public function __construct($data)
    {
        $this->data = $data;
        parent::__construct();
    }

}
