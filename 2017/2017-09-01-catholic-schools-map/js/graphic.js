// Global config
var GEO_DATA_URL = 'data/geodata.json';
var DEFAULT_WIDTH = 663;

var LABEL_DEFAULTS = {
    'text-anchor': 'start',
    'dx': '6',
    'dy': '4'
}

var CITY_LABEL_ADJUSTMENTS = {
    'Wentzville': {'text-anchor': 'end', 'dx': -5},
    'Warrenton': {'text-anchor': 'end', 'dx': -5},
    'Pacific': {'text-anchor': 'end', 'dx': -5},
    'Washington': {'text-anchor': 'end', 'dx': -5},
    'Wildwood': {'text-anchor': 'end', 'dx': -5},
    'Troy': {'text-anchor': 'end', 'dx': -5},
    'Pacific': {'text-anchor': 'end', 'dx': -5},
    'O\'Fallon': {'dy': -4},
    'Weldon Spring': {'text-anchor': 'end', 'dx': -5},
    'Valley Park': {'text-anchor': 'end', 'dx': -5},
    'Chesterfield': {'text-anchor': 'end', 'dx': -5},
    'Ladue': {'text-anchor': 'end', 'dx': -5},
    'Affton': {'text-anchor': 'end', 'dx': -5},
    'Dardenne Prairie': {'text-anchor': 'end', 'dx': -5},
    'Saint Ann': {'text-anchor': 'end', 'dx': -5},



}

var removals = ['.oakville-mo','.florissant-mo','.affton-mo','.kirkwood-mo','.brentwood-mo','.clayton-mo','.ladue-mo','.saint-peters-mo','.hazelwood-mo','.glasgow-village-mo','.overland-mo','.lake-saint-louis-mo','.desloge-mo','.park-hills-mo','.murphy-mo','.concord-mo','.crestwood-mo','.university-city-mo','.east-alton-il','.wood-river-il','.bethalto-il','.maryland-heights-mo','.olivette-mo','.saint-john-mo','.bridgeton-mo','.creve-coeur-mo','.ballwin-mo','.manchester-mo','.weldon-spring-mo','.pevely-mo','.mehlville-mo','.sappington-mo','.sunset-hills-mo','.town-and-country-mo','.des-peres-mo','.maplewood-mo','.richmond-heights-mo','.webster-groves-mo','.glendale-mo','.shrewsbury-mo','.normandy-mo','.jennings-mo','.berkeley-mo','.black-jack-mo','.bellefontaine-neighbors-mo','.dellwood-mo','.east-saint-louis-il','.centreville-il','.swansea-il','.fairview-heights-il','.shiloh-il','.maryville-il','.pontoon-beach-il','.highland-il','.litchfield-il','.mascoutah-il','.godfrey-il','.glen-carbon-il','.granite-city-il']


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
            // ANALYTICS.trackEvent('on-screen', bucket);
        });
        pymChild.onMessage('scroll-depth', function(data) {
            data = JSON.parse(data);
        // ANALYTICS.trackEvent('scroll-depth', data.percent, data.seconds);
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
        primaryCountry: 'United States'
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
    var aspectHeight = 2.2;

    var bbox = config['data']['bbox'];
    var defaultScale = 20000;
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

    projection = d3.geo.mercator()
        .center(centroid)
        .scale(mapScale)
        .translate([ mapWidth/2, mapHeight/2 ]);

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
     * Render rivers.
     */
    chartElement.append('g')
        .attr('class', 'rivers')
        .selectAll('path')
            .data(mapData['rivers']['features'])
        .enter().append('path')
            .attr('d', path);

    /*
     * Render highways.
     */
    chartElement.append('g')
        .attr('class', 'highways')
        .selectAll('path')
            .data(mapData['highways']['features'])
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

                c += ' ' + classify(d['properties']['NAME']) + '-' + classify(d['properties']['STATE']);
                c += ' ' + classify(d['properties']['FEATURE2']);

                return c;
            });



    /*
    * Render schools
    */

    chartElement.append('g')
        .attr('class', 'schools')
        .selectAll('circle')
            .data(mapData['schools']['features'])
            .enter().append('circle')
                .attr("class", "school")
                .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                // .attr('r', 4);

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

    /*
     * Render city labels.
     */
    var layers = [
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

                    c += ' ' + classify(d['properties']['NAME']) + '-' + classify(d['properties']['STATE']);

                    return c;
                })
                .attr('transform', function(d) {
                    return 'translate(' + projection(d['geometry']['coordinates']) + ')';
                })
                .attr('style', function(d) {
                    return 'text-anchor: ' + positionLabel(CITY_LABEL_ADJUSTMENTS, d['properties']['NAME'], 'text-anchor');
                })
                .attr('dx', function(d) {
                    return positionLabel(CITY_LABEL_ADJUSTMENTS, d['properties']['NAME'], 'dx');
                })
                .attr('dy', function(d) {
                    return positionLabel(CITY_LABEL_ADJUSTMENTS, d['properties']['NAME'], 'dy');
                })
                .text(function(d) {
                    return CITIES[d['properties']['city']] || d['properties']['NAME'];
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


    /*
     * Remove out-of-frame cities.
     */
     removals.forEach(function(removal) {

         chartElement.selectAll(removal)
            .remove()
        });

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
