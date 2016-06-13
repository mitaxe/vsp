<?php
/**
 * Playlists model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;

class Playlists extends Model
{

    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "playlists";
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
            'channel_id' => 'channelId',
            'vsp_playlist_id' => 'vspPlaylistId',
            'vsp_channel_id' => 'vspChannelId',
            'actual' => 'actual',
            'dt_created' => 'dateCreated',
            'dt_published' => 'datePublished',
            'dt_updated' => 'dateUpdated',
            'description' => 'description',
            'thumbs_high' => 'thumbsHigh',
            'thumbs_medium' => 'thumbsMedium',
            'thumbs_default' => 'thumbsDefault',
            'src_id' => 'srcId',
            'src_type' => 'srcType',
            'src_channel_id' => 'srcChannelId',
            'stat_public' => 'statPublic',
            'stat_unlisted' => 'statUnlisted',
            'status' => 'status',
            'title' => 'title',
        );
    }

    public function beforeSave()
    {

    }


}