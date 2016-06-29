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

    /**
     * @var json
     */
    public $thumbnails = null;

    /**
     * @var text
     */

    public $description = null;


    public function __construct($id, $name, $img, $price, $thumbnails = null, $description = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->img = $img;
        $this->price = $price;
        $this->thumbnails = $thumbnails;
        $this->description = $description;
        parent::__construct();
    }

}
