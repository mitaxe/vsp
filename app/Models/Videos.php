<?php
/**
 * Video model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Resultset\Simple as Resultset;

class Videos extends Model
{
 
    use ModelBulkInsert;
    use ModelDataHelper;
    
    public function initialize()
    {
        $this->belongsTo("channelId", "Channels", "id", ["alias" => "channel"]);
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
            'channel_id' => 'channelId',
            'vsp_video_id' => 'vspVideoId',
            'vsp_channel_id' => 'vspChannelId',
            'actual' => 'actual',
            'dt_created' => 'dateCreated',
            'dt_published' => 'datePublished',
            'dt_updated' => 'dateUpdated',
            'description' => 'description',
            'duration_iso0860' => 'durationISO',
            'duration_seconds' => 'durationSeconds',
            'is_embeddable' => 'isEmbeddable',
            'is_root' => 'isRoot',
            'src_id' => 'srcId',
            'src_type' => 'srcType',
            'src_channel_id' => 'srcChannelId',
            'stat_comments' => 'statComments',
            'stat_dislikes' => 'statDislikes',
            'stat_likes' => 'statLikes',
            'stat_views' => 'statViews',
            'status' => 'status',
            'thumbs_default' => 'thumbsDefault',
            'thumbs_high' => 'thumbsHigh',
            'thumbs_medium' => 'thumbsMedium',
            'title' => 'title',
            'tags' => 'tags',
            'exclusive' => 'exclusive',
            'dt_sync' => 'dateSync',
        );
    }

    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "videos";
    }

    public function beforeSave()
    {
        if (!empty($this->tags) && is_array($this->tags)) {
            $this->tags = json_encode($this->tags);
        } elseif (empty($this->tags)) {
            $this->tags = null;
        }
        return true;
    }    

    /**
     * Assign the data to the video object
     * @param array $data
     */
    public function assignData(array $data)
    {
        $this->setSyncDate();
        $this->assignTags($data);
        $this->assign($data);
    }

    private static function beforeFindConditions(&$parameters)
    {
        $conditions = "durationSeconds IS NOT NULL 
                       AND 
                       status = 'public'
                       AND
                       actual=true
                       ";
        if (!empty($parameters['conditions'])) {
            $parameters['conditions'] .= ' AND '.$conditions;
        } else {
            $parameters['conditions'] = $conditions;
        }
    }

    public static function find($params = null)
    {
        self::beforeFindConditions($params);
        return parent::find($params);
    }

    public static function findCurrentlyWatched($params = [])
    {
        self::beforeFindConditions($params);
        return self::find($params);
    }

    public static function findNew($params = [])
    {
        $params['order'] = 'dateCreated DESC';
        return self::find($params);
    }

    public static function findPopular($params = [])
    {
        $params['order'] = 'statViews DESC';
        return self::find($params);
    }

    public static function findExclusive($params = [])
    {
        $params['order'] = 'exclusive DESC';
        return self::find($params);
    }    


}