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

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.647501, -90.209706], 16).setMaxBounds(bounds);
		

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);
	
	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");
			
			// update filename, collection name
     
     	   		d3.csv("northside.csv", function (data) {
			 d3.json("nga_parcels.topojson", function(error, geodata) {
				 
				 var regions = topojson.feature(geodata, geodata.objects.parcels);
				 var geojson;
				 
				 // load data
				 
				 for (var i = 0; i < data.length; i++) {
					 var parcelNumber = data[i].parcel;
					 var owner = data[i].owner;
					 var landUse = data[i].land_use;
					 var address = data[i].address;
					 var tax_2013 = parseFloat(data[i].total_original_tax_2013)
					 var tax_2014 = parseFloat(data[i].total_original_tax_2014)
					 var paid_2013 = parseFloat(data[i].amount_paid_2013)
					 var paid_2014 = parseFloat(data[i].amount_paid_2014)
					 var balance_2013 = parseFloat(data[i].total_balance_2013)
					 var balance_2014 = parseFloat(data[i].total_balance_2014)
					 
					 var total_owed = balance_2013 + balance_2014
					 
					 for (var j = 0; j < regions.features.length; j++) {
						 var mapParcel = regions.features[j].properties.parcel;
						 if (parcelNumber == mapParcel) {
							 regions.features[j].properties.address = address;
							 regions.features[j].properties.owner = owner;
							 regions.features[j].properties.total_owed = total_owed;
							 break;
						 }
					 }
				 }
								 
				 
				 //set up styling logic
				 
				 function getShade(d) {
				 
					 return d > 500 ? '#9F192D' :
					 d > 100 ? '#CC203B' :
					 d > 0 ? '#E34F65' :
					 colors.yellow;

				 }
				 
				 function getShade2(d) {
				 
					 return d > 500 ? colors.dkblue :
					 d > 100 ? colors.blue :
					 d > 0 ? colors.ltblue :
					 colors.brown;

				 }
				 
				 
				 function getColor(d) {

			 //example logic to get color based on number
			 // return d < .95 ? colors.red :
			 // 		d < .96 ? colors.tangerine :
			 // 		d < .97 ? colors.orange :
			 // 				 	d < .98 ? colors.yellow :
			 // 		d < .99 ? colors.green :
			 // 				 	colors.dkgreen;

					 
					 // example logic to get color based on string
					 return d.owner == 'NORTHSIDE REGENERATION LLC' ?  getShade(d.total_owed) :
			 		getShade2(d.total_owed)

						 
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
					 
				     this._div.innerHTML = '<h4>Property taxes in the NGA footprint</h4>'
					 
					 // example ternary logic for infobox
					 +  (
						 props ?
						 '<strong>' + props.address + '</strong><br />' + 
						 ( props.total_owed > 0 ? 
						 'Total owed: ' + fmtCurrency(props.total_owed)
						 : 'All paid up.' )
						 : 'This map shows the footprint of the possible site of the National Geospatial-Intelligence Agency in north St. Louis. The parcels in shades of red are owned by Northside Regeneration and reflect how much Paul McKee’s company owes in property taxes from 2013 and 2014. The parcels in shades of blue represent taxes owed on all other properties. The total amount owed for all of Northside Regeneration’s parcels in the footprint is $40,639.05.<br /><br />Hover over a parcel for details.');
				 };

				 info.addTo(map);
				 
				 // add legend
				 
				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')
					
					 // Legend with strings
					 // div.innerHTML = '<i style="background:' + colors.red + '"></i> Added to the suit<br /><i style="background:' + colors.maroon + '"></i> Also named in the suit<br /><i style="background:' + colors.green + '"></i> Dropped from the suit<br />';
					 
					 // Legend with numbers
					 grades = [1, 101, 501, -50],
					 text = ['< $100','$100-500','> $500','Paid']
					 labels = ['<i class="northside title">Northside</i><i class="not_northside title">Others</i>'];
					 for (var i = 0; i < grades.length; i++) {
						 	from = grades[i];
							to = grades[i + 1];
							labels.push(
								'<i class="northside" style="background:'+ getShade(grades[i] + .001) + '"></i><i class="not_northside" style="background:'+ getShade2(grades[i] + .001) + '"></i>' + text[i] );
						}
						div.innerHTML = labels.join('<br>');
					 

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
