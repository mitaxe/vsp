<?php
/**
 * Blog REST API controller
 *
 * PHP version >= 5.3.0
 *
 * @author Taras Pylypenko <pylypenko@edsson.com>
 */

use Phalcon\Mvc\Controller;

class BlogController extends RESTController
{

    public function getArticles()
    {
        $articles = Articles::find(['conditions'=>'actual = true']);
        
        $response =  new ArticlesResponse();
        
        $response->add($articles);

        return $response;
    }


    public function getArticle($id)
    {
        $article = Articles::findFirst(['conditions'=>'id = ?1','bind' => [ 1 => $id]]);

        if (!empty($article)) {
            return new ArticleResponse(
                $article->id,
                $article->title,
                $article->description,
                $article->dateCreated,
                $article->thumbDefault,
                $article->thumbHigh,
                $article->thumbMedium,
                $article->vspVideoId
            );
        }

        return new Response();
    }




}