var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

	

		var northEast = L.latLng(39.1235, -89.746),
		    southWest = L.latLng(38.089, -91.0863),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.623945, -90.473416], 9).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
			 d3.json("data.topojson", function(error, geodata) {
				 console.log(geodata)
				 
				 var regions = topojson.feature(geodata, geodata.objects.county_council);
				 var geojson;
				 
				 
				 //set up styling logic
				 
				 function getOpacity(d) {
					return (d == 3) ?  0.7 : 0;
				 }
				 
				 function style(feature) {
						 return {
							 // update property
					         fillColor: colors.green,
					         weight: 2,
					         opacity: 1,
					         color: colors.yellow,
					         dashArray: '5',
					         fillOpacity: getOpacity(feature.properties.COUNTY_COU)
					     };
					 }
				 
				 geojson = L.geoJson(regions, {
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
