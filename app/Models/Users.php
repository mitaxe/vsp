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
    public $id;

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