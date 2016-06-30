<?php

class UserResponse extends Response
{

    /**
     * @var int
     */
    public $id = null;

    /**
     * @var string
     */
    public $email = null;

    /**
     * @var string
     */
    public $token = null;    
    

    public function __construct($id, $email, $token)
    {
        $this->id = $id;
        $this->email = $email;
        $this->token = $token;

        parent::__construct();
    }

}
