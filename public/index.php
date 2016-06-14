<?php
/**
 * API Application loader 
 */

use Phalcon\Loader;


$loader = new Loader();
$loader->registerDirs(array(
    '../app/Controllers/',
    '../app/Models/',
    '../app/Config/',
    '../app/Components/',
    '../app/Responses/Videos/',
    '../app/Responses/Index/',
    '../app/Responses/Channels/',

    '../app/Api/',
    '../app/Api/DI',
    '../app/Api/Request',
    '../app/Api/Exceptions',
    '../app/Api/Response',
    '../app/Api/Controllers',

))->register();

//require dirname(__DIR__) . '/vendor/autoload.php';

// Handle the request
$di = new AppDI();
$app = new RestAPI($di);
$app->handle();