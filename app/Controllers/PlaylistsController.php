<?php
/**
 * Playlists REST API controller
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */

use Phalcon\Mvc\Controller;

class PlaylistsController extends RESTController
{

    public function getPlaylist($id)
    {
        $playlist = Playlists::findFirst([
            'conditions' => "vspPlaylistId = ?1",
            'bind' => [1 => $id]
        ]);
        if (!empty($playlist)) {
            return new PlaylistResponse(
                $playlist->vspPlaylistId,
                $playlist->vspChannelId,
                $playlist->title,
                $playlist->description,
                [],
                $playlist->statPublic
            );
        }
        return new Response;
    }
    
    public function getVideos($vspPlaylistId)
    {
        $playlist = Playlists::findFirst([
            'conditions' => "vspPlaylistId = ?1",
            'bind' => [1 => $vspPlaylistId]
        ]);

        $response = new VideosResponse();

        if (empty($playlist)) {
            return new Response();
        }
        
        $queryParams = [
            'conditions' => "playlistId = ?1",
            'bind' => [1 => $playlist->id],
            'limit' => 24
        ];

        if ($offset = $this->request->getOffset()) {
            $queryParams['offset'] = $offset;
        }
        $playlistVideos = PlaylistsVideos::find($queryParams);
        foreach ($playlistVideos as $item) {
            $response->add([$item->video]);
        }

        return $response;


    }
    
    
}