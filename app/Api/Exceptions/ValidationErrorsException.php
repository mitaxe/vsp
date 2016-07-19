<?php

class ValidationErrorsException extends BadRequestException
{
    protected $validationErrors = null;
    protected $message = 'There are validation errors! The form can not be saved!';

    function __construct($message)
    {
        $this->validationErrors = $message;
        parent::__construct();
    }

    public function getErrors() {
        return $this->validationErrors;
    }
}
