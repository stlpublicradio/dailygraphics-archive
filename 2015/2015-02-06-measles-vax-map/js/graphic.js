var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(42.688492, -86.835938),
		    southWest = L.latLng(35.538931, -95.625000),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.673945, -90.273416], 6).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
			 d3.json("mo-il-vax.topojson", function(error, geodata) {
				 
				 var regions = topojson.feature(geodata, geodata.objects.counties);
				 var geojson;
				 
				 
				 //set up styling logic
				 
				 function getColor(d) {
					 
					 //example logic to get color based on number
					 return d < .95 ? colors.red :
					 		d < .96 ? colors.tangerine :
					 		d < .97 ? colors.orange :
						 	d < .98 ? colors.yellow :
					 		d < .99 ? colors.green :
						 	colors.dkgreen;
					 
					 // example logic to get color based on string
					 // (d == 'dropped' ? colors.green :
// 					 d == 'new' ? colors.red :
// 					 colors.maroon)
						 
					 }
				 
				 function style(feature) {
						 return {
							 // update property
					         fillColor: getColor(feature.properties.VAX_RATE),
					         weight: 1,
					         opacity: 1,
					         color: '#333',
					         dashArray: '3',
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
				 
				 // add infobox
				 
				 var info = L.control();
				 
				 var pctFmt = d3.format('.2%')

				 info.onAdd = function (map) {
				     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
				     this.update();
				     return this._div;
				 };

				 // method that we will use to update the control based on feature properties passed
				 info.update = function (props) {
					 
					 var digit = /^[0-9]/;
				     this._div.innerHTML = '<h4>Vaccination Rates</h4>Where are there students who haven\'t been vaccinated in our region?' 
					 
					 // example ternary logic for infobox
					 
					 +  (
						 props ?
						 '<h4>' + props.NAMELSAD + ', ' + 
						 
						 (props.GEOID.match(digit = 2) ? 'Mo.</h4>' 
						 : 'Ill.</h4>')
						 
						 + 'Vaccination rate: ' + pctFmt(props.VAX_RATE)
						 
						 
						 : '<br /><br />Hover over a county');
				 };

				 info.addTo(map);
				 
				 // add legend
				 
				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')
						 //update legend
					 					 
					 // Legend with strings
					 // div.innerHTML = '<i style="background:' + colors.red + '"></i> Added to the suit<br /><i style="background:' + colors.maroon + '"></i> Also named in the suit<br /><i style="background:' + colors.green + '"></i> Dropped from the suit<br />';
					 
					 var div = L.DomUtil.create('div', 'info legend'),
					 grades = [.94, .95, .96, .97, .98, .99],
					 text = ['< 95%','95-96%','96-97%','97-98%','98-99%','>99%']
					 labels = [];
					 for (var i = 0; i < grades.length; i++) {
						 	from = grades[i];
							to = grades[i + 1];
							labels.push(
								'<i style="background:' + getColor(grades[i] + .001) + '"></i> ' +
								text[i] );
						}
						div.innerHTML = labels.join('<br>');

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
