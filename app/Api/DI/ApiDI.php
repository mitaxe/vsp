<?php

//namespace API\DI;

use Phalcon\DI\FactoryDefault as PhalconDI;
use Phalcon\DI;
use Phalcon\DI\FactoryDefault;
use Phalcon\Http\Request;
use Phalcon\Mvc\Dispatcher as MVCDispatcher;
use Phalcon\Mvc\Dispatcher;
use Phalcon\Mvc\Router;

//use API\Request\ApiRequest;

/**
 * PhrestDI
 */
class ApiDI extends FactoryDefault
{
  /**
   * Construct all of the dependencies for the API
   */
  public function __construct()
  {
    parent::__construct();

    $this->setShared('request',
      function ()
      {
        return new ApiRequest();
      }
    );

    $this->setShared('oauth2',
      function ()
      {
        return false;
      }
    );

    $this->setShared('router',
      function ()
      {
        return new Router;
      }
    );
  }
}
