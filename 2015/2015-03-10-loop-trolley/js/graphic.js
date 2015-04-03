var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.778912, -90.151062),
		    southWest = L.latLng(38.556959, -90.461426),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.653945, -90.293416], 15).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
			 d3.json("route.topojson", function(error, geodata) {
				 
				 var route = topojson.feature(geodata, geodata.objects.collection);

				 d3.json("construction.topojson", function(error, geodata) {
				 
					 var construction = topojson.feature(geodata, geodata.objects.collection);

				 d3.json("stops.topojson", function(error, stops_geodata) {
				 
					 var stops = topojson.feature(stops_geodata, stops_geodata.objects.collection);

					 var route_geojson;
					 var stops_geojson;
					 var construction_geojson;
				 
				 
				 //set up styling logic
				 
					 function getColor(d) {

						 //example logic to get color based on number
						 return d == '1' ? colors.dkgreen :
							 	colors.ltgreen;

					 
						 // example logic to get color based on string
						 // (d == 'dropped' ? colors.green :
						 //  d == 'new' ? colors.red :
						 //  colors.maroon)
						 
						 }
				 
					 function routeStyle(feature) {
							 return {
								 // update property
						         weight: 3,
						         opacity: 1,
						         color: colors.yellow,
						         dashArray: '5',
						         fillOpacity: 0.7
						     };
						 }


					 function constructionStyle(feature) {
							 return {
								 // update property
						         fillColor: getColor(feature.properties.step),
						         fillOpacity: 0.7,
								 weight: 0
						     };
						 }
				 
					 //set up highlighting function
				 
					 function highlightFeature(e) {
					     var layer = e.target;

						 info.update(layer.feature.properties);

					     if (!L.Browser.ie && !L.Browser.opera) {
					         layer.bringToFront();
					     }
					 }
				 
					 function resetHighlight(e) {
						 info.update();
					 }
				 
					 function onEachFeature(feature, layer) {
					     layer.on({
					         mouseover: highlightFeature,
					         mouseout: resetHighlight,
							 click: highlightFeature
					     });
					 }
					 
					 var geojsonMarkerOptions = {
					     radius: 8,
					     fillColor: colors.orange,
					     color: "#000",
					     weight: 1,
					     opacity: 1,
					     fillOpacity: 0.8
					 };
				 
					 route_geojson = L.geoJson(route, {
						 style: routeStyle,
					 }).addTo(map);
					 
					 construction_geojson = L.geoJson(construction, {
						 style: constructionStyle,
					 }).addTo(map);

					 stops_geojson = L.geoJson(stops, {
						 pointToLayer: function(feature, latlng) {
							 return L.circleMarker(latlng, geojsonMarkerOptions);
						 },
						 onEachFeature: onEachFeature,
						 // onEachFeature: onEachFeature
					 }).addTo(map);
				 
					 // add infobox
				 
					 var info = L.control();

					 info.onAdd = function (map) {
					     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
					     this.update();
					     return this._div;
					 };

					 // method that we will use to update the control based on feature properties passed
					 info.update = function (props) {
					     this._div.innerHTML = 					 
						 // example ternary logic for infobox
						 (
							 props ?
							 "<strong>" + props.name + '<br /><img class="stop-image" src="./assets/' + props.photo + '.jpg">' : '<h4>Loop Trolley</h4>The Loop Trolley\'s planned route is shown in yellow. The dark green area will begin construction in mid to late March. The light green area will begin construction in May. After that, construction will either work from the middle of the route to the ends, or start from the ends, meeting at the middle.<br><br>Hover over a stop');
					 };

					 info.addTo(map);
				 
					 // add legend
				 
					 var legend = L.control({position: 'bottomright'});

					 legend.onAdd = function (map) {

					     var div = L.DomUtil.create('div', 'info legend')
					
						 // Legend with strings
						 div.innerHTML = '<i style="background:' + colors.dkgreen + '"></i> Construction: Mid/late March<br /><i style="background:' + colors.ltgreen + '"></i> Construction: May<br /><i style="background:' + colors.orange + '"></i> Stops<br /><i style="background:' + colors.yellow + '"></i> Route';
					 
					     return div;
					 };

					 legend.addTo(map);
				 
			     })
			 })
				 
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
