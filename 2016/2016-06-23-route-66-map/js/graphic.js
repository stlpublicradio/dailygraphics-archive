var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(39.050652, -89.543381),
		    southWest = L.latLng(38.088635, -91.378098),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.673945, -90.273416], 9).setMaxBounds(bounds);


		var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/stlpr/cipeg9upl001ubmnukm0w2ura/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RscHIiLCJhIjoicHNFVGhjUSJ9.WZtzslO6NLYL8Is7S-fdxg', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

			// update filename, collection name

			 d3.json("route-66-map.topojson", function(error, geodata) {

				 var regions = topojson.feature(geodata, geodata.objects.collection);
				 var geojson;


				 function style(feature) {
						 return {
							 // update property
					         weight: 2,
					         opacity: .8,
					         color: colors.orange,
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
