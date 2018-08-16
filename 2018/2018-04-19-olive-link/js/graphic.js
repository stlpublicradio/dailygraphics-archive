var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.689771, -90.293412),
		    southWest = L.latLng(38.645042, -90.369455),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView(bounds.getCenter(), 13).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
			 d3.json("map.topojson", function(error, geodata) {
				 
				 var regions = topojson.feature(geodata, geodata.objects.collection);
				 var geojson;
				 
				 //set up styling logic
				 
				 function getColor(d) {


			 // example logic to get color based on string
			 return   d == 'Interchange' ? colors.blue :
					  d == 'International' ? colors.orange :
					  d == 'Parkway' ? colors.green :
					  colors.tan
						 
					 }
				 
				 function style(feature) {
						 return {
							 // update property
					         fillColor: getColor(feature.properties.name),
					         weight: 1,
					         opacity: 1,
					         color: '#ffffff',
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
					 div.innerHTML = '<div class="row"><i style="background:' + colors.blue + '"></i> Interchange</div><div class="row"><i style="background:' + colors.orange + '"></i> International</div><div class="row"><i style="background:' + colors.green + '"></i> Parkway</div><div class="row"><i style="background:' + colors.tan + '"></i> Industrial</div>';
					 
				     return div;
				 };

				 legend.addTo(map);

				 var redIcon = new L.Icon({
					iconUrl: 'assets/marker-icon-2x-red.png',
					shadowUrl: 'assets/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				  });

				 var marker = L.marker(L.latLng(38.67440390537509,-90.3579193353653), {icon: redIcon}).addTo(map);

				 marker.bindPopup("<b>Jeffrey Plaza</b>").openPopup()

				 
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
