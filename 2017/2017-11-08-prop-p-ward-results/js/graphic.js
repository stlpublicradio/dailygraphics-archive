var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

var fmtPct = d3.format('.2%');
var fmtThousands = d3.format(',.0f');

/*
 * Render the graphic
 */
function render(width) {


		var northEast = L.latLng(38.788912, -90.111062),
		    southWest = L.latLng(38.516959, -90.451426),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.643945, -90.123416], 12).setMaxBounds(bounds);


		var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/stlpr/cipeg9upl001ubmnukm0w2ura/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RscHIiLCJhIjoicHNFVGhjUSJ9.WZtzslO6NLYL8Is7S-fdxg', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

			// update filename, collection name


			 d3.json("wards.topojson", function(error, geodata) {

				 var regions = topojson.feature(geodata, geodata.objects.wards);
				 var geojson;

                 for (var i = 0; i < DATA.length; i++) {

                     p_votes = DATA[i].p_votes;
                     total = DATA[i].actual_voters;
                     dataWard = DATA[i].ward;

                 for (var j = 0; j < regions.features.length; j++) {

                     var ward = regions.features[j].properties.WARD10;

                    if (ward == dataWard) {
                         regions.features[j].properties.p_votes = +p_votes;
                         regions.features[j].properties.total = +total;
                     }
                 }
             }


				 //set up styling logic

				 function getColor(d) {

                     pct = d.p_votes - (d.total - d.p_votes);

                    return  pct < 0 ? colors.yellow :
                            colors.blue;
				 }

                 function getOpacity(d) {

                      op = Math.abs(d.p_votes - (d.total - d.p_votes))

                     return op < 50 ? .2 :
                            op < 100 ? .4 :
                            op < 500 ? .6 :
                            op < 1000 ? .8 :
                            1
                 }

				 function style(feature) {
						 return {
							 // update property
					         fillColor: getColor(feature.properties),
					         weight: 1,
					         opacity: 1,
					         color: '#aaa',
					         fillOpacity: getOpacity(feature.properties)
					     };
					 }

				 //set up highlighting function

				 function highlightFeature(e) {
				     var layer = e.target;

				     layer.setStyle({
				         weight: 5,
				         color: '#666',
				         dashArray: '',
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

                     this._div.innerHTML = '<h2>Support for Prop P</h2>Overall, Prop P passed by 7,855 votes.<br><br>'

					 // example ternary logic for infobox
					 +  (
						 props ?
                        //  "<strong>Ward " + props.WARD10 + "</strong> cast " + fmtThousands(props.total) + " votes in the election. <strong>" + fmtThousands(props.p_votes) + "</strong> (" + fmtPct(props.p_votes/props.total) + ") went to Lyda Krewson."
                        "<strong>Ward " + props.WARD10 + "</strong> voters " + (props.p_votes > props.total - props.p_votes ? "supported " : "rejected ") + "Prop P by a margin of " + fmtThousands(Math.abs(props.p_votes - (props.total - props.p_votes))) + " votes.<br/><br/>The " + fmtThousands(props.p_votes) + " yes votes represented " + fmtPct(props.p_votes / 24009) + " of the total yes votes in the city.<br/><br/>The " + fmtThousands(props.total - props.p_votes) + " no votes represented " + fmtPct((props.total - props.p_votes) / 16154) + " of the total no votes in the city."
						 : 'Hover over a ward');
				 };

				 info.addTo(map);

				 // add legend

				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')

					 // Legend with numbers
					 grades = ["yes m-5", "yes m-4", "yes m-3", "yes m-2", "yes m-1","no m-1", "no m-2", "no m-3", "no m-4", "no m-5"],
					 text = ['Margin +1,000 (or more)','+500-999','+100-499','+50-99','+1-49','-1-49','-50-99','-100-499','-500-999','-1,000 (or more)']
					 labels = [];
					 for (var i = 0; i < grades.length; i++) {
                            //
							// to = grades[i + 1];
							labels.push(
								'<i class="' + grades[i] + '"></i> ' +
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
