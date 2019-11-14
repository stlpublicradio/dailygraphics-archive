var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.1648, -91.2705),
		    southWest = L.latLng(37.7217, -92.2814),
			bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView(bounds.getCenter(), 10).setMaxBounds(bounds);
		
		var redIcon = new L.Icon({
			iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name

			d3.json("seizures.topojson", function (error, geodata) {
		
				var regions = topojson.feature(geodata, geodata.objects.seizures);
				var geojson;
		
				geojson = L.geoJson(regions, {

					// set markers to alternate colors and popup with info
					
					pointToLayer: function (feature, latLng) {
							marker = L.marker(latLng, {icon: redIcon})
							marker.bindPopup('<b>Charges Filed: </b>' + feature.properties.ChargesFiled + '<br> <b>Seizure Type: </b>' + feature.properties.PropertySeized + '<br> <b>Estimated Value: </b>' + feature.properties.EstimatedValueofPropertySeized + '<br> <b>Date Seized: </b>' + feature.properties.DateSeized)
							return marker
					}
				})

				
		
				geojson.addTo(map)

				// add legend

				var legend = L.control({position: 'bottomright'});

				legend.onAdd = function (map) {

					var div = L.DomUtil.create('div', 'info legend')

					// Legend with strings
					div.innerHTML = '<i style="background:' + colors.ltgreen + '"></i> Phelps County';

					return div;
				};

				legend.addTo(map);
		
			})
     
			d3.json("phelps.topojson", function(error, geodata) {

				var regions = topojson.feature(geodata, geodata.objects.phelps);
				var phelps;


				//set up styling logic

				function style(feature) {
					console.log(feature)
						return {
							// update property
							fillColor: colors.gray,
							weight: 1,
							opacity: 1,
							color: colors.ltgreen,
							fillOpacity: 0.3
						};
					}

				phelps = L.geoJson(regions, {
					style: style,
				}).addTo(map);
				
			})	 
     
			d3.json("highway.topojson", function(error, geodata) {

				var regions = topojson.feature(geodata, geodata.objects.highway);
				var highway;


				//set up styling logic

				function style(feature) {
					console.log(feature)
						return {
							// update property
							fillColor: colors.red,
							weight: 1,
							opacity: 1,
							color: "#efefef",
							fillOpacity: 0.3
						};
					}

				highway = L.geoJson(regions, {
					style: style,
				}).addTo(map);
				
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
