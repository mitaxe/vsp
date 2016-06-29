<?php

class GoodsItemResponse extends Response
{

    /**
     * @var int vspGoodsId
     */
    public $id = null;

    /**
     * @var string
     */
    public $name = null;

    /**
     * @var string
     */
    public $img = null;

    /**
     * @var float
     */
    public $price = null;


    public function __construct($id, $name, $img, $price)
    {
        $this->id = $id;
        $this->name = $name;
        $this->img = $img;
        $this->price = $price;
        parent::__construct();
    }

}
