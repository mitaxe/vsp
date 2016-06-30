<?php
/**
 * Users REST API controller
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */

use Phalcon\Mvc\Controller;

class UsersController extends RESTController
{
    public function login()
    {
        $login    = $this->request->getPost('email');
        $password = $this->request->getPost('password');

        $user = Users::findFirstByLogin($login);
        if ($user) {
            if ($this->security->checkHash($password, $user->password)) {
                
            }
        } else {
            // To protect against timing attacks. Regardless of whether a user exists or not, the script will take roughly the same amount as it will always be computing a hash.
            $this->security->hash(rand());
        }

        // неудачная проверка
    }

    public function register()
    {
        $user = new Users();

        $email    = $this->request->getPost('email');
        $password = $this->request->getPost('password');

        $user->email = $email;
        
        $user->password = $this->security->hash($password);

        $user->save();
    }
    
}