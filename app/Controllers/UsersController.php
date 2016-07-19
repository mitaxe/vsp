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
            return new UserResponse($user->id, $user->email, 'adsflk2390fdvfvkljrf23sd0', $user->vspUserId);
            /*if ($this->security->checkHash($password, $user->password)) {
                        
            }*/
        } else {
            $this->security->hash(rand());
            throw new UserNotFoundException('User not found or incorrect password/login');
        }
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
            $channel = Channels::findFirst("vspUserId = '5745c0fdfe502cf046fff634'");
            $channels = Channels::find(["conditions"=>"vspChannelId IN ('MBRNKCtABW8e-8ktBzqk9Ze5','MBRN3xni1zsX0mWr5s0kedF4','MBRNApNHhnj6W0psKcXt_Y02')"]);
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
    
    public function getChannels($vspUserId)
    {
        $channels = Channels::find([
            'conditions' => "vspUserId = ?1",
            'bind' => [1 => $vspUserId]
        ]);

        $response = new ChannelsResponse();

        if (count($channels)) {
            $response->add($channels, true);
        }

        return $response;
    }


    public function getUser($id)
    {
        $user = Users::findFirst([
            'conditions' => "vspUserId = ?1",
            'bind' => [1 => $id]
        ]);
        
        if (!empty($user)) {
            $response = new UserResponse(
                $user->id,
                $user->email,
                'userToken',
                $user->vspUserId,
                $user->login,
                $user->details->firstName,
                $user->details->lastName,
                $user->details->middleName,
                $user->details->picture,
                $user->details->description,
                $user->details->city,
                $user->details->dateBirthday
            );            
            return $response;
        }
        
        throw new UserNotFoundException();
    }

    public function updateUser($id)
    {
        throw new ValidationErrorsException(['email'=>['type'=>'maxlength','message'=>'Max length is 40 sym']]);
        return new Response();

    }
    
}