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
        $email    = $this->request->getPost('email');
        $password = $this->request->getPost('password');
        $user = Users::findFirst( ['conditions' => 'email = ?1', 'bind'=> [1 => $email]] );
        if ($user) {
            return new UserResponse($user->id, $user->email, 'adsflk2390fdvfvkljrf23sd0');
            /*if ($this->security->checkHash($password, $user->password)) {
                        
            }*/
        } else {
            $this->security->hash(rand());
            throw new UserNotFoundException('User not found or incorrect password/login');
        }
        
        return new Response();
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

    public function getCommonData()
    {
        $token = $this->request->getToken();
            
        if (1 || !empty($token)) {
            $channel = Channels::findFirst("vspChannelId = 'MBRNBxhAgeY9a6OqMZHiQj9b'");
            $channels = Channels::find(['limit'=>3]);
            $pinsResponse = new ChannelsResponse();
            $pinsResponse->add($channels);
            return new UserCommonResponse(
                [
                    'comments' => [],
                    'other' => []
                ],
                new ChannelResponse(
                    $channel->vspChannelId,
                    $channel->title,
                    $channel->description,
                    $channel->thumbMedium,
                    $channel->skinHeader,
                    $channel->statVideos,
                    $channel->statViews,
                    $channel->statSubscribers
                ),
                $pinsResponse
            );
        }

        return new Response();
    }
    
}