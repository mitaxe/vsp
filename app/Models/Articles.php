<?php
/**
 * Articles model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;

class Articles extends Model
{
    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "articles";
    }

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
            'id'            => 'id',
            'actual'        => 'actual',
            'title'         => 'title',
            'description'   => 'description',
            'dt_created'    => 'dateCreated',
            'dt_modified'   => 'dateModified',
            'thumb_default' => 'thumbDefault',
            'thumb_high'    => 'thumbHigh',
            'thumb_medium'  => 'thumbMedium',
            'vsp_video_id'  => 'vspVideoId',
            
        );
    }
    
}