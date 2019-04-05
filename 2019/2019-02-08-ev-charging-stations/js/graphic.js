// Global config
var GEO_DATA_URL = 'data/geodata.json';

var LABEL_DEFAULTS = {
    'text-anchor': 'start',
    'dx': '10',
    'dy': '4'
}



var COUNTRY_LABEL_ADJUSTMENTS = {
    'Nepal': {
        'text-anchor': 'end',
        'dx': -50,
        'dy': -20
    },
    'Bangladesh': {
        'text-anchor': 'end',
        'dx': -10
    }
}

// Global vars
var pymChild = null;
var isMobile = false;
var geoData = null;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function () {
    loadJSON()
    pymChild = new pym.Child({});
}

/*
 * Load graphic data from a CSV.
 */
var loadJSON = function () {
    d3.json(GEO_DATA_URL, function (error, data) {
        geoData = data;

        pymChild = new pym.Child({
            renderCallback: render
        });

        pymChild.onMessage('scroll-depth', function (data) {
            data = JSON.parse(data);
        });
    });
}

/*
 * Render the graphic(s). Called by pym with the container width.
 */
var render = function (containerWidth) {
    if (!containerWidth) {
        containerWidth = DEFAULT_WIDTH;
    }

    if (containerWidth <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    // Render the chart!
    renderLocatorMap({
        container: '#locator-map',
        width: containerWidth,
        data: geoData,
        primaryState: 'Missouri',
        pixelOffset: [0, 0]
    });

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

var renderLocatorMap = function (config) {
    /*
     * Setup
     */
    var aspectWidth = 2;
    var aspectHeight = 1.75;

    var bbox = config['data']['bbox'];
    var defaultScale = 2400;
    var cityDotRadius = 4;

    // Calculate actual map dimensions
    var mapWidth = config['width'];
    var mapHeight = Math.ceil((config['width'] * aspectHeight) / aspectWidth);

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    var mapProjection = null;
    var path = null;
    var chartWrapper = null;
    var chartElement = null;

    /*
     * Extract topo data.
     */
    var mapData = {};

    for (var key in config['data']['objects']) {
        mapData[key] = topojson.feature(config['data'], config['data']['objects'][key]);
    }

    /*
     * Create the map projection.
     */
    var centroid = [((bbox[0] + bbox[2]) / 2), ((bbox[1] + bbox[3]) / 2)];
    var mapScale = (mapWidth / DEFAULT_WIDTH) * defaultScale;
    var scaleFactor = mapWidth / DEFAULT_WIDTH;
    var pixelOffset = config['pixelOffset'] || [0, 0];

    projection = d3.geo.mercator()
        .center(centroid)
        .scale(mapScale)
        .translate([pixelOffset[0] + mapWidth / 2, pixelOffset[1] + mapHeight / 2]);

    path = d3.geo.path()
        .projection(projection)
        .pointRadius(cityDotRadius * scaleFactor);

    /*
     * Create the root SVG element.
     */
    chartWrapper = containerElement.append('div')
        .attr('class', 'graphic-wrapper');

    chartElement = chartWrapper.append('svg')
        .attr('width', mapWidth)
        .attr('height', mapHeight)
        .append('g')

    /*
     * Create SVG filters.
     */
    var filters = chartElement.append('filters');

    var textFilter = filters.append('filter')
        .attr('id', 'textshadow');

    textFilter.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('result', 'blurOut')
        .attr('stdDeviation', '.25');

    var landFilter = filters.append('filter')
        .attr('id', 'landshadow');

    landFilter.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('result', 'blurOut')
        .attr('stdDeviation', '10');

    /*
     * Render countries.
     */
    // Land shadow
    chartElement.append('path')
        .attr('class', 'landmass')
        .datum(mapData['states'])
        .attr('filter', 'url(#landshadow)')
        .attr('d', path);

    // Land outlines
    chartElement.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(mapData['states']['features'])
        .enter().append('path')
        .attr('class', function (d) {
            return classify(d['id']);
        })
        .attr('d', path);

    // Highlight primary country
    var primaryCountryClass = classify(config['primaryState']);

    d3.select('.states path.' + primaryCountryClass)
        .moveToFront()
        .classed('primary ' + primaryCountryClass, true);

    // Render counties

    chartElement.append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(mapData['counties']['features'])
        .enter().append('path')
        .attr('class', function (d) {
            return classify(d['id']);
        })
        .attr('d', path);

    // render highways

    chartElement.append('g')
        .attr('class', 'highways')
        .selectAll('path')
        .data(mapData['highways']['features'])
        .enter().append('path')
        .attr('class', function (d) {
            return classify(d['id']);
        })
        .attr('d', path);

    // render roads

    chartElement.append('g')
        .attr('class', 'roads')
        .selectAll('path')
        .data(mapData['roads']['features'])
        .enter().append('path')
        .attr('class', function (d) {
            return "type-" + classify(d['properties']['type']);
        })
        .attr('d', path);    


    // render charging stations

    chartElement.append('g')
        .attr('class', 'stations')
        .selectAll('path')
        .data(mapData['stations']['features'])
        .enter().append('path')
        .attr('class', function (d) {
            if (d['properties']['company']) {
            return classify(d['properties']['company']);
            }
        })
        .attr('d', path);    

    /*
     * Render rivers.
     */
    // chartElement.append('g')
    //     .attr('class', 'rivers')
    //     .selectAll('path')
    //         .data(mapData['rivers']['features'])
    //     .enter().append('path')
    //         .attr('d', path);

    /*
     * Render lakes.
     */
    // chartElement.append('g')
    //     .attr('class', 'lakes')
    //     .selectAll('path')
    //         .data(mapData['lakes']['features'])
    //     .enter().append('path')
    //         .attr('d', path);

    /*
     * Render primary cities.
     */
    // chartElement.append('g')
    //     .attr('class', 'cities primary')
    //     .selectAll('path')
    //         .data(mapData['cities']['features'])
    //     .enter().append('path')
    //         .attr('d', path)
    //         .attr('class', function(d) {
    //             var c = 'place';

    //             c += ' ' + classify(d['properties']['city']);
    //             c += ' ' + classify(d['properties']['featurecla']);
    //             c += ' scalerank-' + d['properties']['scalerank'];

    //             return c;
    //         });

    /*
     * Render neighboring cities.
     */
    // chartElement.append('g')
    //     .attr('class', 'cities neighbors')
    //     .selectAll('path')
    //         .data(mapData['neighbors']['features'])
    //     .enter().append('path')
    //         .attr('d', path)
    //         .attr('class', function(d) {
    //             var c = 'place';

    //             c += ' ' + classify(d['properties']['city']);
    //             c += ' ' + classify(d['properties']['featurecla']);
    //             c += ' scalerank-' + d['properties']['scalerank'];

    //             return c;
    //         });

    /*
     * Apply adjustments to label positioning.
     */
    var positionLabel = function (adjustments, id, attribute) {
        if (adjustments[id]) {
            if (adjustments[id][attribute]) {
                return adjustments[id][attribute];
            } else {
                return LABEL_DEFAULTS[attribute];
            }
        } else {
            return LABEL_DEFAULTS[attribute];
        }
    }

    /*
     * Render country labels.
     */
    // chartElement.append('g')
    //     .attr('class', 'country-labels')
    //     .selectAll('.label')
    //         .data(mapData['countries']['features'])
    //     .enter().append('text')
    //         .attr('class', function(d) {
    //             return 'label ' + classify(d['id']);
    //         })
    //         .attr('transform', function(d) {
    //             return 'translate(' + path.centroid(d) + ')';
    //         })
    //         .attr('text-anchor', function(d) {
    //             return positionLabel(COUNTRY_LABEL_ADJUSTMENTS, d['id'], 'text-anchor');
    //         })
    //         .attr('dx', function(d) {
    //             return positionLabel(COUNTRY_LABEL_ADJUSTMENTS, d['id'], 'dx');
    //         })
    //         .attr('dy', function(d) {
    //             return positionLabel(COUNTRY_LABEL_ADJUSTMENTS, d['id'], 'dy');
    //         })
    //         .text(function(d) {
    //             return COUNTRIES[d['properties']['country']] || d['properties']['country'];
    //         });

    // Highlight primary country
    var primaryStateClass = classify(config['primaryState']);

    // d3.select('.state-labels text.' + primaryStateClass)
    //     .classed('label primary ' + primaryStateClass, true);



    /*
     * Render city labels.
     */

    var CITY_LABEL_ADJUSTMENTS = {
        'St. Louis': {
            'dx': 10
        },
        'Kansas City': {
            'text-anchor': 'end',
            'dx': -15
        },
        'Joplin': {
            'text-anchor': 'end',
            'dx': -12
        },
        'Mt. Vernon': {
            'dy': 8
        }
        ,
        'Concordia': {
            'dy': -8,
            'dx': -1
        },
        'Columbia': {
            'dy': -8,
            'dx': -1
        },
        'Saint Joseph': {
            'text-anchor': 'end',
            'dx': -12
        },
        'Cape Girardeau': {
            'text-anchor': 'end',
            'dx': -12
        },
        'Cameron': {
            'dy': 10
        },
        'Farmington': {
            'text-anchor': 'end',
            'dx': -12
        },
        'Warrenton' : {
            'dy': -8,
            'dx': -1
        }
    }


    var layers = [
        'city-labels shadow',
        'city-labels',
    ];

    layers.forEach(function(layer) {
        var data = [
            {
                "name": "Mt. Vernon",
                "lat": 37.09462150015557,
                "lon": -93.81500244140625,
                "scale": 8
              },
              {
                "name": "Joplin",
                "lat": 37.081475648860525,
                "lon": -94.51950073242188,
                "scale": 8
              },
              {
                "name": "Branson",
                "lat": 36.6254475139069,
                "lon": -93.22998046875,
                "scale": 8
              },
              {
                "name": "Springfield",
                "lat": 37.22158045838649,
                "lon": -93.31512451171875,
                "scale": 1
              },
              {
                "name": "Nevada",
                "lat": 37.83473402375478,
                "lon": -94.35882568359375,
                "scale": 8
              },
              {
                "name": "Lebanon",
                "lat": 37.66588567407962,
                "lon": -92.66281127929686,
                "scale": 8
              },
              {
                "name": "Collins",
                "lat": 37.890840838551945,
                "lon": -93.62377166748047,
                "scale": 8
              },
              {
                "name": "Sedalia",
                "lat": 38.70212344612382,
                "lon": -93.22929382324219,
                "scale": 8
              },
              {
                "name": "Harrisonville",
                "lat": 38.64798079297792,
                "lon": -94.35333251953125,
                "scale": 8
              },
              {
                "name": "Kansas City",
                "lat": 39.04051963289309,
                "lon": -94.36363220214844,
                "scale": 1
              },
              {
                "name": "Concordia",
                "lat": 38.991971023322954,
                "lon": -93.56849670410156,
                "scale": 8
              },
              {
                "name": "Columbia",
                "lat": 38.965815660189016,
                "lon": -92.32704162597656,
                "scale": 8
              },
              {
                "name": "Moberly",
                "lat": 39.431950321168635,
                "lon": -92.427978515625,
                "scale": 8
              },
              {
                "name": "Macon",
                "lat": 39.74626606218367,
                "lon": -92.46780395507811,
                "scale": 8
              },
              {
                "name": "Chillicothe",
                "lat": 39.78162965844787,
                "lon": -93.55476379394531,
                "scale": 8
              },
              {
                "name": "Cameron",
                "lat": 39.74626606218367,
                "lon": -94.22218322753905,
                "scale": 8
              },
              {
                "name": "Saint Joseph",
                "lat": 39.74837783143156,
                "lon": -94.83329772949219,
                "scale": 8
              },
              {
                "name": "Maryville",
                "lat": 40.34340411709394,
                "lon": -94.86831665039062,
                "scale": 8
              },
              {
                "name": "Bethany",
                "lat": 40.25752074821524,
                "lon": -94.01962280273436,
                "scale": 8
              },
              {
                "name": "Kirksville",
                "lat": 40.17887331434696,
                "lon": -92.5762939453125,
                "scale": 8
              },
              {
                "name": "Kahoka",
                "lat": 40.38212061782238,
                "lon": -91.57379150390625,
                "scale": 8
              },
              {
                "name": "Hannibal",
                "lat": 39.70718665682654,
                "lon": -91.38153076171875,
                "scale": 8
              },
              {
                "name": "Bowling Green",
                "lat": 39.34385645872588,
                "lon": -91.19476318359375,
                "scale": 8
              },
              {
                "name": "Jefferson City",
                "lat": 38.568569091731305,
                "lon": -92.19039916992188,
                "scale": 1
              },
              {
                "name": "Rolla",
                "lat": 37.95286091815649,
                "lon": -91.77429199218749,
                "scale": 8
              },
              {
                "name": "Sullivan",
                "lat": 38.211209018340156,
                "lon": -91.16729736328125,
                "scale": 8
              },
              {
                "name": "Cabool",
                "lat": 37.12008509781792,
                "lon": -92.10319519042969,
                "scale": 8
              },
              {
                "name": "Sikeston",
                "lat": 36.87193076711956,
                "lon": -89.53582763671875,
                "scale": 8
              },
              {
                "name": "Hayti",
                "lat": 36.223780559967814,
                "lon": -89.74731445312499,
                "scale": 8
              },
              {
                "name": "Cape Girardeau",
                "lat": 37.298090424438506,
                "lon": -89.55093383789062,
                "scale": 8
              },
              {
                "name": "Perryville",
                "lat": 37.70555348721583,
                "lon": -89.88739013671874,
                "scale": 8
              },
              {
                "name": "Farmington",
                "lat": 37.78156937014928,
                "lon": -90.44357299804688,
                "scale": 8
              },
              {
                "name": "Festus",
                "lat": 38.209050898250595,
                "lon": -90.39962768554688,
                "scale": 8
              },
              {
                "name": "St. Louis",
                "lat": 38.62116234642254,
                "lon": -90.20462036132812,
                "scale": 1
              },
              {
                "name": "St. Charles",
                "lat": 38.79583799119038,
                "lon": -90.5877685546875,
                "scale": 8
              },
              {
                "name": "Warrenton",
                "lat": 38.82045110711473,
                "lon": -91.14189147949219,
                "scale": 8
              },
              {
                "name": "Poplar Bluff",
                "lat": 36.7762924811868,
                "lon": -90.41473388671875,
                "scale": 8
              }
              
        ];

        

        chartElement.append('g')
            .attr('class', layer)
            .selectAll('.label')
                .data(data)
            .enter().append('text')
                .attr('class', function(d) {
                    var c = 'label';

                    c += ' ' + classify(d['name']);
                    c += ' scalerank-' + d['scale'];

                    return c;
                })
                .attr('transform', function(d) {
                    return 'translate(' + projection([d['lon'],d['lat']]) + ')';
                })
                .attr('style', function(d) {
                    return 'text-anchor: ' + positionLabel(CITY_LABEL_ADJUSTMENTS, d['name'], 'text-anchor');
                })
                .attr('dx', function(d) {
                    return positionLabel(CITY_LABEL_ADJUSTMENTS, d['name'], 'dx');
                })
                .attr('dy', function(d) {
                    return positionLabel(CITY_LABEL_ADJUSTMENTS, d['name'], 'dy');
                })
                .text(function(d) {
                    return d['name'];
                });
    });

    d3.selectAll('.shadow')
        .attr('filter', 'url(#textshadow)');

    /*
     * Render a scale bar.
     */
    var scaleBarDistance = calculateOptimalScaleBarDistance(bbox, 10);
    var scaleBarStart = [10, mapHeight - 20];
    var scaleBarEnd = calculateScaleBarEndPoint(projection, scaleBarStart, scaleBarDistance);

    chartElement.append('g')
        .attr('class', 'scale-bar')
        .append('line')
        .attr('x1', scaleBarStart[0])
        .attr('y1', scaleBarStart[1])
        .attr('x2', scaleBarEnd[0])
        .attr('y2', scaleBarEnd[1]);

    d3.select('.scale-bar')
        .append('text')
        .attr('x', scaleBarEnd[0] + 5)
        .attr('y', scaleBarEnd[1] + 3)
        .text(scaleBarDistance + ' miles');
}

/*
 * Move a set of D3 elements to the front of the canvas.
 */
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;