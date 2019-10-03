#!/usr/bin/env php
<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';

$getopt = new \GetOpt\GetOpt([
    ['i', 'input', \GetOpt\GetOpt::REQUIRED_ARGUMENT, 'Input GeoJSON file'],
    ['o', 'output', \GetOpt\GetOpt::REQUIRED_ARGUMENT, 'Output GeoJSON file'],
    ['c', 'coords', \GetOpt\GetOpt::REQUIRED_ARGUMENT, 'Place coordinates'],
    ['l', 'label', \GetOpt\GetOpt::REQUIRED_ARGUMENT, 'Place label'],
    ['d', 'detail', \GetOpt\GetOpt::REQUIRED_ARGUMENT, 'Place detail'],
    ['?', 'help', \GetOpt\GetOpt::NO_ARGUMENT, 'Show this help']
]);

try {
    try {
        $getopt->process();
    }
    catch (\GetOpt\ArgumentException\Missing $e) {
        if (!$getopt->getOption('help')) {
            throw $e;
        }
    }
}
catch (\GetOpt\ArgumentException $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
}

if ($getopt->getOption('help')) {
    echo $getopt->getHelpText();
    exit;
}

$options = $getopt->getOptions();

if (empty($options['i']) ||
        empty($options['o']) ||
        empty($options['c']) ||
        empty($options['l']) ||
        empty($options['d'])) {
    echo $getopt->getHelpText();
    exit;
}

$raw = file_get_contents($options['input']);
$assoc = true;
$json = json_decode($raw, $assoc);
if (NULL !== $json) {
    $coords = str_replace(' ', '', $options['coords']);
    list($lat, $long) = explode(',', $coords);
    $feature = [
        'type' => 'Feature',
        'geometry' => [
            'type' => 'Point',
            'coordinates' => [
                floatval($long),
                floatval($lat)
            ]
        ],
        'properties' => [
            'label' => $options['label'],
            'detail' => $options['detail']
        ]
    ];
    $json['features'][] = $feature;
    $data = json_encode($json, JSON_PRETTY_PRINT);
    file_put_contents($options['output'], $data);
}
?>
