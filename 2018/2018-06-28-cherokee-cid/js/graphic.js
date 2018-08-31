var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.59711778869768, -90.24446725845337),
		    southWest = L.latLng(38.603456675921755, -90.21650791168213),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.6007526556,-90.2427560091], 15).setMaxBounds(bounds);



		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

			// update filename, collection name

			 d3.json("cid.topojson", function(error, geodata) {

				 var regions = topojson.feature(geodata, geodata.objects.cid);
				 var geojson;


				 //set up styling logic

				 function getColor(d) {

					 // example logic to get color based on string
					 return (d == 'South Grand CID' ? colors.yellow :
					  d == '2350 S. Grand CID' ? colors.green :
					  colors.maroon)

					 }

				 function style(feature) {
						 return {
							 // update property
					         fillColor: getColor(feature.properties.name),
					         weight: 1,
					         opacity: 1,
					         color: "#efefef",
					         fillOpacity: 0.7
					     };
					 }

				 geojson = L.geoJson(regions, {
					 style: style,
				 }).addTo(map);

				 // add legend

				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')

					 // Legend with strings
					 div.innerHTML = '<i style="background:' + colors.maroon + '"></i> Cherokee CID<br /><i style="background:' + colors.yellow + '"></i> Vacancies<br />';

				     return div;
				 };

				 legend.addTo(map);

			 })
			 
			 d3.json("vacancies.topojson", function(error, geodata) {

				console.log(geodata)

				var regions = topojson.feature(geodata, geodata.objects.vacancies);
				var geojson;



				function style(feature) {
						return {
							// update property
							opacity: .8,
							fillOpacity: .8,
							fillColor: '#f1bb4f',
							color: '#f1bb4f',
							radius: 2
						};
					}

				geojson = L.geoJson(regions, {
					pointToLayer: function(feature, latlng) {
						var popupContent = feature.properties.vacant;
						return L.circleMarker(latlng, style(feature))
					}
				}).addTo(map)

				bounds = geojson.getBounds()
				map.setMaxBounds(bounds)

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
