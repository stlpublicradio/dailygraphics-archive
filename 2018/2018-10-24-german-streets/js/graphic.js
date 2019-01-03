var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.878912, -90.051062),
		    southWest = L.latLng(38.456959, -90.561426),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.633945, -90.273416], 12).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
			 d3.json("output.json", function(error, geodata) {
				 
				 var streets = topojson.feature(geodata, geodata.objects.german)
				 var points = topojson.feature(geodata, geodata.objects.points)
				 var geojson;


				 
				 function style(feature) {
						 return {
							 // update property
					         weight: 5,
					         opacity: 1,
					         color: colors.yellow,
					     };
					 }
				 
				 //set up highlighting function
				 
				 function highlightFeature(e) {
				     var layer = e.target;

				     layer.setStyle({
				         weight: 7,
				        //  color: '#666',
				        //  dashArray: '',
				        //  fillOpacity: 0.7
				     });
					 
					 info.update(layer.feature.properties);

				     if (!L.Browser.ie && !L.Browser.opera) {
				         layer.bringToFront();
				     }
				 }
				 
				 function resetHighlight(e) {
				     streets.resetStyle(e.target);
				     points.resetStyle(e.target);
					 info.update();
				 }
				 
                 function clickHighlight(e) {
                     streets.eachLayer( function (layer) {
                         streets.resetStyle(layer);
					 });
					 points.eachLayer( function (layer) {
						points.resetStyle(layer);
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
				 
				 streets = L.geoJson(streets, {
					 style: style,
					 onEachFeature: onEachFeature
				 }).addTo(map);


				 var geojsonMarkerOptions = {
					radius: 8,
					fillColor: "#ff7800",
					color: colors.yellow,
					weight: 5,
					opacity: 1,
					fillOpacity: 0.8
				};
				
				 points = L.geoJson(points, {
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, geojsonMarkerOptions);
					},
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
					 if (props) {
					 switch (props.name) {
						case 'Providence Pl.':
							this._div.innerHTML = 'Providence Place, formerly Knapstein Place';
							break;
						case 'Gresham Ave.':
							this._div.innerHTML = 'Gresham Avenue, formerly Kaiser Street';
							break;
						case 'Cecil Pl.':
							this._div.innerHTML = 'Cecil Place, formerly Habsburger Avenue';
							break;	
						case 'Enright Ave.':
							this._div.innerHTML = 'Enright Avenue, under review to designate as Von Versen Avenue';
							break;
						case 'Pershing Ave.':
							this._div.innerHTML = 'Pershing Avenue, under review to designate as Berlin Avenue';
							break;
						case 'Robert Prager Way':
							this._div.innerHTML = 'Honorary sign for Robert Prager Way at the corner of Bates and Morganford';
							break;
						case 'Bismark St.':
							this._div.innerHTML = 'Honorary sign for Bismark Street at 7th and Lami';
							break;
						default:
							this._div.innerHTML = props.name;
					 }
					}
					else {
						this._div.innerHTML = 'Some German streets';

					}
					
				}


				 info.addTo(map);
				 
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
