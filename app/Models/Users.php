<?php
/**
 * User model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;

class Users extends Model
{
    /**
     * @var integer
     */
    public $id;

    /**
     * @var string
     */
    public $login;

    /**
     * @var string
     */
    public $password;

    /**
     * @var string
     */
    public $email;

    /**
     * @var boolean
     */
    public $is_partner;

    /**
     * @var boolean
     */
    public $is_admin;

    /**
     * @var boolean
     */
    public $actual;

    /**
     * @var \DateTimeZone
     */
    public $dt_modified;

    /**
     * @var \DateTimeZone
     */
    public $dt_created;

    /**
     * @var \DateTimeZone
     */
    public $dt_last_login;


    /**
     * Define table columns names
     * Keys are the real names in the table and
     * the values their names in the application
     * @return array
     */
    public function columnMap()
    {
        return array(
            'id' => 'id',
            'login' => 'login',
            'password' => 'password',
            'email' => 'password',
            'is_partner' => 'isPartner',
            'is_admin' => 'isAdmin',
            'actual' => 'actual',
            'dt_modified' => 'dateModified',
            'dt_created' => 'dateCreated',
            'dt_last_login' => 'dateLastLogin',
        );
    }

    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "users";
    }
    
    
    
}