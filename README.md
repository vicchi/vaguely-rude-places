# Vaguely Rude Place Names Map

## Gentle Introduction

The [Vaguely Rude Place Names Map](http://maps.geotastic.org/rude/) is a simple web mash up of places which, to the British sense of humour, sound vaguely rude and thus are, by definition, funny. If you're not British, it might be confusing why this is amusing.

Meanwhile, [here's a blog post](http://www.vicchi.org/2013/02/06/ooh-that-sounds-rude-mapping-british-innuendo/) which may, or may not, explain how the map came into being.

## License

The source code for the Vaguely Rude Places Map is licensed under the [MIT License](../blob/master/LICENSE.txt).

All [site content](http://maps.geotastic.org/rude/) is licensed under the [Creative Commons Attribution ShareAlike](http://creativecommons.org/licenses/by-sa/4.0/) license.

All GeoJSON and ShapeFile downloads are licensed under the [Open Data Commons Attribution](http://opendatacommons.org/licenses/by/summary/) license.

## Credits

Thanks and credit is due to the following people and organisations:

* [Mark Iliffe](https://twitter.com/markiliffe) for saying to me once that "*you should make a map out of that*"
* [Simone Cortesi](https://twitter.com/simonecortesi) for forking the original map code and producing the [Mappa dei luoghi il cui nome suona vagamente volgare o bizzarro](http://maps.cortesi.com/volgari/index.php)
* [Bryan McBride](https://twitter.com/brymcbride) for making [Bootleaf](https://github.com/bmcbride/bootleaf), which is the foundation on which I built the second version of the map.
* [Steve Karmeinsky](https://twitter.com/stevekennedyuk) and [GB Net](http://www.gbnet.net/) for web hosting.
* All the contributors to the map, on [GitHub](https://github.com/vicchi/vaguely-rude-places/graphs/contributors), by Twitter and by email; thank you one and all.

## Colophon

If you're interested, the Vaguely Rude Places Map is built out of the following, fabulous, open source components:

* [Bootleaf](https://github.com/bmcbride/bootleaf)
* [Leaflet](http://leafletjs.com/) and associated plugins
 * [Leaflet Mouse Position](https://github.com/ardhi/Leaflet.MousePosition)
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

Install the map's [Bower](http://bower.io/) dependencies.

```bash
$ bower install
```

Install the map's [Grunt](http://bower.io/) dependencies.

```bash
$ npm install
```

Build the source.

```bash
$ grunt build
```

By default, the map's `Gruntfile.js` builds for a production environment, with a build target of `dist`, so that

```bash
$ grunt build
```

and

```bash
$ grunt build --target=dist
```

are synonymous.

To build for a development environment, which includes the map's test [Maptiks](https://maptiks.com/) tracking code, and keeping the concatenated Javascript source uncompressed, use the `dev` build target.

```bash
$ grunt build --target=dev
```

If you don't want to use [Maptiks](https://maptiks.com/) map analytics, remove the corresponding dependencies from the `cdndeps` and `concat` Grunt tasks.
