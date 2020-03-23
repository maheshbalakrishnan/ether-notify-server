<?php

namespace Ether\Base;

class Response implements \JsonSerializable {

    public $result = true;

    public $data = [];

    public $error = [];

    public function __construct(bool $result, $data, $error = NULL) {
        $this->result = $result;
        $this->data = $data ?? [];
        $this->error = $error ?? [];
    }

    public function jsonSerialize() {
        return $this;
    }
}