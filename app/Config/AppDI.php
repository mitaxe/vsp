<?php

//namespace Config;

use Phalcon\Db\Adapter\Pdo\Postgresql as DbAdapter;
use Phalcon\Config\Adapter\Ini as ConfigIni;
use Phalcon\Security;

//use API\DI\ApiDI;


class AppDI extends ApiDI
{

    public function __construct()
    {
        // Set PhrestDI - Always construct first to set up the app
        parent::__construct();

        // Set up services
        $this->setUpServices();

        // Run final functions before app runs
        return $this->finalize();
    }

    /**
     * Here you can run and final checks etc, its best to do it here
     * as due to the lazy loaded methods, if you tried to run some
     * logic without all of the services being defined, it would throw an error
     *
     * @return APIDI
     */
    public function finalize()
    {
        return $this;
    }

    /**
     * Set up services
     *
     * @return APIDI
     */
    public function setUpServices()
    {
        /*
       * The DI's setShared method provides a singleton instance.
       * If the second parameter is a function, then the service is lazy-loaded
       * on its first instantiation.
       */
        $this->setShared(
            'config',
            function ()
            {
                // Load the configuration file (if any)
                if (is_file(dirname(__DIR__) . '/Config/config.ini')) {
                    return new ConfigIni(dirname(__DIR__) . '/Config/config.ini');
                }
            }
        );

        $this->setShared(
            'collectionConfig',
            function ()
            {
                if (is_file(dirname(__DIR__) . "/Config/collections.yaml"))
                {
                    return new Yaml(dirname(__DIR__) . "/Config/collections.yaml");
                }
            }
        );

        /*
         * Database connection is created based in the parameters defined in the configuration file
         */
        $this->setShared(
            'db',
            function ()
            {
                $config = $this->get('config');

                return new DbAdapter(
                    array(
                        "host" => $config->database->host,
                        "username" => $config->database->username,
                        "password" => $config->database->password,
                        "dbname" => $config->database->dbname
                    )
                );
            }
        );

        $this->set('security', function () {

            $security = new Security();

            // Устанавливаем фактор хеширования в 12 раундов
            $security->setWorkFactor(12);

            return $security;
        }, true);

        return $this;
    }
}
