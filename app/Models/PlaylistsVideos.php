<?php
/**
 * Playlist videos reference model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


use Phalcon\Mvc\Model;

class PlaylistsVideos extends Model
{

    /**
     * Define table name
     * @return string
     */
    public function getSource()
    {
        return "playlist_videos_xref";
    }

    public function initialize()
    {
        $this->belongsTo("playlistId", "Playlists", "id", ["alias" => "playlist"]);
        //$this->belongsTo("tagId", "Tags", "id");
        
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
            'playlist_id' => 'playlistId',
            'video_id' => 'videoId',
            'position' => 'position',
            'status' => 'status',
            'title' => 'title',
        );
    }

}