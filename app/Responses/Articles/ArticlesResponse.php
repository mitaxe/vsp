<?php

class ArticlesResponse extends ResponseArray
{

    public function add($articles = [])
    {
        if (empty($articles)) {
            return false;
        }
        foreach ($articles as $article) {
            $this->addResponse(
                new ArticleResponse(
                    $article->id,                 
                    $article->title,
                    $article->description,
                    $article->dateCreated,
                    $article->thumbDefault,
                    $article->thumbHigh,
                    $article->thumbMedium,
                    $article->vspVideoId
                )
            );
        }

    }

}
