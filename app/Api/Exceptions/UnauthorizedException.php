<?php

class UnauthorizedException extends HandledException
{
  protected $code = 401;
  protected $message = 'Authentication is required and has failed or has not yet been provided.';
}
