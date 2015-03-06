var map;
var toner;
var markers = [];
var coords = [];
var json;
var icon;
var placeSearch = [];

icon = new L.Icon({
	iconUrl: 'assets/img/signpost-icon.png',
	iconSize: [32, 37]
});

json = L.geoJson(null, {
	onEachFeature: function(feature, layer) {
		if (feature.properties && feature.properties.label) {
			//var permalink = RudePlacesMap.server_name + '?id=' + feature.properties.id;
			var permalink = window.location.href + '?id=' + feature.properties.id;

			var popup = '<div class="rude-place-popup">';
			popup += '<p>' + feature.properties.label + '</p>';
			popup += '<p><a href="' + permalink + '">Permalink to this place ...</a></p>';
			popup += '</div>';
			layer.bindPopup(popup);
			layer.on('mouseover', function(e) {
				e.target.openPopup();
			});

			$("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/signpost-icon.png"></td><td class="feature-name">' + layer.feature.properties.label + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
			placeSearch.push({
				label: feature.properties.label,
				id: L.stamp(layer),
				lat: feature.geometry.coordinates[1],
				lng: feature.geometry.coordinates[0]
			});
		}
	},
	pointToLayer: function(feature, latlng) {
		var marker = new L.Marker(latlng, { icon: icon });
		coords.push(latlng);
		markers[feature.properties.id] = marker;
		return marker;
	}
});

$.getJSON('assets/data/rude.geojson', function(data) {
	json.addData(data);
	console.log(data);
});

$(document).one('ajaxStop', function() {
	console.log('one active');
	$('#loading').hide();

	var placesBH = new Bloodhound({
		name: 'Places',
		datumTokenizer: function (d) {
			return Bloodhound.tokenizers.whitespace(d.label);
		},
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: placeSearch,
		limit: 10
	});

	placesBH.initialize();

	$("#searchbox").typeahead({
		minLength: 3,
		highlight: true,
		hint: false
	}, {
		name: "Places",
		displayKey: "label",
		source: placesBH.ttAdapter(),
		templates: {
			header: "<h4 class='typeahead-header'><img src='assets/img/signpost-icon.png' width='24' height='28'>&nbsp;Places</h4>"
		}
	}).on("typeahead:selected", function (obj, datum) {
		if (datum.source === "Places") {
			map.setView([datum.lat, datum.lng], 17);
			if (map._layers[datum.id]) {
				map._layers[datum.id].fire("click");
			}
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
});

$("#sidebar-hide-btn").click(function() {
	$('#sidebar').hide();
	map.invalidateSize();
});



toner = L.stamenTileLayer('toner-lite');
map = L.map('map', {
	zoom: 3,
	center: [0,0],
	layers: [toner, json],
	zoomControl: false,
	attributionControl: false
});

map.on('zoomend', function() {
	console.log('Zoom: ' + map.getZoom());
});

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

$(document).ready(function() {
	console.log('ready active');

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
