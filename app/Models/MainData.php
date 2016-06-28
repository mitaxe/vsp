<?php
/**
 * VSP main data model
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */


class MainData
{

    use ModelDataHelper;
    /**
     * @var Dependency Injection container
     */
    protected $di;

    public function __construct($di)
    {
        $this->di = $di;
    }

    /**
     * Define channels table columns according to the JSON data
     * Keys are fields names from JSON data
     * the values are their respective fields aliases from Videos model
     */
    public $videoColumnMap = [
        'id' => 'vspVideoId',
        'brandId' => 'vspChannelId',
        'actual' => 'actual',
        'created' => 'dateCreated',
        'publishedAt' => 'datePublished',
        'updated' => 'dateUpdated',
        'description' => 'description',
        'duration' => [
            'iso0860' => 'durationISO',
            'seconds' => 'durationSeconds',
        ],
        'isEmbeddable' => 'isEmbeddable',
        'isRoot' => 'isRoot',
        'src' => [
            'id' => 'srcId',
            'type' => 'srcType',
            'channelId' => 'srcChannelId',
        ],
        'statistics' => [
            'comments' => 'statComments',
            'dislikes' => 'statDislikes',
            'likes' => 'statLikes',
            'views' => 'statViews',
        ],
        'status' => 'status',
        'thumbnails' => [
            'default' => 'thumbsDefault',
            'high' => 'thumbsHigh',
            'medium' => 'thumbsMedium',
        ],
        'title' => 'title',
        'tags'  => 'tags',
    ];

    /**
     * Define videos table columns according to the JSON data
     * Keys are fields names from JSON data
     * the values are their respective fields aliases from Channels model
     */
    public $channelColumnMap = [
        'id' => 'vspChannelId',
        'idsRef' => [
            'id'    => 'vspRefId',
            'type'  => 'vspRefType'
        ],
        'actual' => 'actual',
        'created' => 'dateCreated',
        'publishedAt' => 'datePublished',
        'updated' => 'dateUpdated',
        'description' => 'description',
        'skin'  => [
            'base' => 'skinBase',
            'bg' => 'skinBg',
            'header' => 'skinHeader',
        ],
        'slug' => 'slug',
        'src'  => [
            'id' => 'srcId',
            'type' => 'srcType',
        ],
        'statistics' => [
            'comments' => 'statComments',
            'dislikes' => 'statDislikes',
            'likes' => 'statLikes',
            'playlists' => 'statPlaylists',
            'subscribers' => 'statSubscribers',
            'videos' => 'statVideos',
            'views' => 'statViews',
        ],
        'status' => 'status',
        'thumbnails' => [
            'default' => 'thumbDefault',
            'high' => 'thumbHigh',
            'medium' => 'thumbMedium'
        ],
        'title' => 'title',
        'tags'  => 'tags',
    ];


    /**
     * Define videos table columns according to the JSON data
     * Keys are fields names from JSON data
     * the values are their respective fields aliases from Playlists model
     */
    public $playlistColumnMap = [
        'id' => 'vspPlaylistId',
        'brandId' => 'vspChannelId',
        'actual' => 'actual',
        'created' => 'dateCreated',
        'publishedAt' => 'datePublished',
        'updated' => 'dateUpdated',
        'description' => 'description',
        'thumbnails' => [
            'default' => 'thumbsDefault',
            'high' => 'thumbsHigh',
            'medium' => 'thumbsMedium'
        ],
        'src' => [
            'id' => 'srcId',
            'type' => 'srcType',
            'channelId' => 'srcChannelId',
        ],
        'statistics' => [
            'items' => [
                'public' => 'statPublic',
                'unlisted' => 'statUnlisted',
            ]
        ],
        'status' => 'status',
        'title' => 'title',
    ];

    /**
     * Get all channels
     * @return array
     */
    public function getChannels()
    {
        $channelsGroups = $this->di->get('dataProvider')->getChannels();

        if (empty($channelsGroups)) {
            return [];
        }
        $dataAvailable = false;
        foreach ($channelsGroups as &$channels) {
            if (empty($channels)) {
                continue;
            }
            $dataAvailable = true;
            foreach ($channels as &$channel) {
                $channel = $this->dataMapping($this->channelColumnMap,$channel);
            }
        }
        return !empty($dataAvailable) ? $channelsGroups : [];
    }

    /**
     * Get channel data
     * @param $channelId
     * @return array
     */
    public function getChannelData($channelId)
    {
        $channel = $this->di->get('dataProvider')->getChannel(['id'=>$channelId]);
        return $this->dataMapping($this->channelColumnMap,$channel);
    }

    /**
     * Get channel's playlists
     * @param Channels $channel
     * @return mixed
     */
    public function getChannelPlaylists(Channels $channel)
    {
        $playlists = $this->di->get('dataProvider')->getChannelPlaylists($channel->vspChannelId);
        
        if (empty($playlists)) {
            return $playlists;
        }
        
        foreach ($playlists as &$playlist) {
            $videos = !empty($playlist['items']) ? $playlist['items'] : '';
            $playlist = $this->dataMapping($this->playlistColumnMap, $playlist);
            $playlist['channelId'] = $channel->id;
            $playlist['videos'] = $videos;
        }
        return $playlists;
    }

    /**
     * Get channel's videos
     * @param Channels $channel
     * @return mixed
     */
    public function getChannelVideos(Channels $channel)
    {
        $videosData = $this->di->get('dataProvider')->getChannelVideos($channel->vspChannelId,$channel->statVideos);
        if (empty($videosData)) {
            return $videosData;
        }
        foreach ($videosData as &$videos) {
            foreach ($videos as &$video) {
                $video = $this->dataMapping($this->videoColumnMap,$video);
                $video['channelId'] = $channel->id;
            }            
        }
        return $videosData;
    }

}