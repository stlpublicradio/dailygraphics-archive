var pymChild = null;

var colors = {
	'brown': '#6b6256',
	'tan': '#a5a585',
	'ltgreen': '#70a99a',
	'green': '#449970',
	'dkgreen': '#31716e',
	'ltblue': '#55b7d9',
	'blue': '#358fb3',
	'dkblue': '#006c8e',
	'yellow': '#f1bb4f',
	'orange': '#f6883e',
	'tangerine': '#e8604d',
	'red': '#cc203b',
	'pink': '#c72068',
	'maroon': '#8c1b52',
	'purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {
	var northEast = L.latLng(41.6136, -88.0988),
		southWest = L.latLng(34.9957, -96.7741),
		bounds = L.latLngBounds(southWest, northEast);

	var map = L.map('map', {
		scrollWheelZoom: false,
		attribution: ''
	}).setView([38.464252, -91.831833], 7).setMaxBounds(bounds);


	var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
	    .addTo(map);

	var svg = d3.select(map.getPanes().overlayPane).append("svg"),
		g = svg.append("g").attr("class", "leaflet-zoom-hide");

	// update filename, collection name

	d3.json("fema_mo_year.geojson", function (error, geodata) {

		var regions = geodata;
		var geojson;


		//set up styling logic

		function getColor(d) {

			//example logic to get color based on number
			
			return d <= '2001' ? colors.dkgreen :
				colors.pink

		}

		function onEachFeature(feature, layer) {
			// does this feature have a property named popupContent?
			if (feature.properties) {
				layer.bindPopup('Year: ' + feature.properties.FY);
			}
		}

		geojson = L.geoJson(regions, {
			pointToLayer: function (feature, latlon) {

				return L.circleMarker(latlon, {
					radius: 5,
					fillColor: getColor(feature.properties.FY),
					weight: 0,
					opacity: 1,
					fillOpacity: .5
				})
			},
			onEachFeature: onEachFeature
		}).addTo(map);

		// add legend

		var legend = L.control({
			position: 'bottomright'
		});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend')

			// Legend with strings
			div.innerHTML = '<i style="background:' + colors.dkgreen + '"></i> Bought out before 2002<br /><i style="background:' + colors.pink + '"></i> Bought out from 2002-2016<br />';


			return div;
		};

		legend.addTo(map);

	})

	if (pymChild) {
		pymChild.sendHeight();
	}
}

/*
 * NB: Use window.load instead of document.ready
 * to ensure all images have loaded
 */
$(window).load(function () {
	pymChild = new pym.Child({
		renderCallback: render
	});
})