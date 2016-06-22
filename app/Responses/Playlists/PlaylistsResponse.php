<?php

class PlaylistsResponse extends ResponseArray
{

    public function add($playlists = [])
    {
        if (!count($playlists)) {
            return false;
        }
        foreach ($playlists as $playlist) {
            $videosResponse = new VideosResponse();
            $allVideos = [];
            foreach ($playlist->playlistVideos as $videos) {
                $allVideos[] = $videos->video;
            }

            $videosResponse->add($allVideos);
            $this->addResponse(
                new PlaylistResponse(
                    $playlist->vspPlaylistId,
                    $playlist->vspChannelId,
                    $playlist->title,
                    $playlist->description,
                    $videosResponse->getData()
                ));
        }

    }

}
