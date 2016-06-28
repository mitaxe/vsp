<?php
/**
 * Goods model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Resultset\Simple as Resultset;

class Goods extends Model
{
    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "goods";
    }

    /**
     * Initialize model
     */
    public function initialize()
    {
        
    }

    /**
     * Define table columns names
     * Keys are the real names in the table and
     * the values their names in the application
     * @return array
     */
    public function columnMap()
    {
        return array(
            'id' => 'id',
            'vsp_channel_id' => 'vspChannelId',
            'category_id' => 'categoryId',
            'actual' => 'actual',
            'dt_created' => 'dateCreated',
            'description' => 'description',
            'img_default' => 'imgDefault',
            'img_high' => 'imgHigh',
            'img_small' => 'imgSmall',
            'is_root' => 'isRoot',
            'price' => 'price',
            'properties' => 'properties',
            'slug' => 'slug',
            'src_id' => 'srcId',
            'src_type' => 'srcType',
            'tags' => 'tags',
            'thumb_default' => 'thumbDefault',
            'thumb_high' => 'thumbHigh',
            'thumb_small' => 'thumbSmall',
            'title' => 'title',
            'dt_updated' => 'dateUpdated',
        );
    }

}