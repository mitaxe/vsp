<?php
/*
use Phalcon\Loader;
use Phalcon\Mvc\View;
use Phalcon\Mvc\Application;
use Phalcon\Di\FactoryDefault;
use Phalcon\Mvc\Url as UrlProvider;
use Phalcon\Db\Adapter\Pdo\Postgresql as DbAdapter;

try {

    // Register an autoloader
    $loader = new Loader();
    $loader->registerDirs(array(
        '../app/Controllers/',
        '../app/Models/',
        '../app/Api/'
    ))->register();

    // Create a DI
    $di = new FactoryDefault();

    // Setup the database service
    $di->set('db', function () {
        return new DbAdapter(array(
            "host"     => "localhost",
            "username" => "postgres",
            "password" => "3s1Ki92f",
            "dbname"   => "vsponline"
        ));
    });
    
    // Setup a base URI so that all generated URIs include the "tutorial" folder
    $di->set('url', function () {
        $url = new UrlProvider();
        return $url;
    });

    // Handle the request
    $application = new Application($di);

    echo $application->handle()->getContent();

} catch (\Exception $e) {
    echo "Exception: ", $e->getMessage();
}*/
/**
 * API Application loader 
 */

use Phalcon\Loader;

//use API\RestAPI;
//use Config\AppDI;

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
// Регистрация пространств имён
/*$loader->registerNamespaces(
    array(
        'Config'    => "app/Config/",
    )
)->register();*/

//require dirname(__DIR__) . '/vendor/autoload.php';

// Handle the request
$di = new AppDI();
$app = new RestAPI($di);
$app->handle();