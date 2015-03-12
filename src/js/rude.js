var map;
var toner;
var tonerLite;
var mapQuestOSM;
var markers = [];
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
	sidebarClick(parseInt($(this).attr('id'), 10));
});

icon = new L.Icon({
	iconUrl: 'assets/img/signpost-icon.png',
	iconSize: [32, 37]
});

iconURLs = {
	en: 'assets/img/United-Kingdom32.png',
	it: 'assets/img/Italy32.png'
}

var PlaceIcon = L.Icon.extend({
	options: {
		iconSize: [32, 32],
		iconAnchor: [16, 16],
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
		coords.push(latlng);
		markers[feature.properties.id] = marker;

		// markerClusters.addLayer(marker);
		return marker;
	},
	onEachFeature: function(feature, layer) {
		if (feature.properties && feature.properties.label) {
			//var permalink = RudePlacesMap.server_name + '?id=' + feature.properties.id;
			var permalink = window.location.pathname + '?id=' + feature.properties.id + '&lang=en';

			var popup = '<div class="rude-place-popup">';
			popup += '<p>' + feature.properties.label + '</p>';
			popup += '<p><a href="' + permalink + '">Permalink to this place ...</a></p>';
			popup += '</div>';
			layer.bindPopup(popup);
			// layer.on('mouseover', function(e) {
			// 	e.target.openPopup();
			// });
			layer.on('click', function(e) {
				e.target.openPopup();
			});

			englishLabels[feature.properties.id] = {
				stamp: L.stamp(layer),
				feature: feature,
				layer: layer
			};

			englishSearch.push({
				source: 'English',
				label: feature.properties.label,
				// id: L.stamp(layer),
				id: feature.properties.id,
				lat: feature.geometry.coordinates[1],
				lng: feature.geometry.coordinates[0],
				popup: popup,
				marker: layer,
			});
		}
	}
});

$.getJSON('assets/data/rude-en.geojson', function(data) {
	english.addData(data);
	map.addLayer(englishLayer);
	// markerClusters.addLayer(english);
});

italianLayer = L.geoJson(null);
italian = L.geoJson(null, {
	pointToLayer: function(feature, latlng) {
		var marker = new L.Marker(latlng, { icon: icons.it });
		coords.push(latlng);
		markers[feature.properties.id] = marker;

		// markerClusters.addLayer(marker);
		return marker;
	},
	onEachFeature: function(feature, layer) {
		if (feature.properties && feature.properties.label) {
			//var permalink = RudePlacesMap.server_name + '?id=' + feature.properties.id;
			var permalink = window.location.pathname + '?id=' + feature.properties.id + '&lang=it';

			var popup = '<div class="rude-place-popup">';
			popup += '<p>' + feature.properties.label + '</p>';
			popup += '<p><a href="' + permalink + '">Permalink to this place ...</a></p>';
			popup += '</div>';
			layer.bindPopup(popup);
			// layer.on('mouseover', function(e) {
			// 	e.target.openPopup();
			// });
			layer.on('click', function(e) {
				e.target.openPopup();
			});

			italianLabels[feature.properties.id] = {
				stamp: L.stamp(layer),
				feature: feature,
				layer: layer
			};

			italianSearch.push({
				source: 'Italian',
				label: feature.properties.label,
				// id: L.stamp(layer),
				id: feature.properties.id,
				lat: feature.geometry.coordinates[1],
				lng: feature.geometry.coordinates[0],
				popup: popup,
				marker: layer,
			});
		}
	}
});

$.getJSON('assets/data/rude-it.geojson', function(data) {
	italian.addData(data);
	// map.addLayer(italianLayer);
});

