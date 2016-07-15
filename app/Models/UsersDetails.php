<?php
/**
 * Users details model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;

class UsersDetails extends Model
{

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
            'user_id' => 'userId',
            'first_name' => 'firstName',
            'last_name' => 'lastName',
            'middle_name' => 'middleName',
            'picture' => 'picture',
            'description' => 'description',
            'city' => 'city',
            'dt_birthday' => 'dateBirthday'
        );
    }

    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "users_details";
    }



}