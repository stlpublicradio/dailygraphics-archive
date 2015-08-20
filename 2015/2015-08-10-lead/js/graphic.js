var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.842917, -89.918976),
		    southWest = L.latLng(38.396568, -90.596008),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.653945, -90.243416], 12).setMaxBounds(bounds);


		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

			// update filename, collection name

			 d3.json("zips.topojson", function(error, geodata) {
         d3.json("stl.json", function(error, stl) {
				 var regions = topojson.feature(geodata, geodata.objects.zips);
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

         L.geoJson(stl, {
   style: {
     weight: 1,
     color: "#eee",
     fillColor: "#eee",
     opacity: 0.8,
     fillOpacity: 0.1
   }
 }).addTo(map);

				 geojson = L.geoJson(regions, {
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
				     this._div.innerHTML =

					 // example ternary logic for infobox
					 (
						 props ?
						 '<h4>' + props.ZCTA5CE10 + '</h4>'
						 : '<h4>Hover over a ZIP code</h4>');
				 };

				 info.addTo(map);


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
