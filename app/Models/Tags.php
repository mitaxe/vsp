<?php
/**
 * Tags model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;

class Tags extends Model
{
    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "tags";
    }
    
    public function initialize()
    {
        $this->hasMany("id", "VideosTags", "tagId");
        $this->hasMany("id", "ChannelsTags", "tagId");
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
            'name' => 'name',
        );
    }
    

    public function save($data = null, $whiteList = null)
    {   
        $this->beforeSave();
        if (!empty($this->id)) {
            return true;
        }
        return parent::save($data, $whiteList);
    }
    
    public function beforeSave()
    {
        $tag = self::findFirst(["name = :name:", "bind" => ["name" => $this->name]]);
        if (!empty($tag)) {
            $this->id = $tag->id;
        }
    }
}