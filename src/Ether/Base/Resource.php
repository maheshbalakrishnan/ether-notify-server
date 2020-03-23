<?php

namespace Ether\Base;

/**
 * Resource interface for REST API
 */
interface Resource {

    public function get();

    public function post();

    public function delete();

}