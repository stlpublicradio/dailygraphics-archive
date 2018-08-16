var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

	
	

		var northEast = L.latLng(38.790795, -90.142819),
		    southWest = L.latLng(38.514907, -90.347454),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.697268, -90.25527], 13).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
			 d3.json("greenspace.topojson", function(error, geodata) {
				 
				 var regions = topojson.feature(geodata, geodata.objects.greenspace);
				 var geojson;
				 
				 
				 //set up styling logic
				 

				 function style(feature) {
					 	if (feature.properties.type == 'neighborhood') {
							return {
								weight: 2,
								opacity: 1,
								color: '#ffffff',
								fillOpacity: 0
							};
						}
						else {
							return {
								fillColor: '#449970',
								fillOpacity: .5,
								opacity: 0

							};
						}
					 }
				 
				 
				 geojson = L.geoJson(regions, {
					 style: style,
				 }).addTo(map);
				 
				 // add legend
				 
				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')
					
					 // Legend with strings
					 div.innerHTML = '<div class="row"><i style="background:' + colors.green + '"></i> Green space focus areas</div><div class="row"><i style="box-shadow: inset 0 0 0 3px #ffffff"></i> Neighborhood boundaries</div>';
					 
				     return div;
				 };

				 legend.addTo(map);

				 var walnutParkIcon = L.divIcon({
					 className: 'neighborhood-icon',
					 html: '<div class="neighborhood-label">Walnut Park East</div>'
					});

				var badenIcon = L.divIcon({
					className: 'neighborhood-icon',
					html: '<div class="neighborhood-label">Baden</div>'
					});

				var wellsGoodfellowIcon = L.divIcon({
					className: 'neighborhood-icon',
					html: '<div class="neighborhood-label">Wells-Goodfellow</div>'
					});

					L.marker([38.697268, -90.25027], {icon:walnutParkIcon}).addTo(map);

					L.marker([38.718261, -90.228002], {icon:badenIcon}).addTo(map);

					L.marker([38.676254, -90.273742], {icon:wellsGoodfellowIcon}).addTo(map);
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
