var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.664751, -90.181274),
		    southWest = L.latLng(38.621422, -90.243932),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.647501, -90.206706], 16).setMaxBounds(bounds);
		

        var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
            .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
     	   		d3.csv("data.csv", function (data) {
			 d3.json("nga_parcels.topojson", function(error, geodata) {
				 
				 var regions = topojson.feature(geodata, geodata.objects.parcels);
				 var geojson;
				 
				 // load data
				 
				 for (var i = 0; i < data.length; i++) {
					 var parcelNumber = data[i].parcel;
					 var address = data[i].address;
					 var acquired = data[i].acquired;
					 
					 for (var j = 0; j < regions.features.length; j++) {
						 var mapParcel = regions.features[j].properties.parcel;
						 if (parcelNumber == mapParcel) {
							 regions.features[j].properties.parcelNumber = parcelNumber;
							 regions.features[j].properties.address = address;
							 regions.features[j].properties.acquired = acquired;
							 break;
						 }
					 }
				 }
								 
				 
				 //set up styling logic
				 
				 function getColor(d) {

			 //example logic to get color based on number
			 // return d < .95 ? colors.red :
			 // 		d < .96 ? colors.tangerine :
			 // 		d < .97 ? colors.orange :
			 // 				 	d < .98 ? colors.yellow :
			 // 		d < .99 ? colors.green :
			 // 				 	colors.dkgreen;

					 
					 // example logic to get color based on string
            			 return d.acquired == 'city' ? colors.ltblue :
            			 d.acquired == 'tax' ? colors.yellow :
                         d.acquired == 'other' ? colors.green :
                         colors.brown;

						 
					 }
					 
				 
				 function style(feature) {
						 return {
							 // update property
					         fillColor: getColor(feature.properties),
						 color: colors.yellow,
						 weight: 1,
					         opacity: .2,
					         dashArray: '3',
						 fillOpacity: .7
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
				 
				 function onEachFeature(feature, layer) {
				     layer.on({
				         mouseover: highlightFeature,
				         mouseout: resetHighlight
				     });
				 }
				 
				 geojson = L.geoJson(regions, {
					 style: style,
					 onEachFeature: onEachFeature
				 }).addTo(map);
				 
				 // add text overlay for Pruitt-Igoe
				 
			         var textLatLng = [38.643553, -90.211169];  
			          var myTextLabel = L.marker(textLatLng, {
			              icon: L.divIcon({
			                  className: 'text-labels',   // Set class for CSS styling
			                  html: '<h3>Former Pruitt-Igoe Site</h3>'
			              }),
			              draggable: false,       // Allow label dragging...?
			              zIndexOffset: 1000     // Make appear above other map features
			          });
				  
				  myTextLabel.addTo(map);
				 
				 // add infobox
				 
				 var info = L.control();

				 info.onAdd = function (map) {
				     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
				     this.update();
				     return this._div;
				 };

				 // method that we will use to update the control based on feature properties passed
				 info.update = function (props) {
					 
					 fmtCurrency = d3.format('$,.2f')
					 
				     this._div.innerHTML = '<h4>How Northside LLC bought its property</h4>'
					 
					 // example ternary logic for infobox
					 +  (
						 props ?
                         ( props.address ? props.address + '<br/>Acquired via' + (props.acquired == 'tax' ? ' purchase from private owner and reimbursed via state tax credits.' : (props.acquired == 'city' ? ' purchase from the city.' : ' unknown.'))
                         : 'Not owned by Northside LLC.')
						 : 'Northside LLC acquired more than 300 parcels in the footprint of the proposed National Geospatial-Intelligence Agency in north St. Louis. This property was purchased either from the city or from private owners. Northside LLC received tax credits from Missouri to reimburse it for half the cost of the property purchased from private owners.');
				 };

				 info.addTo(map);
				 
				 // add legend
				 
				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')
					
					 // Legend with strings
                     div.innerHTML = '<i style="background:' + colors.ltblue + '"></i> Purchased from the city<br /><i style="background:' + colors.yellow + '"></i> Purchased from private owners, reimbursed with tax credits<br /><i style="background:' + colors.green + '"></i> Also owned by Northside LLC<br /><i style="background:' + colors.brown + '"></i> Not owned by Northside LLC<br />';
					 
					 // Legend with numbers
                     // grades = [1, 101, 501, -50],
                     // text = ['< $100','$100-500','> $500','Paid']
                     // labels = ['<i class="northside title">Northside</i><i class="not_northside title">Others</i>'];
                     // for (var i = 0; i < grades.length; i++) {
                     //                              from = grades[i];
                     //                             to = grades[i + 1];
                     //                             labels.push(
                     //                                 '<i class="northside" style="background:'+ getShade(grades[i] + .001) + '"></i><i class="not_northside" style="background:'+ getShade2(grades[i] + .001) + '"></i>' + text[i] );
                     //                         }
                     //                         div.innerHTML = labels.join('<br>');
					 

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
