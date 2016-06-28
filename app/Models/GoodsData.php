<?php
/**
 * VSP goods data model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


class GoodsData
{
    use ModelDataHelper;
    /**
     * @var Dependency Injection container
     */
    protected $di;

    public function __construct($di)
    {
        $this->di = $di;
    }

    /**
     * Define channels table columns according to the JSON data
     * Keys are fields names from JSON data
     * the values are their respective fields aliases from Goods model
     */
    public $columnMap = [
        'id' => 'vspGoodsId',
        'brandId' => 'vspChannelId',
        'categoryId' => 'categoryId',
        'actual' => 'actual',
        'created' => 'dateCreated',
        'description' => 'description',
        'img' => [
            'default' => 'imgDefault',
            'high' => 'imgHigh',
            'small' => 'imgSmall',
        ],
        'isRoot' => 'isRoot',
        'price' => 'price',
        'properties' => 'properties',
        'src' => [
            'id' => 'srcId',
            'type' => 'srcType',
        ],
        'slug' => 'slug',
        'thumbnails' => 'thumbnails',
        'title' => 'title',
        'tags'  => 'tags',
        'updated'  => 'dateUpdated',
    ];

    /**
     * Get all goods
     * @param string $vspChannelId
     * @return array
     */
    public function getGoods($vspChannelId)
    {
        if (empty($vspChannelId)) {
            return [];
        }
        
        $channelsGoods = $this->di->get('dataProvider')->getChannelGoods($vspChannelId);
        
        if (empty($channelsGoods)) {
            return [];
        }
        $dataAvailable = false;
        foreach ($channelsGoods as &$goods) {
            if (empty($goods)) {
                continue;
            }
            $dataAvailable = true;
            foreach ($goods as &$item) {
                $item = $this->dataMapping($this->columnMap,$item);
            }
        }
        return !empty($dataAvailable) ? $channelsGoods : [];
    }
    
}