// Global config
var GEO_DATA_URL = 'data/geodata.json';

var LABEL_DEFAULTS = {
    'text-anchor': 'start',
    'dx': '8',
    'dy': '4'
}

var CITY_LABEL_ADJUSTMENTS = {
    'Jefferson City':{'text-anchor':'end', 'dx':'-10'},
    'St. Louis':{'text-anchor':'end', 'dx':'-8','dy':'10'},
    'Beaufort':{'dy':'12'},
    'Windsor':{'dx':'12','dy':'0'}
}

// Global vars
var pymChild = null;
var isMobile = false;
var geoData = null;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        loadJSON()
    } else {
        pymChild = new pym.Child({});

    }
}

/*
 * Load graphic data from a CSV.
 */
var loadJSON = function() {
    d3.json(GEO_DATA_URL, function(error, data) {
        geoData = data;

        pymChild = new pym.Child({
            renderCallback: render
        });

        pymChild.onMessage('on-screen', function(bucket) {
            ANALYTICS.trackEvent('on-screen', bucket);
        });
        pymChild.onMessage('scroll-depth', function(data) {
            data = JSON.parse(data);
        ANALYTICS.trackEvent('scroll-depth', data.percent, data.seconds);
        });
    });
}

/*
 * Render the graphic(s). Called by pym with the container width.
 */
var render = function(containerWidth) {
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
        primaryCountry: 'Missouri',
        pixelOffset: [0, 0]
    });

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

var renderLocatorMap = function(config) {
    /*
     * Setup
     */
    var aspectWidth = 2;
    var aspectHeight = .8;

    var bbox = config['data']['bbox'];
    var defaultScale = 3500;
    var cityDotRadius = 3;

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
        .translate([ pixelOffset[0] + mapWidth/2, pixelOffset[1] + mapHeight/2 ]);

    path = d3.geo.path()
        .projection(projection)
        .pointRadius(cityDotRadius * scaleFactor);

    xScale = d3.scale.linear()
        .domain([0,100])
        .range([0,mapWidth])

    yScale = d3.scale.linear()
        .domain([0,100])
        .range([0,mapHeight])    

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
        .datum(mapData['countries'])
        .attr('filter', 'url(#landshadow)')
        .attr('d', path);

    // Land outlines
    chartElement.append('g')
        .attr('class', 'countries')
        .selectAll('path')
            .data(mapData['countries']['features'])
        .enter().append('path')
            .attr('class', function(d) {
                return classify(d['id']);
            })
            .attr('d', path);

    // Highlight primary country
    var primaryCountryClass = classify(config['primaryCountry']);

    d3.select('.countries path.' + primaryCountryClass)
        .moveToFront()
        .classed('primary ' + primaryCountryClass, true);

    /*
     * Render rivers.
     */
    chartElement.append('g')
        .attr('class', 'rivers')
        .selectAll('path')
            .data(mapData['rivers']['features'])
        .enter().append('path')
            .attr('d', path);

    /*
     * Render primary cities.
     */
    chartElement.append('g')
        .attr('class', 'cities primary')
        .selectAll('path')
            .data(mapData['cities']['features'])
        .enter().append('path')
            .attr('d', path)
            .attr('class', function(d) {
                var c = 'place';

                c += ' ' + classify(d['id']);
                

                return c;
            });

    /*
    * Render Katy Trail
    */

   chartElement.append('g')
   .attr('class', 'katy-trail')
   .selectAll('path')
       .data(mapData['katy']['features'])
   .enter().append('path')
       .attr('d', path);

    /*
    * Render Rock Island Trail
    */

   chartElement.append('g')
   .attr('class', 'rock-island-trail')
   .selectAll('path')
       .data(mapData['rock_island']['features'])
   .enter().append('path')
       .attr('d', path)
       .attr('class', function(d) {
        
        return classify(d['id']);
    });   


    /*
     * Apply adjustments to label positioning.
     */
    var positionLabel = function(adjustments, id, attribute) {
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


    // Highlight primary country
    var primaryCountryClass = classify(config['primaryCountry']);

    d3.select('.country-labels text.' + primaryCountryClass)
        .classed('label primary ' + primaryCountryClass, true);

    /*
     * Render city labels.
     */
    var layers = [
        'city-labels shadow',
        'city-labels',
        'city-labels shadow primary',
        'city-labels primary'
    ];

    layers.forEach(function(layer) {
        var data = [];

            data = mapData['cities']['features'];
        
        chartElement.append('g')
            .attr('class', layer)
            .selectAll('.label')
                .data(data)
            .enter().append('text')
                .attr('class', function(d) {
                    var c = 'label';

                    

                    return c;
                })
                .attr('transform', function(d) {
                    return 'translate(' + projection(d['geometry']['coordinates']) + ')';
                })
                .attr('style', function(d) {
                    return 'text-anchor: ' + positionLabel(CITY_LABEL_ADJUSTMENTS, d['id'], 'text-anchor');
                })
                .attr('dx', function(d) {
                    return positionLabel(CITY_LABEL_ADJUSTMENTS, d['id'], 'dx');
                })
                .attr('dy', function(d) {
                    return positionLabel(CITY_LABEL_ADJUSTMENTS, d['id'], 'dy');
                })
                .text(function(d) {
                    return CITIES[d['id']] || d['id'];
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

        var labels = [
            {
                'name': 'Katy Trail',
                'slug': 'katy-trail',
                'x': 60,
                'y': 50
            },
            {
                'name': 'Rock Island Trail',
                'slug': 'rock-island-trail',
                'x': 50,
                'y': 90
            }
    
        ]
    
        chartElement.append('g')
                .attr('class', 'text-labels')
                .selectAll('.label')
                    .data(labels)
                .enter().append('text')
                    .attr('class', function(d) {
                        return 'label ' + d['slug'];
                    })
                    .attr('transform', function(d) {
                        return 'translate(' + xScale(d['x']) + ',' + yScale(d['y']) + ')';
                    })
                    .text(function(d) {
                        return d['name']
                    })



}

/*
 * Move a set of D3 elements to the front of the canvas.
 */
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
