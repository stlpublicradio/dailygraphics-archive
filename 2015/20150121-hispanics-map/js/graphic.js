var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(43.754632, -87.275391),
		    southWest = L.latLng(35.895725, -95.581055),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([39.623945, -90.243416], 6).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
     
	     d3.csv("moil.csv", function(data) { 
			 d3.json("moil.json", function(error, us) {
				 
				 var counties = topojson.feature(us, us.objects.moil);
				 var geojson;
				 
				 //load data
				 
				 for (var i = 0; i < data.length; i++) {
					 var countyId = data[i].id2;
					 var totalpop = parseFloat(data[i].HD01_VD01)
 					 var hispanic = parseFloat(data[i].HD01_VD03)
 					 var moe = parseFloat(data[i].HD02_VD03)
					 for (var j = 0; j < counties.features.length; j++) {
						 var moilCounty = counties.features[j].properties.GEOID;
						 if (countyId == moilCounty) {
							 counties.features[j].properties.totalpop = totalpop;
							 counties.features[j].properties.hispanic = hispanic;
							 counties.features[j].properties.moe = moe;
							 break;
						 }
					 }
				 }
				 
				 //set up color scale
				 
				 function getColor(d) {
				     return d > .14 ? '#7a0177' :
				            d > .12  ? '#ae017e' :
				            d > .1  ? '#dd3497' :
				            d > .08  ? '#f768a1' :
				            d > .06   ? '#fa9fb5' :
				            d > .04   ? '#fcc5c0' :
				            d > .02   ? '#fde0dd' :
				                       '#fff7f3';
				 }
				 
				 //set up styling logic
				 
				 function style(feature) {
					 if ( feature.properties.moe > (feature.properties.hispanic * .01) ) {
						 return {
							 fillColor: '#aaa',
					         weight: 2,
					         opacity: 1,
					         color: 'white',
					         dashArray: '3',
					         fillOpacity: 0.7
						 }
					 }
					 else {
						 return {
					         fillColor: getColor( feature.properties.hispanic / feature.properties.totalpop),
					         weight: 2,
					         opacity: 1,
					         color: 'white',
					         dashArray: '3',
					         fillOpacity: 0.7
					     };
					 }
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
				 
				 geojson = L.geoJson(counties, {
					 style: style,
					 onEachFeature: onEachFeature
				 }).addTo(map);
				 
				 // add number formatters
				 
				 var popFormat = d3.format(',.0d')
				 var pctFormat = d3.format('.1%')
				 var legendFormat = d3.format('.0%')
				 
				 // add infobox
				 
				 var info = L.control();

				 info.onAdd = function (map) {
				     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
				     this.update();
				     return this._div;
				 };

				 // method that we will use to update the control based on feature properties passed
				 info.update = function (props) {
				     this._div.innerHTML = '<h4>Hispanic Population Density</h4>' +  (
						 props ?
							 (props.moe > props.hispanic * .1) ?
						 	'<b>' + props.NAMELSAD + '</b><br />Margin of error too high to calculate percentage of Hispanic population here.'
							: '<b>' + props.NAMELSAD + '</b><br />Of the ' + popFormat(props.totalpop) + ' people who live here, approximately ' + popFormat(props.hispanic) + ' are Hispanic. That\'s ' + pctFormat(props.hispanic / props.totalpop) + '.'
				         : 'Hover over a county');
				 };

				 info.addTo(map);
				 
				 // add legend
				 
				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend'),
				         grades = [0, .02, .04, .06, .08, .10, .12, .14],
				         labels = [];

				     // loop through our density intervals and generate a label with a colored square for each interval
				     for (var i = 0; i < grades.length; i++) {
				         div.innerHTML +=
				             '<i style="background:' + getColor(grades[i] + .001) + '"></i> ' +
				             legendFormat(grades[i]) + (grades[i + 1] ? '&ndash;' + legendFormat(grades[i + 1]) + '<br>' : '+');
				     }

				     return div;
				 };

				 legend.addTo(map);
				 
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
