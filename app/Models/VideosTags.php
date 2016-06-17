<?php
/**
 * Channel tags model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;

class VideosTags extends Model
{
    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "video_tags";
    }

    public function initialize()
    {
        $this->belongsTo("videoId", "Videos", "id", ["alias" => "videos"]);
        $this->belongsTo("tagId", "Tags", "id");
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
            'video_id' => 'videoId',
            'tag_id' => 'tagId',
        );
    }

    public function save($data = null, $whiteList = null)
    {
        $this->skipOperation(true);
        parent::save($data, $whiteList);
        return true;
    }

    public function beforeSave()
    {
        if (!empty($this->tagId) && !empty($this->videoId)) {
            $record = self::findFirst(["tagId = :tagId: AND videoId = :videoId:",
                "bind" => ["tagId" => $this->tagId, "videoId" => $this->videoId]]);
        }
        if (!empty($record)) {
            return false;
        }
        return true;
    }    


}