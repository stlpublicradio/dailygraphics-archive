var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

	var northEast = L.latLng(38.8168, -90.046),
	southWest = L.latLng(38.5054, -90.4348),
	bounds = L.latLngBounds(southWest, northEast);

	var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView(bounds.getCenter(), 13).setMaxBounds(bounds);

		var redIcon = new L.Icon({
			iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

		var toTitleCase = function (str) {
			str = str.toLowerCase().split(' ');
			for (var i = 0; i < str.length; i++) {
				str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
			}
			return str.join(' ');
		};

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name


			d3.json("neighborhoods.topojson", function(error, geodata) {

				var regions = topojson.feature(geodata, geodata.objects.neighborhoods);
				var neighborhoods;


				//set up styling logic

				function style(feature) {

					if (feature.properties.NHD_NAME == "The Ville") {

						return {
							// update property
							fillColor: colors.pink,
							weight: 1,
							opacity: 1,
							color: colors.maroon,
							fillOpacity: 0.3
						};

					} else if (feature.properties.NHD_NAME == "Greater Ville") {

						return {
							// update property
							fillColor: colors.ltblue,
							weight: 1,
							opacity: 1,
							color: colors.blue,
							fillOpacity: 0.3
						};

					} else {

						return {
							// update property
							fillColor: colors.gray,
							weight: .5,
							opacity: .5,
							color: colors.tan,
							fillOpacity: 0.1
						};

					}
					}

				neighborhoods = L.geoJson(regions, {
					style: style,
				}).addTo(map);
				
			})	 

			d3.json("murders.topojson", function (error, geodata) {
		

				var regions = topojson.feature(geodata, geodata.objects.murders);
				var geojson;



				function style(feature) {

					if (feature.properties.YEAR == 2019) {
						return {
							// update property
							opacity: .8,
							fillOpacity: .8,
							fillColor: colors.red,
							color: colors.red,
							radius: 4
						};
					} else {
						return {
							// update property
							opacity: .5,
							fillOpacity: .5,
							fillColor: colors.ltgreen,
							color: colors.ltgreen,
							radius: 4
						};
					}

					}

				geojson = L.geoJson(regions, {

					pointToLayer: function (feature, latLng) {
							marker = L.circleMarker(latLng, style(feature))

							weapon = toTitleCase(feature.properties.WEAPON_USED)
							marker.bindPopup('<em>Date: </em>' + feature.properties.DATE + ' <br> <em>Age: </em>' + feature.properties.AGE + '<br><em>Weapon:</em> ' + weapon)
							return marker
					}
				}).addTo(map)
				
		
				// add legend

				var legend = L.control({position: 'bottomright'});

				legend.onAdd = function (map) {

					var div = L.DomUtil.create('div', 'info legend')

					// Legend with strings
					div.innerHTML = '<i style="background:' + colors.pink + '"></i> The Ville <br> <i style="background:' + colors.ltblue + '; margin-top: 4px"></i> The Greater Ville';

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
$(window).load(function() {
    pymChild = new pym.Child({
        renderCallback: render
    });
})
