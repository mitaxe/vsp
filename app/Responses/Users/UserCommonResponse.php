<?php

class UserCommonResponse extends Response
{

    /**
     * @var array
     */
    public $notifications = null;

    /**
     * @var array
     */
    public $channel = null;

    /**
     * @var array
     */
    public $pins = null;


    public function __construct($notifications, $channel, $pins)
    {
        $this->notifications = $notifications;
        $this->channel = $channel;
        $this->pins = $pins;

        parent::__construct();
    }

}
