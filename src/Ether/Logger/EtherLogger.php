<?php

namespace Ether\Logger;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\LineFormatter;

class EtherLogger {
    /* TODO: fetch this from an environment variable */
    const LOG_PATH = '/var/log/ether-server/server.log';

    public static function getLogger(string $name): Logger {
        $logger = new Logger($name);        
        $formatter = new LineFormatter(null, null, false, true);        
        $logHandler = new StreamHandler(EtherLogger::LOG_PATH, Logger::DEBUG);
        $logHandler->setFormatter($formatter);        
        $logger->pushHandler($logHandler);        
        return $logger;
    }
}