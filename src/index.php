<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/autoload.php';

use \Ether\Base\Response;
use \Ether\Logger\EtherLogger;

$log = EtherLogger::getLogger('Index');

$method = $_SERVER['REQUEST_METHOD'];
$log->info("Request method: " . $method);

// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    break;
  case 'PUT':
    break;
  case 'POST':
    break;
  case 'DELETE':
    break;
}

echo json_encode(new Response(true, $_SERVER), JSON_PRETTY_PRINT);
