var pymChild = null;

var colors = {
    'brown': '#6b6256',
    'tan': '#a5a585',
    'ltgreen': '#70a99a',
    'green': '#449970',
    'dkgreen': '#31716e',
    'ltblue': '#55b7d9',
    'blue': '#358fb3',
    'dkblue': '#006c8e',
    'yellow': '#f1bb4f',
    'orange': '#f6883e',
    'tangerine': '#e8604d',
    'red': '#cc203b',
    'pink': '#c72068',
    'maroon': '#8c1b52',
    'purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {
    var stadium = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [-90.18571615219116,
                            38.63428787729684
                        ],
                        [-90.18573760986328,
                            38.635410895417294
                        ],
                        [-90.18593072891235,
                            38.63953406479131
                        ],
                        [-90.18608093261719,
                            38.64115980214863
                        ],
                        [-90.18063068389893,
                            38.64169611978504
                        ],
                        [-90.18056631088257,
                            38.64119332211848
                        ],
                        [-90.18095254898071,
                            38.64117656213551
                        ],
                        [-90.18050193786621,
                            38.63639980725396
                        ],
                        [-90.18101692199707,
                            38.633801789371184
                        ],
                        [-90.18571615219116,
                            38.63428787729684
                        ]
                    ]
                ]
            }
        }]
    }

    var data = GRAPHIC_DATA
    var northEast = L.latLng(38.6456290803, -90.1718008518),
        southWest = L.latLng(38.6322146938, -90.1953613758),
        bounds = L.latLngBounds(southWest, northEast);

    var map = L.map('map', {
        scrollWheelZoom: false,
        attribution: ''
    }).setView([38.637972, -90.183565], 17).setMaxBounds(bounds);


    var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', {
            attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"
        })
        .addTo(map);

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    //set up highlighting function

    function highlightFeature(e) {
        var layer = e.target;

        console.log(layer.feature.properties)

        $.featherlight('<div class="popup"><img src="assets/' + layer.feature.properties.filename + '.jpg"></img><p>' + layer.feature.properties.caption + '</p></div>');

        //  if (!L.Browser.ie && !L.Browser.opera) {
        //      layer.bringToFront();
        //  }
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    function clickHighlight(e) {
        highlightFeature(e)
    }

    function onEachFeature(feature, layer) {
        layer.on({
            click: clickHighlight
        });
    }

    stadium_outline = L.geoJson(stadium, {
        style: {"color": "#f1bb4f"}
    }).addTo(map);

    geojson = L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            var smallIcon = L.icon({
                iconSize: [75, 75],
                iconAnchor: [25, 50],
                popupAnchor: [1, -24],
                iconUrl: 'assets/thumbs/' + feature.properties.filename + '.jpg',
                className: 'imgIcon'
            });

            return L.marker(latlng, {
                icon: smallIcon
            });
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
