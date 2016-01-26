var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

  var data = GRAPHIC_DATA

		var northEast = L.latLng(40.803731, -90.136086),
		    southWest = L.latLng(34.48871, -90.492388),
		    bounds = L.latLngBounds(southWest, northEast);



        		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.673945, -90.273416], 11).setMaxBounds(bounds.pad(50));



		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

				 //set up highlighting function

				 function highlightFeature(e) {
				     var layer = e.target;

					 info.update(layer.feature.properties);
				 }

				 function resetHighlight(e) {
					 info.update();
				 }

				 function onEachFeature(feature, layer) {
				     layer.on({
				         click: highlightFeature
				     });
				 }

				 geojson = L.geoJson(data, {
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
           var html = ''

           if (props) {
             var result = [];
             var location = ''
             $.each(props, function( key, value ) {
             location = value.location;
             title = value.title;
             artist = value.artist;
             image = value.filename;
             var sculpture =
             '<img src="./assets/' + image + '"></img><br />' + ( title ? '<strong>' + title + '</strong><br/><em>' + artist + '</em><hr>' : '' )
             ;
             result.push(sculpture)
             html = result.join('');
           })

         }

				     this._div.innerHTML = (
						 props ?
             (location ? '<h1>' + location + '</h1>' : '') +
             html
            //  $.each(result, function(i, d){
            //    return d[i]
            //  })
             : 'Tap a location to see its art.');
				 };

				 info.addTo(map);

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
