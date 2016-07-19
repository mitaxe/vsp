<?php

class ValidationResponse extends Response 
{
    public $validationErrors = [];
    
    public function getData() 
    {
        return $this->validationErrors;
    }
    
    public function setData($data) 
    {
        $this->validationErrors = $data;
        $this->setCount(count($data));
    }
}