$(document).one('ajaxStop', function() {
	console.log('one:ajaxStop active');
	$('#loading').hide();

	// console.log('Rebuild featureList');
	// featureList = new List("features", {valueNames: ["feature-name"]});
	// featureList.sort("feature-name", {order:"asc"});
	rebuildFeatureList(englishLabels);

	// console.log('English Search');
	// console.log(englishSearch);
	var englishBH = new Bloodhound({
		name: 'English',
		datumTokenizer: function(d) {
			return Bloodhound.tokenizers.whitespace(d.label);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: englishSearch,
		limit: 10
	});

	// console.log('Italian Search');
	// console.log(italianSearch);
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

	// englishLabels = sortLabels(englishLabels);
	// console.log(Object.keys(englishLabels).length + ' english labels');
	//
	// italianLabels = sortLabels(italianLabels);
	// console.log(Object.keys(italianLabels).length + ' italian labels');


	// englishLabels = $.grep(englishLabels,function(n){ return(n) });
	//
	// englishLabels.sort(function(a, b) {
	// 	if (a.properties.label < b.properties.label) {
	// 		return -1;
	// 	}
	// 	if (a.properties.label > b.properties.label) {
	// 		return 1;
	// 	}
	// 	return 0;
	// });
	//
	// $.each(englishLabels, function(index, feature) {
	// 	$("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer)'" permalink="' + feature.properties.id + '" lat="' + feature.geometry.coordinates[1] + '" lng="' + feature.geometry.coordinates[0] + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/signpost-icon.png"></td><td class="feature-name">' + feature.properties.label + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
	// });

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
		if (datum.source === 'English') {
			if (!map.hasLayer(englishLayer)) {
				map.addLayer(englishLayer);
			}
			if (map.hasLayer(italianLayer)) {
				map.removeLayer(italianLayer);
			}
			map.setView([datum.lat, datum.lng], 10);
			datum.marker.fire('click');
		}
		if (datum.source === 'Italian') {
			if (!map.hasLayer(italianLayer)) {
				map.addLayer(italianLayer);
			}
			if (map.hasLayer(englishLayer)) {
				map.removeLayer(englishLayer);
			}
			map.setView([datum.lat, datum.lng], 10);
			datum.marker.fire('click');
		}
		// if (datum.source === "English" || datum.source === 'Italian') {
		// 	// markerClusters.zoomToShowLayer(datum.marker);
		// 	map.setView([datum.lat, datum.lng], 10);
		// 	datum.marker.fire('click');
		// 	// datum.marker.openPopup();
		// 	// if (map._layers[datum.id]) {
		// 	// 	map._layers[datum.id].fire("click");
		// 	// }
		// }
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

	// console.log('Rebuild featureList');
	rebuildFeatureList(englishLabels);
	// featureList = new List("features", {valueNames: ["feature-name"]});
	// featureList.sort("feature-name", {order:"asc"});

	console.log(permaLink);

	if (permaLink.id && permaLink.lang) {
		if (permaLink.lang === 'en' && englishLabels.hasOwnProperty(permaLink.id)) {
			if (!map.hasLayer(englishLayer)) {
				map.addLayer(englishLayer);
			}
			if (map.hasLayer(italianLayer)) {
				map.removeLayer(italianLayer);
			}
			var datum = englishLabels[permaLink.id]
			console.log(datum);
			map.setView(datum.layer.getLatLng(), 10);
			datum.layer.fire('click');
		}

		if (permaLink.lang === 'it' && italianLabels.hasOwnProperty(permaLink.id)) {
			if (!map.hasLayer(italianLayer)) {
				map.addLayer(italianLayer);
			}
			if (map.hasLayer(englishLayer)) {
				map.removeLayer(englishLayer);
			}
			var datum = italianLabels[permaLink.id]
			console.log(datum);
			map.setView(datum.layer.getLatLng(), 10);
			datum.layer.fire('click');
		}
	}
	else {
		console.log('No permalink detected');
	}
	console.log('one:ajaxStop complete');
});

$("#list-btn").click(function() {
	$('#sidebar').toggle();
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

function sidebarClick(id) {
	console.log('sidebarClick for ', id);
	var layer = markerClusters.getLayer(id);
	map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 10);
	layer.fire("click");
	/* Hide sidebar and go to the map on small screens */
	if (document.body.clientWidth <= 767) {
		$("#sidebar").hide();
		map.invalidateSize();
	}
}

function syncSidebar() {
	console.log('syncSidebar');

	// $.each(labels, function(index, feature) {
	// 	$("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer)'" permalink="' + feature.properties.id + '" lat="' + feature.geometry.coordinates[1] + '" lng="' + feature.geometry.coordinates[0] + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/signpost-icon.png"></td><td class="feature-name">' + feature.properties.label + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
	// });

	/* Empty sidebar features */
	console.log('empty sidebar');
	$("#feature-list tbody").empty();
	//
	if (map.hasLayer(englishLayer)) {
		console.log('has englishLayer');
		// console.log(englishLayer);
		// console.log(Object.keys(englishLabels).length + ' labels');
		$.each(englishLabels, function(index, obj) {
			// console.log('i:', index, ' s:', obj.stamp, ' p:', obj.feature.properties.id, obj.feature.properties.label);
			var stamp = obj.stamp;
			var feature = obj.feature;
			// console.log('<tr class="feature-row" id="' + stamp + '" permalink="' + feature.properties.id + '" lang="en" lat="' + feature.geometry.coordinates[1] + '" lng="' + feature.geometry.coordinates[0] + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/signpost-icon.png"></td><td class="feature-name">' + feature.properties.label + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');

			$("#feature-list tbody").append('<tr class="feature-row" id="' + stamp + '" permalink="' + feature.properties.id + '" lang="en" lat="' + feature.geometry.coordinates[1] + '" lng="' + feature.geometry.coordinates[0] + '"><td style="vertical-align: middle;"><img width="16" height="18" src="' + iconURLs.en + '"></td><td class="feature-name">' + feature.properties.label + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
		});
		rebuildFeatureList(englishLabels);
	}

	if (map.hasLayer(italianLayer)) {
		console.log('has italianLayer');
		// console.log(italianLayer);
		// console.log(Object.keys(italianLabels).length + ' labels');

		$.each(italianLabels, function(index, obj) {
			// console.log('i:', index, ' s:', obj.stamp, ' p:', obj.feature.properties.id, obj.feature.properties.label);
			// console.log(index, obj);
			var stamp = obj.stamp;
			var feature = obj.feature;
			$("#feature-list tbody").append('<tr class="feature-row" id="' + stamp + '" permalink="' + feature.properties.id + '" lang="it" lat="' + feature.geometry.coordinates[1] + '" lng="' + feature.geometry.coordinates[0] + '"><td style="vertical-align: middle;"><img width="16" height="18" src="' + iconURLs.it + '"></td><td class="feature-name">' + feature.properties.label + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
		});

		rebuildFeatureList(italianLabels);
	}

	//
	// if (map.hasLayer(italianLayer)) {
	// 	$.each(italianLabels, function(index, obj) {
	// 		console.log(index, obj);
	// 		var stamp = obj.stamp;
	// 		var feature = obj.feature;
	// 		$("#feature-list tbody").append('<tr class="feature-row" id="' + stamp + '" permalink="' + feature.properties.id + '" lat="' + feature.geometry.coordinates[1] + '" lng="' + feature.geometry.coordinates[0] + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/signpost-icon.png"></td><td class="feature-name">' + feature.properties.label + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
	// 	});
	// }

	/* Loop through theaters layer and add only features which are in the map bounds */
	// english.eachLayer(function (layer) {
	// 	if (map.hasLayer(englishLayer)) {
	// 		if (map.getBounds().contains(layer.getLatLng())) {
	// 			$("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
	// 		}
	// 	}
	// });
	/* Loop through museums layer and add only features which are in the map bounds */
	// italian.eachLayer(function (layer) {
	// 	if (map.hasLayer(italianLayer)) {
	// 		if (map.getBounds().contains(layer.getLatLng())) {
	// 			$("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
	// 		}
	// 	}
	// });

	/* Update list.js featureList */
	// console.log('Rebuild featureList');
	// featureList = new List("features", {
	// 	valueNames: ["feature-name"]
	// });
	// featureList.sort("feature-name", {
	// 	order: "asc"
	// });
}

function sortLabels(labels) {
	console.log('sortLabels');
	labels = $.grep(labels,function(n){ return(n) });

	labels.sort(function(a, b) {
		if (a.feature.properties.label < b.feature.properties.label) {
			return -1;
		}
		if (a.feature.properties.label > b.feature.properties.label) {
			return 1;
		}
		return 0;
	});

	console.log(labels);
	return labels;
}

function rebuildFeatureList(list) {
	// console.log(Object.keys(englishLabels).length + ' english labels');

	/* Update list.js featureList */
	// console.log('Rebuild featureList');
	featureList = new List("features", {
		valueNames: ["feature-name"],
		page: Object.keys(list).length
	});
	featureList.sort("feature-name", {
		order: "asc"
	});
	console.log('Rebuilt featureList with ' + featureList.size() + ' of ' + Object.keys(list).length + ' entries');
}

function sizeLayerControl() {
	$(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

// Map Base Layers

toner = L.stamenTileLayer('toner');
tonerLite = L.stamenTileLayer('toner-lite');
mapQuestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
	maxZoom: 19,
	subdomains: ["otile1", "otile2", "otile3", "otile4"],
	attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});

map = L.map('map', {
	zoom: 3,
	center: [0,0],
	layers: [tonerLite, markerClusters],
	zoomControl: false,
	attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
	console.log('overlayadd');
	if (e.layer === englishLayer) {
		console.log('add - english');
		markerClusters.addLayer(english);
		syncSidebar();
	}
	if (e.layer === italianLayer) {
		console.log('add - italian');
		markerClusters.addLayer(italian);
		syncSidebar();
	}
});

map.on("overlayremove", function(e) {
	console.log('overlayremove');
	if (e.layer === englishLayer) {
		console.log('remove - english');
		markerClusters.removeLayer(english);
		syncSidebar();
	}
	if (e.layer === italianLayer) {
		console.log('remove - italian');
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
	"Street Map": mapQuestOSM
};

var groupedOverlays = {
	"Languages": {
		'<img src="assets/img/Italy32.png" width="24" height="28">&nbsp;Italian': italianLayer,
		'<img src="assets/img/United-Kingdom32.png" width="24" height="28">&nbsp;English': englishLayer
	}
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
	exclusiveGroups: ["Places"],
	collapsed: isCollapsed
}).addTo(map);

// map.addLayer(markerCluster);
map.on('zoomend', function() {
	console.log('Zoom: ' + map.getZoom());
});

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
	div.innerHTML = '<span class="hidden-hs"><a href="http://maps.geotastic.org">More Maps?</a> | This is a thing by <a href="http://www.garygale.com">Gary Gale</a> | </span><a href="#" onclick="$(\'#attributionModal\').modal(\'show\'); return false;">Attribution</a>';
	return div;
};
map.addControl(attributionControl);

L.control.mousePosition({
	position: 'topleft',
	emptyString: 'Position Unavailable'
}).addTo(map);

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
	// icon: "icon-direction",
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
	console.log('origin: ' + window.location.origin);
	console.log('href: ' + window.location.href);
	console.log('pathname: ' + window.location.pathname);
	console.log('search: ' + window.location.search);
	console.log('hash: ' + window.location.hash);
	var url = window.location.search.substr(1);
	if (!url) {
		console.log('No search string; defaulting to hash');
		url = window.location.hash.substr(1);
	}
	console.log('url: ' + url);

	if (url !== '') {
		nvps = url.split('&');
		$.each(nvps, function(index, value) {
			var nvp = value.split('=');
			parser(nvp[0], nvp[1]);
		});
	}
}

function paramParser(key, value) {
	console.log(key + ' = ' + value);
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
	console.log('ready active');
	parsePermaLink(paramParser);

	// var coords = [];
	// var markers = new Array();
	// var icon = new L.Icon({
	// 	iconUrl: '/images/signpost-icon.png',
	// 	iconSize: [32, 37]
	// });
	// var tiles = new L.StamenTileLayer("toner");
	// var options = {
	// 	layers: tiles
	// };
	//
	// if (RudePlacesMap.hasOwnProperty('mobile') && RudePlacesMap.mobile) {
	// 	options.zoomControl = false;
	// }
	//
	// var map = new L.Map("map", options);
	//
	// L.geoJson(places, {
	// 	onEachFeature: function(feature, layer) {
	// 		if (feature.properties && feature.properties.label) {
	// 			var permalink = RudePlacesMap.server_name + '?id=' + feature.properties.id;
	// 			var popup = '<div class="rude-place-popup">';
	// 			popup += '<p>' + feature.properties.label + '</p>';
	// 			popup += '<p><a href="' + permalink + '">Permalink to this place ...</a></p>';
	// 			popup += '</div>';
	// 			layer.bindPopup(popup);
	// 			layer.on('mouseover', function(e) {
	// 				e.target.openPopup();
	// 			});
	// 		}
	// 	},
	// 	pointToLayer: function(feature, latlng) {
	// 		var marker = new L.Marker(latlng, { icon: icon });
	// 		coords.push(latlng);
	// 		markers[feature.properties.id] = marker;
	// 		return marker;
	// 	}
	// }).addTo(map);
	//
	// if (RudePlacesMap.hasOwnProperty('place_id')) {
	// 	if (markers.hasOwnProperty(RudePlacesMap.place_id)) {
	// 		map.setView(markers[RudePlacesMap.place_id].getLatLng(), 7);
	// 		markers[RudePlacesMap.place_id].openPopup();
	// 	}
	//
	// 	else {
	// 		var bounds = new L.LatLngBounds(coords);
	// 		map.fitBounds(bounds);
	// 	}
	// }
	//
	// else {
	// 	var bounds = new L.LatLngBounds(coords);
	// 	map.fitBounds(bounds);
	// 	if (RudePlacesMap.hasOwnProperty('mobile') && RudePlacesMap.mobile) {
	// 		map.zoomIn();
	// 	}
	// }
});
