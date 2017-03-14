var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(39.5546, -88.3919),
		    southWest = L.latLng(37.6392, -90.8803),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.8, -89.6], 8).setMaxBounds(bounds);


		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

			// update filename, collection name

			 d3.json("pipelines.topojson", function(error, geodata) {

				 var regions = topojson.feature(geodata, geodata.objects.pipelines);
				 var geojson;


				 //set up styling logic

				 function style(feature) {
                        return (feature.properties.Pipename == "Dakota Access" ? {color: colors.yellow,weight:8,dashArray:12,opacity:1} : (feature.properties.contents == "C" ?  {color:colors.brown,weight:4,opacity:1} : {color:colors.tan,weight:4,opacity:1}))
					 }

				 geojson = L.geoJson(regions, {
					 style: style,
				 }).addTo(map);

                 var marker = L.marker([38.753333, -89.095556]).addTo(map);

                 marker.bindPopup("<b>Patoka, Ill.</b>").openPopup();



				 // add legend

				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')

					 // Legend with strings
					 div.innerHTML = '<i style="background:' + colors.yellow + '"></i> Dakota Access Pipeline<br /><i style="background:' + colors.brown + '"></i> Existing crude oil pipelines<br /><i style="background:' + colors.tan + '"></i> Existing petroleum product pipelines<br />';

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
