<?php

define('BASE_PATH', realpath(dirname(__FILE__)));
spl_autoload_register('AutoLoader');

function AutoLoader($class) {    
    require BASE_PATH . '/' . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';
}