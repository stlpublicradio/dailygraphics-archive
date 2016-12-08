var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.878912, -90.131062),
		    southWest = L.latLng(38.556959, -90.461426),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.699945, -90.243416], 12).setMaxBounds(bounds);


		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

			// update filename, collection name

			 d3.json("summer_food.topojson", function(error, geodata) {

				 var regions = topojson.feature(geodata, geodata.objects.collection);
				 var geojson;

                 function getColor(d) {
                     return d == 'Hickey Park' ? colors.green : colors.blue;
                 }

                 function getOpacity(d) {
                     return d == 'Hickey Park' ? 0.6 : 0.2;
                 }

				 function style(feature) {
						 return {
							 // update property
                             opacity: 0,
					         color: getColor(feature.properties.place),
					         fillOpacity: getOpacity(feature.properties.place)
					     };
					 }

				 //set up highlighting function

				 function highlightFeature(e) {
				     var layer = e.target;

                     console.log (layer)
				     layer.setStyle({
				         fillColor: getColor(layer.feature.properties.place),
				         fillOpacity: 0.8
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
                         mouseout: resetHighlight,
				     });
				 }

				 geojson = L.geoJson(regions, {
                     pointToLayer: function(feature, latlng) {
                         return L.circle(latlng, 804.67);
                     },
                     style: style,
					 onEachFeature: onEachFeature
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
				     this._div.innerHTML = '<h4>Summer Food Programs</h4>'
                     + (props ? '<p>' + props.place + '<br/>' + props.address + '<br/>' + props.city + '</p>' : '');
				 };

				 info.addTo(map);

				 // add legend

				//  var legend = L.control({position: 'bottomright'});
                 //
				//  legend.onAdd = function (map) {
                 //
				//      var div = L.DomUtil.create('div', 'info legend')

					 // Legend with strings
					 // div.innerHTML = '<i style="background:' + colors.red + '"></i> Added to the suit<br /><i style="background:' + colors.maroon + '"></i> Also named in the suit<br /><i style="background:' + colors.green + '"></i> Dropped from the suit<br />';

					 // Legend with numbers
				// 	 grades = [.94, .95, .96, .97, .98, .99],
				// 	 text = ['< 95%','95-96%','96-97%','97-98%','98-99%','>99%']
				// 	 labels = [];
				// 	 for (var i = 0; i < grades.length; i++) {
				// 		 	from = grades[i];
				// 			to = grades[i + 1];
				// 			labels.push(
				// 				'<i style="background:' + getColor(grades[i] + .001) + '"></i> ' +
				// 				text[i] );
				// 		}
				// 		div.innerHTML = labels.join('<br>');
                 //
                 //
				//      return div;
				//  };
                 //
				//  legend.addTo(map);

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
