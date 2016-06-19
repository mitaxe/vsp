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
    
    public function initialize()
    {
        //$this->hasMany("id", "VideosTags", "videoId", ["alias" => "videosTags"]);
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
            'exclusive' => 'exclusive'
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
        /*if (!empty($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }*/        
        $this->assignTags($data);
        $this->assign($data);
    }

    /**
     * Take tags list from the $data['tags'] and create
     * appropriate Tags objects in order to save them to the db
     * @param array $data
     */
    public function assignTags(array &$data)
    {
        if (!empty($data['tags'])) {
            array_walk($data['tags'], function(&$tag){
                $tag = filter_var($tag, FILTER_SANITIZE_SPECIAL_CHARS);
            });
            $data['tags'] = json_encode($data['tags']);
        }        
        /*if (!empty($data['tags'])) {
            $videosTags = [];
            foreach ($data['tags'] as $key => $tagName) {
                 $videosTags[$key] = new VideosTags();
                 $videosTags[$key]->tags = new Tags();
                 $videosTags[$key]->tags->name = $tagName; 
                  
            }
            $this->videosTags = $videosTags;
        }*/
    }

    static public function findCurrentlyWatched($params = [])
    {
        $params['conditions'] = 'actual=true AND status=\'public\'';
        return parent::find($params);
    }

    static public function findNew($params = [])
    {
        $params['order'] = 'dateCreated DESC';
        $params['conditions'] = 'status=\'public\'';
        return parent::find($params);
    }

    static public function findPopular($params = [])
    {
        $params['order'] = 'statViews DESC';
        $params['conditions'] = 'status=\'public\'';
        return parent::find($params);
    }

    static public function findExclusive($params = [])
    {
        $params['order'] = 'exclusive DESC';
        $params['conditions'] = 'status=\'public\'';
        return parent::find($params);
    }    


}