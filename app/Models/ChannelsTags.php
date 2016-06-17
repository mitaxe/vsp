<?php
/**
 * Channel tags model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;

class ChannelsTags extends Model
{

    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "channel_tags";
    }

    public function initialize()
    {
        $this->belongsTo("channelId", "Channels", "id", ["alias" => "channels"]);
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
            'channel_id' => 'channelId',
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
        if (!empty($this->tagId) && !empty($this->channelId)) {
            $record = self::findFirst(["tagId = :tagId: AND channelId = :channelId:", 
                            "bind" => ["tagId" => $this->tagId, "channelId" => $this->channelId]]);
        }
        if (!empty($record)) {
            return false;
        }
        return true;
    }

}