var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.778912, -90.151062),
		    southWest = L.latLng(38.530959, -90.461426),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.673945, -90.240416], 13).setMaxBounds(bounds);


		var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/stlpr/cipeg9upl001ubmnukm0w2ura/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RscHIiLCJhIjoicHNFVGhjUSJ9.WZtzslO6NLYL8Is7S-fdxg', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

			// update filename, collection name

			 d3.json("lra.json", function(error, geodata) {
                 console.log(geodata)

				 var regions = topojson.feature(geodata, geodata.objects.lra);
				 var geojson;


				 //set up styling logic

				 function getColor(d) {

					 // example logic to get color based on string
					 return d == "True" ? colors.red :
					  d == "False" ? colors.green :
					  colors.maroon

					 }

				 function style(feature) {
						 return {
							 // update property
					         fillColor: getColor(feature.properties.lra_buildi),
					         weight: 0,
					         opacity: 0,
					         fillOpacity: 0.7,
                             clickable: false,
                             smoothFactor: .25,
                             noClip: true
					     };
					 }

				 geojson = L.geoJson(regions, {
					 style: style,
				 }).addTo(map);

				 // add legend

				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')

					//  Legend with strings
					 div.innerHTML = '<i style="background:' + colors.red + '"></i> Parcels with buildings<br /><i style="background:' + colors.green + '"></i> Vacant land';

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
