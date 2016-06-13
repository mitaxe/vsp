<?php
//namespace API\Response;

use Phalcon\Http\Response as HTTPResponse;
use API\Request\PhrestRequest;

class JSONResponse extends HTTPResponse
{
  /** @var bool */
  protected $envelope = true;

  /** @var ResponseMeta */
  public $meta;

  /** @var ResponseMessage[] */
  public $messages;

  /** @var array */
  public $data;

  /**
   * @param Response $response
   */
  public function __construct(Response $response)
  {
    parent::__construct();

    $this->setStatusCode(
      $response->getStatusCode(),
      $response->getStatusMessage()
    );

    $this->data = $response->getData();
    $this->meta = $response->getMeta();
    $this->messages = $response->getMessages();
  }

  /**
   * Send the response
   *
   * @return \Phalcon\Http\ResponseInterface
   */
  public function send()
  {
    // Set headers
    $this->setContentType('application/json', 'UTF-8');

    $request = $this->getDI()->get('request');

    // Set content
    if (!$request->isHead()) {
      if (empty($this->messages)) {
        $this->messages = null;
      }
      if (empty($this->data)) {
        $this->data = null;
      }

      if ($request->isPretty()) {
        $this->setContent(json_encode($this, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK));
      } else {
        $this->setContent(json_encode($this, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK));
      }
    }

    // Send content
    return parent::send();
  }

  /**
   * @param \Exception $exception
   *
   * @return \Phalcon\Http\ResponseInterface|void
   */
  public function sendException(\Exception $exception)
  {
    $this->setStatusCode($exception->getCode(), $exception->getMessage());

    $this->setJsonContent($this);

    return parent::send();
  }
}
