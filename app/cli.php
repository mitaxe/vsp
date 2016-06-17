<?php

use Phalcon\Di\FactoryDefault\Cli as CliDI,
    Phalcon\Cli\Console as ConsoleApp;
use Phalcon\Db\Adapter\Pdo\Postgresql as DbAdapter;
use Phalcon\Config\Adapter\Ini as ConfigIni;

define('VERSION', '1.0.0');

// Using the CLI factory default services container
$di = new CliDI();

// Define path to application directory
defined('APPLICATION_PATH')
|| define('APPLICATION_PATH', realpath(dirname(__FILE__)));

/**
 * Register the autoloader and tell it to register the tasks directory
 */
$loader = new \Phalcon\Loader();
$loader->registerDirs(
    array(
        APPLICATION_PATH . '/Tasks',
        APPLICATION_PATH . '/Models',
        APPLICATION_PATH . '/Components'
    )
);

$loader->registerNamespaces(
    array(
        "RollingCurl"    => "vendor/chuyskywalker/rolling-curl/src/RollingCurl",
    )
);
/*$loader->registerClasses(
    array(
        "RollingCurlX"  => APPLICATION_PATH . '/../vendor/rollingcurlx/rollingcurlx.class.php',
    )
);*/


$loader->register();

// Load the configuration file (if any)
if (is_readable(APPLICATION_PATH . '/Config/config.ini')) {
    $config = new ConfigIni(APPLICATION_PATH . '/Config/config.ini');
    $di->set('config', $config);
}

// Set database connection
$di->set('db', function () use ($di) {
    return new DbAdapter(array(
        "host"     => $di->get('config')->database->host,
        "username" => $di->get('config')->database->username,
        "password" => $di->get('config')->database->password,
        "dbname"   => $di->get('config')->database->dbname,
        "persistent" => true,
    ));
});

// Set remote data provider
$di->set('dataProvider', new DataProvider($di->get('config')));

// Create a console application
$console = new ConsoleApp();
$console->setDI($di);

/**
 * Process the console arguments
 */
$arguments = array();
foreach ($argv as $k => $arg) {
    if ($k == 1) {
        $arguments['task'] = $arg;
    } elseif ($k == 2) {
        $arguments['action'] = $arg;
    } elseif ($k >= 3) {
        $arguments['params'][] = $arg;
    }
}

// Define global constants for the current task and action
define('CURRENT_TASK',   (isset($argv[1]) ? $argv[1] : null));
define('CURRENT_ACTION', (isset($argv[2]) ? $argv[2] : null));

try {
    // Handle incoming arguments
    $console->handle($arguments);
} catch (\Phalcon\Exception $e) {
    echo $e->getMessage();
    exit(255);
}