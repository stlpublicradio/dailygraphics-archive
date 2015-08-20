var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.778912, -89.851062),
		    southWest = L.latLng(38.556959, -90.461426),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.673945, -90.233416], 12).setMaxBounds(bounds);


		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.lm7efc49/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

			// update filename, collection name

			 d3.json("data.topojson", function(error, geodata) {

				 var regions = topojson.feature(geodata, geodata.objects.neighborhoods);
				 var geojson;


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

                var marker = new L.marker([38.672160, -90.252347]).addTo(map);

				 // add infobox

				 var info = L.control();

				 info.onAdd = function (map) {
				     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
				     this.update();
				     return this._div;
				 };

				 // method that we will use to update the control based on feature properties passed
				 info.update = function (props) {
				     this._div.innerHTML = '<h4>North Side School and surrounding neighborhoods</h4>'

					 // example ternary logic for infobox
					 +  (
						 props ?
						 "<strong>" + props.NHD_NAME + '</strong>'					 : '');
				 };

				 info.addTo(map);
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
