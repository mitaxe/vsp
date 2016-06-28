<?php
/**
 * Channel model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Resultset\Simple as Resultset;

class Channels extends Model
{
    use ModelBulkInsert;
    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "channels";
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
            'vsp_ref_id' => 'vspRefId',
            'vsp_ref_type' => 'vspRefType',
            'actual' => 'actual',
            'dt_created' => 'dateCreated',
            'dt_published' => 'datePublished',
            'dt_updated' => 'dateUpdated',
            'description' => 'description',
            'skin_base' => 'skinBase',
            'skin_bg' => 'skinBg',
            'skin_header' => 'skinHeader',
            'slug' => 'slug',
            'src_id' => 'srcId',
            'src_type' => 'srcType',
            'stat_comments' => 'statComments',
            'stat_dislikes' => 'statDislikes',
            'stat_likes' => 'statLikes',
            'stat_playlists' => 'statPlaylists',
            'stat_subscribers' => 'statSubscribers',
            'stat_videos' => 'statVideos',
            'stat_views' => 'statViews',
            'status' => 'status',
            'thumb_default' => 'thumbDefault',
            'thumb_high' => 'thumbHigh',
            'thumb_medium' => 'thumbMedium',
            'title' => 'title',
            'tags' => 'tags',
            'dt_sync' => 'syncDate',
        );
    }

    public static function getColumnName($columnName)
    {
        return array_search($columnName, self::columnMap());
    }

    public static function findByRawSql($query, $connectionName = 'db')
    {
        if (empty($query)) {
            return [];
        }

        $fields = !empty($query['fields']) ? $query['fields'] : '*';
        $conditions = !empty($query['conditions']) ? $query['conditions'] : '';
        $params = !empty($query['params']) ? $query['params'] : [];
        $limit = !empty($query['limit']) ? ' LIMIT '.$query['limit'] : '';

        $sql   = "SELECT $fields FROM ".self::getSource()." WHERE $conditions $limit";
        $model = new self();
        $model->setConnectionService($connectionName);
        return new Resultset(null, $model, $model->getReadConnection()->query($sql, $params));
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
     * Assign the data to the channel object
     * @param array $data
     */
    public function assignData(array $data)
    {
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
            $channelsTags = [];
            foreach ($data['tags'] as $key => $tagName) {
                $channelsTags[$key] = new ChannelsTags();
                $channelsTags[$key]->tags = new Tags();
                $channelsTags[$key]->tags->name = $tagName;
            }
            $this->channelsTags = $channelsTags;
        }*/
    }
    
    public function setSyncDate()
    {
        $this->syncDate = 'NOW()';
    }

    public static function syncDateSetNull()
    {
        $sql = "UPDATE ".self::getSource()." SET ".self::getColumnName('syncDate') ." = NULL";
        $model = new self();
        return $model->getWriteConnection()->query($sql);
    }

    static public function findPopular($params = [])
    {
        $params['order'] = 'statViews DESC';
        return parent::find($params);
    }
}