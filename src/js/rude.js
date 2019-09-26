/* jshint -W069 */

var map;
var toner;
var tonerLite;
var osmMapnik;
var markers = {
	'en': [],
	'it': []
};
var coords = [];
var english;
var englishLayer;
var italian;
var italianLayer;
var icon;
var icons;
var iconURLs;
var englishSearch = [];
var italianSearch = [];
var englishLabels = {};
var italianLabels = {};
var featureList;
var markerClusters;
var permaLink = {
	id: undefined,
	lang: 'en'
};

$(window).resize(function() {
	sizeLayerControl();
});

$(document).on('click', '.feature-row', function(e) {
	var id = $(this).data('id');
	var lang = $(this).data('lang');
	// console.log('.feature-row click fired for id ' + id + ' (' + lang + ')');
	sidebarClick(id, lang);
});

icon = new L.Icon({
	iconUrl: 'assets/img/signpost-icon.png',
	iconSize: [32, 37]
});

iconURLs = {
	en: 'assets/img/United-Kingdom32.png',
	it: 'assets/img/Italy32.png'
};

var PlaceIcon = L.Icon.extend({
	options: {
		iconSize: [32, 32],
		iconAnchor: [16, 32],
		popupAnchor: [0, -32]
	}
});

icons = {
	en: new PlaceIcon({
		iconUrl: iconURLs.en
	}),
	it: new PlaceIcon({
		iconUrl: iconURLs.it
	})
};

markerClusters = new L.MarkerClusterGroup({
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: false,
	zoomToBoundsOnClick: true,
	disableClusteringAtZoom: 16
});

englishLayer = L.geoJson(null);
english = L.geoJson(null, {
	pointToLayer: function(feature, latlng) {
		var marker = new L.Marker(latlng, { icon: icons.en });
		marker.id = feature.properties.id;
		coords.push(latlng);
		markers['en'][feature.properties.id] = marker;
		return marker;
	},
	onEachFeature: function(feature, layer) {
		if (feature.properties && feature.properties.label) {
			var permalink = window.location.pathname + '?id=' + feature.properties.id + '&lang=en';
			var popup = '<div class="rude-place-popup">';
			popup += '<p>' + feature.properties.label + '</p>';
			popup += '<p><a href="' + permalink + '">Permalink to this place ...</a></p>';
			popup += '</div>';

			layer.bindPopup(popup);
			// layer.on('click', function(e) {
			// 	console.log('click fired for id ' + e.target.id);
			// 	// console.log(e);
			// 	// e.target.openPopup();
			// 	markers['en'][e.target.id].openPopup();
			// });
			// layer.on('popupopen', function(e) {
			// 	console.log('popup open fired for id ' + e.target.id);
			// });
			// layer.on('popupclose', function(e) {
			// 	console.log('popup close fired for id ' + e.target.id);
			// });
			// layer.on('add', function(e) {
			// 	console.log('marker add fired for id ' + e.target.id);
			// });
			// layer.on('remove', function(e) {
			// 	console.log('marker remove fired for id ' + e.target.id);
			// });

			englishLabels[feature.properties.id] = {
				lang: 'en',
				id: feature.properties.id,
				feature: feature
			};

			englishSearch.push({
				lang: 'en',
				id: feature.properties.id,
				source: 'English',
				label: feature.properties.label
			});
		}
	}
});

$.getJSON('assets/data/geojson/rude-en.geojson', function(data) {
	english.addData(data);
	map.addLayer(englishLayer);
});

italianLayer = L.geoJson(null);
italian = L.geoJson(null, {
	pointToLayer: function(feature, latlng) {
		var marker = new L.Marker(latlng, { icon: icons.it });
		coords.push(latlng);
		markers['it'][feature.properties.id] = marker;
		return marker;
	},
	onEachFeature: function(feature, layer) {
		if (feature.properties && feature.properties.label) {
			var permalink = window.location.pathname + '?id=' + feature.properties.id + '&lang=it';
			var popup = '<div class="rude-place-popup">';
			popup += '<p>' + feature.properties.label + '</p>';
			popup += '<p><a href="' + permalink + '">Permalink to this place ...</a></p>';
			popup += '</div>';

			layer.bindPopup(popup);
			// layer.on('click', function(e) {
			// 	e.target.openPopup();
			// });

			italianLabels[feature.properties.id] = {
				lang: 'it',
				id: feature.properties.id,
				feature: feature
			};

			italianSearch.push({
				lang: 'it',
				id: feature.properties.id,
				source: 'Italian',
				label: feature.properties.label
			});
		}
	}
});

