var stdio = require('stdio');
var fs = require('fs');

var opts = stdio.getopt({
    'input': {key: 'i', args: 1, description: 'Input GeoJSON file', mandatory: true},
    'output': {key: 'o', args: 1, description: 'Output GeoJSON file', mandatory: true},
    'lang': {key: 'l', args: 1, description: 'Language', default: 'en'}
});

var extra = {
    apiKey: '990598cabbde639a4a0fbe5adfad252b',
    language: opts.lang
};
var adapter = 'http';
var provider = 'opencage';
var geocoder = require('node-geocoder').getGeocoder(provider, adapter, extra);

var source = JSON.parse(fs.readFileSync(opts.input, 'utf-8'));
var features = source.features;
features.forEach(function(feature) {
    var coords = feature.geometry.coordinates;

    geocoder.reverse(coords[1], coords[0])
        .then(function(results) {
            console.log(feature.properties.id + ': ' + feature.properties.label);
            var elements = [];
            var res = results[0];
            if (res.hasOwnProperty('streetname') && res.streetName) {
                elements.push(res.streetName);
            }
            if (res.hasOwnProperty('city') && res.city) {
                elements.push(res.city);
            }
            if (res.hasOwnProperty('county') && res.county) {
                elements.push(res.county);
            }
            if (res.hasOwnProperty('state') && res.state) {
                elements.push(res.state);
            }
            if (res.hasOwnProperty('country') && res.country) {
                elements.push(res.country);
            }
            fs.appendFileSync(opts.output, feature.properties.id + ': ' + feature.properties.label + '(' + elements.join(', ') + ')\n');
        })
        .catch(function(err) {
            console.log(err);
        });
});
