<?php

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

            $videosResponse = new VideosResponse();
            $allVideos = [];
            foreach ($playlist->playlistVideos as $videos) {
                $allVideos[] = $videos->video;
            }
            $videosResponse->add($allVideos);

            return new PlaylistResponse(
                $playlist->vspPlaylistId,
                $playlist->vspChannelId,
                $playlist->title,
                $playlist->description,
                $videosResponse->getData(),
                $playlist->statPublic
            );
        }

        return new Response;
    }
    
}