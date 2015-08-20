var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.8, -90.0),
		    southWest = L.latLng(38.5, -90.5),
		    bounds = L.latLngBounds(southWest, northEast);
		
		var map = L.mapbox.map('map','stlpr.lm7efc49,stlpr.140266dh', {accessToken: 'pk.eyJ1Ijoic3RscHIiLCJhIjoicHNFVGhjUSJ9.WZtzslO6NLYL8Is7S-fdxg', maxBounds: bounds, minZoom: 12, maxZoom: 16}).setView([38.636, -90.232], 13)
		    
		 // add legend
		 
		 var legend = L.control({position: 'bottomright'});

		 legend.onAdd = function (map) {

		     var div = L.DomUtil.create('div', 'info legend')
			
			 // Legend with strings
			 div.innerHTML = '<i style="background:' + colors.red + '"></i> Owned by Northside Regeneration, LLC; taxes owed<br /><i style="background:rgba(255,83,110,.6)"></i> Owned by Northside Regeneration, LLC; taxes paid<br /><i style="background:' + colors.dkblue + '"></i> Owned by other; taxes owed<br /><i style="background:rgba(85, 183, 217, .6)"></i> Owned by other; taxes paid<br /><i style="background:rgba(165, 165, 133, .2)"></i> Exempt or no information available';
			 			 

		     return div;
		 };

		 legend.addTo(map);
		    
	
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
