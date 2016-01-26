var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

var fmtDecimal = d3.format(',.1f')

/*
 * Render the graphic
 */
function render(width) {

        var northEast = L.latLng(39.066114, -89.778214),
            southWest = L.latLng(38.326575, -91.018295),
            bounds = L.latLngBounds(southWest, northEast);


        var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.673945, -90.273416], 11).setMaxBounds(bounds);


        var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
            .addTo(map);

        var svg = d3.select(map.getPanes().overlayPane).append("svg"),
            g = svg.append("g").attr("class", "leaflet-zoom-hide");

            // update filename, collection name

             d3.json("2015-11-03-stl-infant-mortality.json", function(error, geodata) {
                 console.log(geodata)
                 var regions = topojson.feature(geodata, geodata.objects.stl_infant_mortality);
                 var geojson;


                 //set up styling logic

                 function getColor(d) {

             //example logic to get color based on number
             return d > 25 ? colors.red :
                     d > 20 ? colors.tangerine :
                     d > 15 ? colors.orange :
                     d > 10 ? colors.yellow :
                     d > 5 ? colors.green :
                     colors.dkgreen;
                     }

                 function style(feature) {
                         return {
                             // update property
                             fillColor: getColor(feature.properties.avg_deaths/feature.properties.avg_births*1000),
                             weight: 1,
                             opacity: 1,
                             color: colors.yellow,
                             dashArray: '3',
                             fillOpacity: 0.7
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
                     this._div.innerHTML = '<h4>Infant mortality</h4><h5>(avg. per year for 2009-2013)</h5><br/>'

                     // example ternary logic for infobox
                     +  (
                         props ?
                         '<h1>' + props.zip + '</h3><p>Births per year: <strong>' + props.avg_births + '</strong></p><p>Deaths (under age 1) per year: <strong>' + props.avg_deaths + '</strong></p><p>Deaths per 1,000 births: <strong>' + fmtDecimal(props.avg_deaths / props.avg_births * 1000) + '</strong></p>'
                         : 'Hover over a ZIP code');
                 };

                 info.addTo(map);

                 // add legend

                 var legend = L.control({position: 'bottomright'});

                 legend.onAdd = function (map) {

                     var div = L.DomUtil.create('div', 'info legend')

                     // Legend with strings
                     // div.innerHTML = '<i style="background:' + colors.red + '"></i> Added to the suit<br /><i style="background:' + colors.maroon + '"></i> Also named in the suit<br /><i style="background:' + colors.green + '"></i> Dropped from the suit<br />';

                     // Legend with numbers
                     grades = [25, 20, 15, 10, 5, 0],
                     text = ['More than 25','20-25','15-19','10-14','5-9','Less than 5']
                     labels = ['<h3>Deaths per 1,000 births<br/>(avg. per year)</h3>'];
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
