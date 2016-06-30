<?php

class BadRequestException extends HandledException
{
  protected $code = 400;
  protected $message = 'The Request was invalid';
}
