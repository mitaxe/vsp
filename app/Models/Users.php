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
    
    public function initialize()
    {
        $this->hasOne("id", "UsersDetails", "userId", ["alias" => "details"]);
    }    
    
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
            'email' => 'email',
            'is_partner' => 'isPartner',
            'is_admin' => 'isAdmin',
            'actual' => 'actual',
            'dt_modified' => 'dateModified',
            'dt_created' => 'dateCreated',
            'dt_last_login' => 'dateLastLogin',
            'vsp_user_id' => 'vspUserId',
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