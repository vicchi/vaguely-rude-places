#!/usr/bin/env php
<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';

$getopt = new \GetOpt\GetOpt([
    ['i', 'input', \GetOpt\GetOpt::REQUIRED_ARGUMENT, 'Input GeoJSON file'],
    ['o', 'output', \GetOpt\GetOpt::REQUIRED_ARGUMENT, 'Output GeoJSON file']
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

if (empty($options['i']) || empty($options['o'])) {
    echo $getopt->getHelpText();
    exit;
}

$raw = file_get_contents($options['input']);
$json = json_decode($raw);
if ($json !== NULL) {
	$id = 0;
	if (isset($json->last_id)) {
		$id = intval($json->last_id);
	}
	$features = $json->features;
	for ($i=0; $i<count($features); $i++) {
		$entry = $features[$i];
		$props = $entry->properties;
		if (!isset($props->id)) {
			$id++;
			$props->id = intval($id);
		}
		else {
			$props->id = intval($props->id);
		}
	}
	$json->last_id = intval($id);
	$newjson = json_encode($json, JSON_PRETTY_PRINT);
	file_put_contents($options['output'], $newjson);
}
