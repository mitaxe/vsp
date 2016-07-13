<?php

class UserResponse extends Response
{

    /**
     * @var int
     */
    public $id = null;

    /**
     * @var int
     */
    public $vspUserId = null;

    /**
     * @var string
     */
    public $email = null;

    /**
     * @var string
     */
    public $token = null;

    /**
     * @var string
     */
    public $login = null;

    /**
     * @var string
     */
    public $firstName = null;

    /**
     * @var string
     */
    public $lastName = null;

    /**
     * @var string
     */
    public $middleName = null;

    /**
     * @var string
     */
    public $picture = null;

    /**
     * @var string
     */
    public $description = null;

    /**
     * @var string
     */
    public $city = null;

    /**
     * @var date
     */
    public $dateBirthday = null;


    public function __construct($id, $email, $token, $vspUserId = null, $login = null, $firstName = null, $lastName = null,
                                $middleName = null, $picture = null, $description = null, $city = null, $dateBirthday = null)
    {
        $this->id = $id;
        $this->email = $email;
        $this->token = $token;
        $this->vspUserId = $vspUserId;
        $this->login = $login;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->middleName = $middleName;
        $this->picture = $picture;
        $this->description = $description;
        $this->city = $city;
        $this->dateBirthday = $dateBirthday;

        parent::__construct();
    }

}