$.getJSON('assets/data/geojson/rude-it.geojson', function(data) {
	italian.addData(data);
});

$(document).one('ajaxStop', function() {
	$('#loading').hide();
	rebuildFeatureList(englishLabels);

	var englishBH = new Bloodhound({
		name: 'English',
		datumTokenizer: function(d) {
			return Bloodhound.tokenizers.whitespace(d.label);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: englishSearch,
		limit: 10
	});

	var italianBH = new Bloodhound({
		name: 'Italian',
		datumTokenizer: function(d) {
			return Bloodhound.tokenizers.whitespace(d.label);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: italianSearch,
		limit: 10
	});

	englishBH.initialize();
	italianBH.initialize();

	$("#searchbox").typeahead({
		minLength: 3,
		highlight: true,
		hint: false
	}, {
		name: "English",
		displayKey: "label",
		source: englishBH.ttAdapter(),
		templates: {
			header: '<h4 class="typeahead-header"><img src="' + iconURLs.en + '" width="24" height="28">&nbsp;English</h4>'
		}
	}, {
		name: 'Italian',
		displayKey: 'label',
		source: italianBH.ttAdapter(),
		templates: {
			header: '<h4 class="typeahead-header"><img src="' + iconURLs.it + '" width="24" height="28">&nbsp;Italian</h4>'
		}
	}).on("typeahead:selected", function (obj, datum) {
		var target;
		if (datum.source === 'English') {
			// console.log('obj');
			// console.log(obj);
			// console.log('datum');
			// console.log(datum);
			if (!map.hasLayer(englishLayer)) {
				map.addLayer(englishLayer);
			}
			if (map.hasLayer(italianLayer)) {
				map.removeLayer(italianLayer);
			}
			// markerClusters.zoomToShowLayer(datum.marker, function() {});
			// datum.marker.fire('click');
			target = markers['en'][datum.id];
			// console.log('target');
			// console.log(target);
			// markerClusters.zoomToShowLayer(markers['en'][datum.id], function() {});
			// markers['en'][datum.id].fire('click');
			markerClusters.zoomToShowLayer(target, function() {});
			target.fire('click');
		}

		if (datum.source === 'Italian') {
			if (!map.hasLayer(italianLayer)) {
				map.addLayer(italianLayer);
			}
			if (map.hasLayer(englishLayer)) {
				map.removeLayer(englishLayer);
			}
			// markerClusters.zoomToShowLayer(datum.marker, function() {});
			// datum.marker.fire('click');
			// markerClusters.zoomToShowLayer(markers['it'][datum.id], function() {});
			// markers['it'][datum.id].fire('click');
			target = markers['it'][datum.id];
			markerClusters.zoomToShowLayer(target, function() {});
			target.fire('click');
		}

		if ($(".navbar-collapse").height() > 50) {
			$(".navbar-collapse").collapse("hide");
		}
	}).on("typeahead:opened", function () {
		$(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
		$(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
	}).on("typeahead:closed", function () {
		$(".navbar-collapse.in").css("max-height", "");
		$(".navbar-collapse.in").css("height", "");
	});
	$(".twitter-typeahead").css("position", "static");
	$(".twitter-typeahead").css("display", "block");

	rebuildFeatureList(englishLabels);

	if (permaLink.id && permaLink.lang) {
		var datum;
		if (permaLink.lang === 'en' && englishLabels.hasOwnProperty(permaLink.id)) {
			if (!map.hasLayer(englishLayer)) {
				map.addLayer(englishLayer);
			}
			if (map.hasLayer(italianLayer)) {
				map.removeLayer(italianLayer);
			}
			// datum = englishLabels[permaLink.id];
			// markerClusters.zoomToShowLayer(datum.layer, function() {});
			// datum.layer.fire('click');
			datum = markers['en'][permaLink.id];
			markerClusters.zoomToShowLayer(datum, function() {});
			// console.log('firing click for ' + permaLink.id);
			datum.fire('click');
		}

		if (permaLink.lang === 'it' && italianLabels.hasOwnProperty(permaLink.id)) {
			if (!map.hasLayer(italianLayer)) {
				map.addLayer(italianLayer);
			}
			if (map.hasLayer(englishLayer)) {
				map.removeLayer(englishLayer);
			}
			// datum = italianLabels[permaLink.id];
			// markerClusters.zoomToShowLayer(datum.layer, function() {});
			// datum.layer.fire('click');
			datum = markers['it'][permaLink.id];
			markerClusters.zoomToShowLayer(datum, function() {});
			datum.fire('click');
		}
	}
});

$("#list-btn").click(function() {
	$('#sidebar').toggle();
	map.invalidateSize();
	return false;
});

$('#credits-btn').click(function() {
	$('#attributionModal').modal('show');
	return false;
});

$("#nav-btn").click(function() {
	$(".navbar-collapse").collapse("toggle");
});

$("#sidebar-toggle-btn").click(function() {
	$("#sidebar").toggle();
	map.invalidateSize();
	return false;
});
$("#sidebar-hide-btn").click(function() {
	$('#sidebar').hide();
	map.invalidateSize();
});

/* Highlight search box text on click */
$("#searchbox").click(function () {
	$(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
	if (e.which == 13) {
		e.preventDefault();
	}
});

$("#about-btn").click(function() {
	$("#aboutModal").modal("show");
	$(".navbar-collapse.in").collapse("hide");
	return false;
});

$("#full-extent-btn").click(function() {
	var layer;
	if (map.hasLayer(englishLayer)) {
		layer = english;
	}
	else if (map.hasLayer(italianLayer)) {
		layer = italian;
	}
	if (layer) {
		map.fitBounds(layer.getBounds());
		$(".navbar-collapse.in").collapse("hide");
	}
	return false;
});

function sidebarClick(id, lang) {
	// var layer = markerClusters.getLayer(id);
	var layer = markers[lang][id];
	markerClusters.zoomToShowLayer(layer, function() {});
	// console.log('firing click for ' + id);
	layer.fire("click");
	/* Hide sidebar and go to the map on small screens */
	if (document.body.clientWidth <= 767) {
		$("#sidebar").hide();
		map.invalidateSize();
	}
}

function syncSidebar() {
	/* Empty sidebar features */
	$("#feature-list tbody").empty();
	if (map.hasLayer(englishLayer)) {
		$.each(englishLabels, function(index, obj) {
			var stamp = obj.stamp;
			var feature = obj.feature;
			$("#feature-list tbody").append('<tr class="feature-row" data-id="' + obj.id + '" data-permalink="' + feature.properties.id + '" data-lang="en"><td style="vertical-align: middle;"><img width="16" height="18" src="' + iconURLs.en + '"></td><td class="feature-name">' + feature.properties.label + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
		});
		rebuildFeatureList(englishLabels);
	}

	if (map.hasLayer(italianLayer)) {
		$.each(italianLabels, function(index, obj) {
			var stamp = obj.stamp;
			var feature = obj.feature;
			$("#feature-list tbody").append('<tr class="feature-row" id="' + stamp + '" permalink="' + feature.properties.id + '" lang="it" lat="' + feature.geometry.coordinates[1] + '" lng="' + feature.geometry.coordinates[0] + '"><td style="vertical-align: middle;"><img width="16" height="18" src="' + iconURLs.it + '"></td><td class="feature-name">' + feature.properties.label + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
		});
		rebuildFeatureList(italianLabels);
	}
}

function sortLabels(labels) {
	labels = $.grep(labels,function(n){ return(n); });

	labels.sort(function(a, b) {
		if (a.feature.properties.label < b.feature.properties.label) {
			return -1;
		}
		if (a.feature.properties.label > b.feature.properties.label) {
			return 1;
		}
		return 0;
	});

	return labels;
}

function rebuildFeatureList(list) {
	/* Update list.js featureList */
	featureList = new List("features", {
		valueNames: ["feature-name"],
		page: Object.keys(list).length
	});
	featureList.sort("feature-name", {
		order: "asc"
	});
}

function sizeLayerControl() {
	$(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

// Map Base Layers
toner = L.tileLayer.provider('Stamen.Toner');
tonerLite = L.tileLayer.provider('Stamen.TonerLite');
osmMapnik = L.tileLayer.provider('OpenStreetMap.Mapnik');

// toner = L.stamenTileLayer('toner', {
// 	maptiks_id: 'Vaguely Rude Places Map - Stamen Toner'
// });
//
// tonerLite = L.stamenTileLayer('toner-lite', {
// 	maptiks_id: 'Vaguely Rude Places Map - Stamen Toner Lite'
// });
//
// mapQuestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
// 	maxZoom: 19,
// 	subdomains: ["otile1", "otile2", "otile3", "otile4"],
// 	attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.',
// 	maptiks_id: 'Vaguely Rude Places Map - MapQuest OSM'
// });

map = L.map('map', {
	zoom: 3,
	center: [0,0],
	layers: [tonerLite, markerClusters],
	zoomControl: false,
	attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
	if (e.layer === englishLayer) {
		markerClusters.addLayer(english);
		syncSidebar();
	}
	if (e.layer === italianLayer) {
		markerClusters.addLayer(italian);
		syncSidebar();
	}
});

map.on("overlayremove", function(e) {
	if (e.layer === englishLayer) {
		markerClusters.removeLayer(english);
		syncSidebar();
	}
	if (e.layer === italianLayer) {
		markerClusters.removeLayer(italian);
		syncSidebar();
	}
});

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
	var isCollapsed = true;
} else {
	var isCollapsed = false;
}

var baseLayers = {
	"Toner Lite": tonerLite,
	"Toner": toner,
	"OSM": osmMapnik
};

var groupedOverlays = {
	"Languages": {
		'<img src="assets/img/Italy32.png" width="24" height="28">&nbsp;Italian': italianLayer,
		'<img src="assets/img/United-Kingdom32.png" width="24" height="28">&nbsp;English': englishLayer
	}
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
	exclusiveGroups: ["Languages"],
	collapsed: isCollapsed
}).addTo(map);

function updateAttribution(e) {
	$.each(map._layers, function(index, layer) {
		if (layer.getAttribution) {
			$('#attribution').html(layer.getAttribution());
		}
	});
}

map.on('layeradd', updateAttribution);
map.on('layerremove', updateAttribution);

var attributionControl = L.control({
	position: 'bottomright'
});
attributionControl.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'leaflet-control-attribution');
	div.innerHTML = '<span class="hidden-hs">Hosting courtesy of <a href="https://opencagedata.com/" target="_blank">OpenCage</a> | This is a thing by <a href="http://www.garygale.com">Gary Gale</a> | </span><a href="#" onclick="$(\'#attributionModal\').modal(\'show\'); return false;">Credits &amp; Attribution</a>';
	return div;
};
map.addControl(attributionControl);

// L.control.mousePosition({
// 	position: 'topleft',
// 	emptyString: 'Position Unavailable'
// }).addTo(map);

var zoomControl = L.control.zoom({
	position: "bottomright"
}).addTo(map);

var locateControl = L.control.locate({
	position: "bottomright",
	drawCircle: true,
	follow: true,
	setView: true,
	keepCurrentZoomLevel: false,
	markerStyle: {
		weight: 1,
		opacity: 0.8,
		fillOpacity: 0.8
	},
	circleStyle: {
		weight: 1,
		clickable: false
	},
	icon: 'fa fa-location-arrow',
	metric: false,
	strings: {
		title: "My location",
		popup: "You are within {distance} {unit} from this point",
		outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
	},
	locateOptions: {
		maxZoom: 9,
		watch: true,
		enableHighAccuracy: true,
		maximumAge: 10000,
		timeout: 10000
	}
}).addTo(map);

function parsePermaLink(parser) {
	var url = window.location.search.substr(1);
	if (!url) {
		url = window.location.hash.substr(1);
	}

	if (url !== '') {
		nvps = url.split('&');
		$.each(nvps, function(index, value) {
			var nvp = value.split('=');
			parser(nvp[0], nvp[1]);
		});
	}
}

function paramParser(key, value) {
	switch (key) {
		case 'id':
			permaLink.id = parseInt(value);
			break;
		case 'lang':
			permaLink.lang = value;
			break;
		default:
			break;
	}
}

$(document).ready(function() {
	parsePermaLink(paramParser);
});
