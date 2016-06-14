<?php
//namespace API;

use Phalcon\DiInterface;
use Phalcon\Http\Client\Request;
use Phalcon\Mvc\Micro\Collection as MicroCollection;
use Phalcon\Exception;
use Phalcon\Mvc\Micro as MicroMVC;
use Phalcon\Http\Response as HttpResponse;
use Phalcon\DI\FactoryDefault as DefaultDI;

/*use API\DI\ApiDI;
use API\Enums\RequestMethodEnum;
use API\Exceptions\HandledException;
use API\Request\PhrestRequest;
use API\Response\CSVResponse;
use API\Response\JSONResponse;
use API\Response\Response;
use API\Response\ResponseMessage;*/

/**
 * Phalcon API Application
 */
class RestAPI extends MicroMVC
{
  /** @var  string */
  protected $srcDir;

  /** @var bool */
  public $isInternalRequest = false;

  /**
   * @param ApiDI $di
   * @param null|string       $srcDir
   * @param bool $internalRequest
   */
  public function __construct(ApiDI $di, $srcDir = null, $internalRequest = false)
  {
    if (!$srcDir)
    {
      $srcDir = dirname(dirname(dirname(dirname(__DIR__)))) . '/src';
    }
    $this->srcDir = $srcDir;
    $this->isInternalRequest = $internalRequest;

    $di->set('collections', function () { 
            return $this->getCollections(); 
        }
    );

    // Set the Exception handler
    //$this->setExceptionHandler($di);

    $this->setDI($di);

    // Handle a 404
    $this->notFound(
      function () use ($di)
      {
          // Set exception message
          $request = $di->get('request');
          $message = sprintf(
            'Route not found: %s to %s',
            $request->getMethod(),
            $request->getURI()
          );
        throw new HandledException($message, 404);
      }
    );

    // Mount all of the collections, which makes the routes active.

    foreach ($di->get('collections') as $collection)
    {
      $this->mount($collection);
    }

    $this->getResponseType();

    // Check unauthorized 401 access
    $this->before(
      function () use ($di)
      {
        // If the access is unauthorized:
        //throw new Exceptions\UnauthorizedException;
      }
    );

    // Send the response if required
    $this->after(
      function () use ($di)
      {
        // Internal request will return the response
        if ($this->isInternalRequest)
        {
          return;
        }

        $controllerResponse = $this->getReturnedValue();

        if (is_a($controllerResponse, 'ResponseArray')) {
          $controllerResponse->setCount($controllerResponse->getCount());
        }

        $request = $di->get('request');

        if ($request->isJSON() || !$request->getFormat())
        {
          $json = new JSONResponse($controllerResponse);

          return $json->send();
        }
      }
    );
  }

  /**
   * @return array
   * @throws \Exception
   */
  public function getCollections()
  {
    $indexPage = new MicroCollection();
    // Устанавливаем главный обработчик, например, экземпляр объекта контроллера
    $indexPage->setHandler(new IndexController());
    $indexPage->setPrefix('/index');
    $indexPage->get('/videos', 'getVideos');
    $indexPage->get('/goods', 'getGoods');
    $indexPage->get('/channels', 'getChannels');
    $collections[] = $indexPage;

    $videosPage = new MicroCollection();
    $videosPage->setHandler(new VideosController());
    $videosPage->get('/exclusive/videos', 'getExclusiveVideos');
    $videosPage->get('/ratings/videos', 'getRatingsVideos');
    $videosPage->get('/new/videos', 'getNewVideos');
    $collections[] = $videosPage;
    
    /** @var Config $collectionConfig */
    /*$collectionConfig = $this->getDI()->get('collectionConfig');
    $collections = [];
    if (!$collectionConfig)
    {
      return [];
    }

    foreach ($collectionConfig->getRequiredArray('versions') as $version => $entitys)
    {
      foreach ($entitys as $entityName => $entity)
      {
        $collection = new PhalconCollection();
        $collection->setPrefix(
          sprintf(
            '/%s/%s',
            strtolower($version),
            strtolower($entityName)
          ));

        $collection->setHandler(
          sprintf(
            '\\%s\\%s\\Controllers\\%s\\%sController',
            $collectionConfig->getRequiredString('namespace'),
            $version,
            $entityName,
            $entityName
          ));

        $collection->setLazy(true);

        foreach ($entity as $requestMethod => $actions)
        {
          foreach ($actions as $actionName => $action)
          {
            $validMethod = in_array(
              strtoupper($requestMethod),
              RequestMethodEnum::getConstants()
            );

            if (!$validMethod)
            {
              throw new \Exception(
                "Invalid request method in the config file: '{$requestMethod}'"
              );
            }
            $requestMethod = strtolower($requestMethod);

            $collection->$requestMethod(
              $action,
              $actionName
            );
          }
        }
        $collections[] = $collection;
      }
    }*/

    return $collections;
  }

  /**
   *
   */
  public function getResponseType()
  {
    if (!$this->isInternalRequest)
    {
      if (!isset($_GET['_url']))
      {
        return;
      }

      $extension = strtolower(pathinfo($_GET['_url'], PATHINFO_EXTENSION));
      if (!strlen($extension))
      {
        return;
      }

      if (in_array($extension, ApiRequest::$responseFormats))
      {
        $request = $this->getDI()->get('request');
        $request->setFormat($extension);
      }

      $_GET['_url'] = str_replace('.' . $extension, '', $_GET['_url']);
    }
  }

  /**
   * If the application throws an HTTPException, respond correctly (json etc.)
   * todo this was not working as the try catch blocks in controllers
   * was catching the exception before it would be handled, need
   * to come back to this
   */
  public function setExceptionHandler(DiInterface $di)
  {
    //return $this;
    set_exception_handler(
      function ($exception) use ($di)
      {
        /** @var $exception Exception */

        // Handled exceptions
        if (is_a($exception, 'HandledException'))
        {
          $response = new Response();

          $response->setStatusCode(
            $exception->getCode(),
            $exception->getMessage()
          );

          $response->addMessage(
            $exception->getMessage(),
            ResponseMessage::TYPE_WARNING
          );

          return (new JSONResponse($response))->send();
        }
        else
        {
          $response = new Response();

          $response->setStatusCode(500, 'Internal Server Error');

          $response->addMessage(
            'Internal Server Error',
            ResponseMessage::TYPE_WARNING
          );

          (new JSONResponse($response))->send();
        }

        // Log the exception
        error_log($exception);
        error_log($exception->getTraceAsString());

        return true;
      }
    );
  }
}
