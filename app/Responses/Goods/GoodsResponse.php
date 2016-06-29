<?php

class GoodsResponse extends ResponseArray
{

    public function add($goods = [])
    {
        if (empty($goods)) {
            return false;
        }
        foreach ($goods as $goodsItem) {
            $this->addResponse(
                new GoodsItemResponse(
                    $goodsItem->vspGoodsId,
                    $goodsItem->title,
                    $goodsItem->imgDefault,
                    $goodsItem->price
                ));
        }

    }

}
