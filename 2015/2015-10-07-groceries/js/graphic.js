var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

    var southWest = L.latLng(38.35575, -90.981691),
        northEast = L.latLng(38.888837, -89.60609),
        bounds = L.latLngBounds(southWest, northEast);


		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.633945, -90.243416], 11).setMaxBounds(bounds);


		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

			// update filename, collection name

			 d3.json("groceries.json", function(error, geodata) {

				 var regions = geodata;
				 var geojson;


                 var geojsonMarkerOptions = {
                    radius: 6,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };

                function onEachFeature(feature, layer) {

                    layer.bindPopup("<h1>" + layer.feature.properties.name + "</h1><p>" + layer.feature.properties.address + ', ' + layer.feature.properties.zip + "</p>");
                    layer.on({
                		click: popUp
                	});
                }
                function popUp(e) {
                	var layer = e.target;
                    layer.openPopup();
                }

				 geojson = L.geoJson(regions, {
					 pointToLayer: function (feature, latlng) {
                         return L.circleMarker(latlng, geojsonMarkerOptions);
                     },
                     style: function(feature) {
	                        switch (feature.properties.chain) {
                                case 'Other': return {fillColor: "#aaa"};
                                case 'Schnucks':   return {fillColor: "#cc203b"};
		                        case 'Aldi': return {fillColor: "#f1bb4f"};
		                        case 'Shop \'n\' Save': return {fillColor: "#449970"};
		                        case 'Save-A-Lot': return {fillColor: "#55b7d9"};
		}
     },
					 onEachFeature: onEachFeature
				 }).addTo(map);

				 // add legend


var legend = L.control({position: 'bottomright'});
legend.onAdd = function(map) {
	var div = L.DomUtil.create('div', 'info legend')
	div.innerHTML = '<i style="background:#cc203b"></i>Schnucks</br><i style="background:#f1bb4f"></i>Aldi</br><i style="background:#449970"></i>Shop \'n\' Save</br><i style="background:#55b7d9"></i>Save-A-Lot</br><i style="background:#aaa"></i>Other</br>'
	return div;
}
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
