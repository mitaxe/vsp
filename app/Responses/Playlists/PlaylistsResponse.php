<?php

class PlaylistsResponse extends ResponseArray
{

    public function add($playlists = [])
    {
        if (count($playlists)) {
            return false;
        }
        foreach ($playlists as $playlist) {
            $this->addResponse(
                new PlaylistResponse(
                    $playlist->vspPlaylistId,
                    $playlist->vspChannelId,
                    $playlist->title,
                    $playlist->descritpion,
                    $playlist->videos
                ));
        }

    }

}
