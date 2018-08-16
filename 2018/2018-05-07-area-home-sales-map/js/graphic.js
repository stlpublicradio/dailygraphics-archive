var pymChild = null;
var fmtThousands = d3.format(',.0f');
var fmtPct = d3.format('.1%');

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(39.191184,-89.817707),
		    southWest = L.latLng(38.096902,-91.03653),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView(bounds.getCenter(), 10).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
			 d3.json("home_prices.topojson", function(error, geodata) {
				 
				 var regions = topojson.feature(geodata, geodata.objects.home_prices);
				 var geojson;
				 
				 console.log(regions)
				 //set up styling logic
				 
				 function getColor(d) {

					if (d == null) {
						return '#333'
					}
					else {
							
						return d < .2 ? "#ECF5F1" :
							d < .4 ? "#B4D6C6" :
							d < .6 ? "#7CB89B" :
							d < .8 ? colors.green :
							colors.dkgreen;
					}

						 
				}

				function getOpacity(d) {
					if (d == null) {
						return 0;
					}
					else {
						return .7
					}
				}
				 
				 function style(feature) {
						 return {
							 // update property
					         fillColor: getColor(feature.properties.price_pct_),
					         weight: 1,
					         opacity: 1,
					         color: '#fff',
					         dashArray: '3',
					         fillOpacity: getOpacity(feature.properties.price_pct_)
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
				 
                 function clickHighlight(e) {
                     geojson.eachLayer( function (layer) {
                         geojson.resetStyle(layer);
                     });
                     highlightFeature(e)
                 }

				 function onEachFeature(feature, layer) {
				     layer.on({
                         mouseover: highlightFeature,
                         mouseout: resetHighlight,
                         click: clickHighlight
				     });
				 }
				 
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


				     this._div.innerHTML = '<h4>Home prices on the rise</h4>The average sale price of a home in St. Louis County rose about 18 percent between 2013 and 2017.<br><br>' 
					 
					 // example ternary logic for infobox
					 +  (
						 props ?
						 props.price_pct_ ? 
						 'There were ' + fmtThousands(props['2017_sales']) + ' homes sold in ' + props.name + ' in 2017, with an average price of ' + props.avg_price + '. The average sale price of a home here increased by ' + (props.price_pct_ * 100).toFixed(1) + ' percent between 2013 and 2017.' : 'Either there were fewer than 20 houses sold in ' + props.name + ' or data was incomplete.'
						 : 'Hover over a municipality for details.');
					 };

				 info.addTo(map);
				 
				 // add legend
				 
				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')
					
					 
					 // Legend with numbers
					 grades = [.0, .2, .4, .6, .8],
					 text = ['0-20%','20-40%','40-60%','60-80%','>80%']
					 labels = [];
					 for (var i = 0; i < grades.length; i++) {
						 	from = grades[i];
							to = grades[i + 1];
							labels.push(
								'<i style="background:' + getColor(grades[i] + .001) + '"></i> ' +
								text[i] );
						}
						div.innerHTML = labels.join('<br>');
					 

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
