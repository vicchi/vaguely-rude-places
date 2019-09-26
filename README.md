# Vaguely Rude Place Names Map

## Gentle Introduction

The [Vaguely Rude Place Names Map](https://www.vaguelyrudeplacesmap.com/) is a simple-ish web mash up of places which, to the British sense of humour, sound vaguely rude and thus are, by definition, funny. If you're not British, it might be confusing why this is amusing.

Meanwhile, here's some blog posts which may, or may not, explain how the map came into being.

* [Ooh that sounds rude; mapping British innuendo](https://www.vicchi.org/2013/02/06/ooh-that-sounds-rude-mapping-british-innuendo/)
* [The internet seems to like the combination of maps and innuendo](https://www.vicchi.org/2013/02/11/the-internet-seems-to-like-the-combination-of-maps-and-innuendo/)
* [I am not at State of the Map 2013 but there is a viral map](https://www.vicchi.org/2013/09/07/i-am-not-at-state-of-the-map-2013/)
* [Vagamente maleducato; the Vaguely Rude Places Map goes international](https://www.vicchi.org/2015/03/22/vagamente-maleducato-the-vaguely-rude-places-map-goes-international/)

## License

The source code for the Vaguely Rude Places Map is licensed under the [MIT License](../blob/master/LICENSE.txt).

All [site content](http://maps.geotastic.org/rude/) is licensed under the [Creative Commons Attribution ShareAlike](http://creativecommons.org/licenses/by-sa/4.0/) license.

All GeoJSON and ShapeFile downloads are licensed under the [Open Data Commons Attribution](http://opendatacommons.org/licenses/by/summary/) license.

## Credits

Thanks and credit is due to the following people and organisations:

* [Mark Iliffe](https://twitter.com/markiliffe) for saying to me once that "*you should make a map out of that*"
* [Simone Cortesi](https://twitter.com/simonecortesi) for forking the original map code and producing the [Mappa dei luoghi il cui nome suona vagamente volgare o bizzarro](http://maps.cortesi.com/volgari/index.php)
* [Bryan McBride](https://twitter.com/brymcbride) for making [Bootleaf](https://github.com/bmcbride/bootleaf), which is the foundation on which I built the second version of the map.
* [Steve Karmeinsky](https://twitter.com/stevekennedyuk) and [GB Net](http://www.gbnet.net/) for originally providing web hosting.
* [OpenCage](https://opencagedata.com) for stepping in and kindly providing hosting after the sad demise of GB Net.
* All the contributors to the map, on [GitHub](https://github.com/vicchi/vaguely-rude-places/graphs/contributors), by Twitter and by email; thank you one and all.

## Colophon

If you're interested, the Vaguely Rude Places Map is built out of the following, fabulous, open source components:

* [Bootleaf](https://github.com/bmcbride/bootleaf)
* [Leaflet](http://leafletjs.com/) and associated plugins
 * [Leaflet Grouped Layer Control](https://github.com/ismyrnow/Leaflet.groupedlayercontrol)
 * [Leaflet Locate Control](https://github.com/domoritz/leaflet-locatecontrol)
 * [Leaflet Marker Cluster](https://github.com/Leaflet/Leaflet.markercluster)
* [Stamen Maps](https://github.com/stamen/maps.stamen.com)
* The SASS port of [Bootstrap](https://github.com/twbs/bootstrap-sass)
* [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
* [List.js](http://www.listjs.com/)
* [typeahead.js](https://twitter.github.io/typeahead.js/)

## Building

Either [fork](https://github.com/vicchi/vaguely-rude-places) or [clone](git@github.com:vicchi/vaguely-rude-places.git) the master GitHub repository.

Install the map's dependencies.

```bash
$ npm install
```

Build the source.

```bash
$ grunt build
```

See also the Grunt `dist` target which builds a distributable tarball.

There's a rudimentary Ansible playbook in `deploy` which is currently targeted at
the map's site at [`www.vaguelyrudeplacesmap.com`](https://www.vaguelyrudeplacesmap.com).
You'll want to edit the `inventory` file to point to your own server if you want to deploy this.
