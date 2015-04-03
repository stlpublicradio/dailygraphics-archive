var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {
var northEast = L.latLng(38.80, -90.0),
    southWest = L.latLng(38.50, -90.49),
    bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.623945, -90.243416], 11).setMaxBounds(bounds);

var tiles = L.mapbox.tileLayer('stlpr.hi06d4b5')
    .addTo(map);
    
    function onEachFeature(feature, layer) {
    	layer.on({
    		click: popUp
    	});
    }

    function popUp(e) {
    	var layer = e.target;
    	layer.bindPopup("<h1>" + layer.feature.properties.place + "</h1><p>" + layer.feature.properties.address + "</p><p>" + layer.feature.properties.notes + "</p>");
    }
    
    
    var geojsonMarkerOptions = {
    	radius: 4,
    	fillColor: "#cc203b",
    	color: "#aaa",
    	weight: 2,
    	fillOpacity: 1
    }
    
    var events_layer = L.geoJson(data, {
	    pointToLayer: function(feature, latlng) {
		    return L.circleMarker(latlng, geojsonMarkerOptions);
	    },
	    style: function(feature) {
		if (feature.properties.type == 'shooting') {
		return{radius: 8,fillColor: "#cc203b"}
		}
	            switch (feature.properties.type) {
			case 'other_shootings': return {fillColor: "#cc203b"};
	     }
		},
         onEachFeature: onEachFeature
    }).addTo(map);


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
