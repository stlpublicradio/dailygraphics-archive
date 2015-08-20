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

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.643945, -90.203416], 14).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
		
		var ngasite = {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-90.21270990371704,38.64243354998173],[-90.20702362060545,38.641260362011174],[-90.20622968673706,38.643724034567015],[-90.20792484283447,38.64409274018017],[-90.20547866821289,38.651248605204884],[-90.21125078201294,38.6524048722919],[-90.21215200424194,38.64979067662614],[-90.21290302276611,38.648701400278576],[-90.21303176879883,38.645852445382026],[-90.2127742767334,38.64449496232185],[-90.21270990371704,38.64243354998173]]]}}
		
		L.geoJson(ngasite, {
			style: {
				color: '#fff',
				fillColor: '#fff',
				weight: 0.2,
				opacity: 0.2,
				fillOpacity: 0.5
			}
		})
		.addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
			 d3.json("northside.topojson", function(error, geodata) {
				 
				 var regions = topojson.feature(geodata, geodata.objects.parcels);
				 var geojson;
				 
				 
				 //set up styling logic
				 
				 function getColor(d) {

			 //example logic to get color based on number
			 return d == 1 ? colors.red :
				 	colors.dkgreen;

					 
					 // example logic to get color based on string
					 // (d == 'dropped' ? colors.green :
					 //  d == 'new' ? colors.red :
					 //  colors.maroon)
						 
					 }
				 
				 function style(feature) {
						 return {
							 // update property
					         fillColor: getColor(feature.properties.lawsuit),
					         weight: 0,
					         opacity: 0.3,
					         color: '#fff',
					         fillOpacity: 0.7
					     };
					 }
				 
				 //set up highlighting function
				 
				 function highlightFeature(e) {
				     var layer = e.target;

				     layer.setStyle({
				         weight: 5,
				         color: '#666',
				         dashArray: '',
				         fillOpacity: 0.7
				     });
					 
					 info.update(layer.feature.properties);

				     if (!L.Browser.ie && !L.Browser.opera) {
				         layer.bringToFront();
				     }
				 }
				 
				 function resetHighlight(e) {
				     geojson.resetStyle(e.target);
					 info.update();
				 }
				 
				 function onEachFeature(feature, layer) {
				     layer.on({
				         mouseover: highlightFeature,
				         mouseout: resetHighlight
				     });
				 }
				 
				 geojson = L.geoJson(regions, {
					 style: style,
					 onEachFeature: onEachFeature
				 }).addTo(map);
				 
				 
			         var textLatLng = [38.644553, -90.211169];  
			          var myTextLabel = L.marker(textLatLng, {
			              icon: L.divIcon({
			                  className: 'text-labels',   // Set class for CSS styling
			                  html: '<h3>Proposed NGA Site</h3>'
			              }),
			              draggable: false,       // Allow label dragging...?
			              zIndexOffset: 1000     // Make appear above other map features
			          });
				  
				  myTextLabel.addTo(map);
				 
				 
				 // add legend
				 
				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')
					
					 // Legend with strings
					 div.innerHTML = '<i style="background:' + colors.red + '"></i> Parcels named in the suit<br /><i style="background:' + colors.green + '"></i> Parcels not named in the suit<br />';
					 
					 // Legend with numbers
					 // grades = [.94, .95, .96, .97, .98, .99],
					 // text = ['< 95%','95-96%','96-97%','97-98%','98-99%','>99%']
					 // labels = [];
					 // for (var i = 0; i < grades.length; i++) {
					 // 						 	from = grades[i];
					 // 							to = grades[i + 1];
					 // 							labels.push(
					 // 								'<i style="background:' + getColor(grades[i] + .001) + '"></i> ' +
					 // 								text[i] );
					 // 						}
					 // 						div.innerHTML = labels.join('<br>');
					 

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
