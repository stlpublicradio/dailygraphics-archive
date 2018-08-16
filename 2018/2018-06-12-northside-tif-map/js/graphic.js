var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

	var northEast = L.latLng(38.726438,-90.09204),
		    southWest = L.latLng(38.559589,-90.320518),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView(bounds.getCenter(), 14).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
			 d3.json("northside-tif.topojson", function(error, geodata) {
				 
				 var regions = topojson.feature(geodata, geodata.objects.northsidetif);
				 var geojson;
				 
				 
				 //set up styling logic
				 
				 function style(feature) {
						 return {
							 // update property
					         fillColor: colors.dkgreen,
					         weight: 1,
					         opacity: 1,
					         color: colors.yellow,
					         dashArray: '3',
					         fillOpacity: 0.7
					     };
					 }
				 
				 
				 tif = L.geoJson(regions, {
					 style: style,
				 }).addTo(map);
				 
			 })
			 
			 d3.json("nga-pruitt-igoe.topojson", function(error, geodata) {
				 
				var regions = topojson.feature(geodata, geodata.objects.collection);
				var geojson;
				
				
				//set up styling logic

				function getColor(d) {
					if (d == 'Future NGA site') {
						return colors.orange;
					}
					else {
						return colors.dkblue;
					}
				}
				
				function style(feature) {
						return {
							// update property
							fillColor: getColor(feature.properties.name),
							weight: 1,
							opacity: 1,
							color: colors.yellow,
							dashArray: '3',
							fillOpacity: 0.7
						};
					}
				
				
				geojson = L.geoJson(regions, {
					style: style,
				}).addTo(map);


				var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')
					
					 // Legend with strings
					 div.innerHTML = '<i style="background:' + colors.dkgreen + '"></i> TIF area<br /><i style="background:' + colors.orange + '"></i> Future NGA site (currently owned by city)<br /><i style="background:' + colors.dkblue + '"></i> Former Pruitt-Igoe site<br />';
					 

				     return div;
				 };

				 legend.addTo(map);

				 geojson.bringToFront()


				
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
