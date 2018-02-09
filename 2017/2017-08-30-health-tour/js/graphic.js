// Global config
var GEO_DATA_URL = 'health-tour.json';
var skipLabels = [ 'label', 'category', 'values', 'total' ];

fmtnumber = d3.format('.1f')


var LABEL_DEFAULTS = {
    'text-anchor': 'middle',
    'dy': '4'
}

// Global vars
var pymChild = null;
var isMobile = false;
var geoData = null;


var formatData = function() {

    datas = [DATA_A,DATA_A_AGE,DATA_B,DATA_B_AGE,DATA_C,DATA_C_AGE,DATA_D,DATA_D_AGE,DATA_E,DATA_E_AGE]

    datas.forEach(function(thisData) {
        thisData.forEach(function(d) {
            var y0 = 0;

            d['values'] = [];
            d['total'] = 0;

            for (var key in d) {
                if (_.contains(skipLabels, key)) {
                    continue;
                }

                d[key] = +d[key];

                var y1 = y0 + d[key];
                d['total'] += d[key];

                d['values'].push({
                    'name': key,
                    'y0': y0,
                    'y1': y1,
                    'val': d[key]
                })

                y0 = y1;
            }
        });
    })
}

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        formatData()
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
    DEFAULT_WIDTH = 663;
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
        container: '#map',
        width: containerWidth,
        data: geoData
    });

    renderGroupedStackedColumnChart({
        container: '#graphic-A',
        width: containerWidth,
        data: DATA_A,
        pct: true
    });

    renderGroupedStackedColumnChart({
        container: '#graphic-A-age',
        width: containerWidth / 2,
        data: DATA_A_AGE,
        pct: false
    });

    renderGroupedStackedColumnChart({
        container: '#graphic-B',
        width: containerWidth,
        data: DATA_B,
        pct: true
    });

    renderGroupedStackedColumnChart({
        container: '#graphic-B-age',
        width: containerWidth / 2,
        data: DATA_B_AGE,
        pct: false
    });

    renderGroupedStackedColumnChart({
        container: '#graphic-C',
        width: containerWidth,
        data: DATA_C,
        pct: true
    });

    renderGroupedStackedColumnChart({
        container: '#graphic-C-age',
        width: containerWidth / 2,
        data: DATA_C_AGE,
        pct: false
    });

    renderGroupedStackedColumnChart({
        container: '#graphic-D',
        width: containerWidth,
        data: DATA_D,
        pct: true
    });

    renderGroupedStackedColumnChart({
        container: '#graphic-D-age',
        width: containerWidth / 2,
        data: DATA_D_AGE,
        pct: false
    });

    renderGroupedStackedColumnChart({
        container: '#graphic-E',
        width: containerWidth,
        data: DATA_E,
        pct: true
    });

    renderGroupedStackedColumnChart({
        container: '#graphic-E-age',
        width: containerWidth / 2,
        data: DATA_E_AGE,
        pct: false
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
    var aspectHeight = 1.5;

    var bbox = config['data']['bbox'];
    var defaultScale = 350000;
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
     * Render countries.
     */
    // Land shadow
    chartElement.append('path')
        .attr('class', 'landmass')
        .datum(mapData['stl_boundary'])
        .attr('filter', 'url(#landshadow)')
        .attr('d', path);

    // Land outlines
    chartElement.append('g')
        .attr('class', 'stl_boundary')
        .selectAll('path')
            .data(mapData['stl_boundary']['features'])
        .enter().append('path')
            .attr('d', path);

    // Parks
    chartElement.append('g')
        .attr('class', 'parks')
        .selectAll('path')
            .data(mapData['parks']['features'])
        .enter().append('path')
            .attr('d', path);

    /*
     * Render rivers.
     */
    chartElement.append('g')
        .attr('class', 'rivers')
        .selectAll('path')
            .data(mapData['water']['features'])
        .enter().append('path')
            .attr('d', path);

    /*
     * Render lakes.
     */
    chartElement.append('g')
        .attr('class', 'lakes')
        .selectAll('path')
            .data(mapData['water_polygons']['features'])
        .enter().append('path')
            .attr('d', path);

    /*
     * Render roads.
     */
    chartElement.append('g')
        .attr('class', 'roads')
        .selectAll('path')
            .data(mapData['roads']['features'])
        .enter().append('path')
            .attr('d', path);

    /*
    *    Render stops
    */

    chartElement.append('g')
        .attr('class', 'stops')
        .selectAll('path')
            .data(mapData['stops']['features'])
        .enter().append('circle')
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr('r', 12);

    /*
    * Render stop labels
    */

    chartElement.append('g')
        .attr('class', 'stop-labels')
        .selectAll('.label')
            .data(mapData['stops']['features'])
        .enter().append('text')
            .attr('class', function(d) {
                return 'label ' + classify(d['properties']['name']);
            })
            .attr('transform', function(d) {
                return 'translate(' + path.centroid(d) + ')';
            })
            .attr('text-anchor', 'middle')
            .attr('dy', 7)
            .text(function(d) {
                return d['id'];
            });

    // /*
    //  * Render primary cities.
    //  */
    // chartElement.append('g')
    //     .attr('class', 'cities primary')
    //     .selectAll('path')
    //         .data(mapData['cities']['features'])
    //     .enter().append('path')
    //         .attr('d', path)
    //         .attr('class', function(d) {
    //             var c = 'place';
    //
    //             c += ' ' + classify(d['properties']['city']);
    //             c += ' ' + classify(d['properties']['featurecla']);
    //             c += ' scalerank-' + d['properties']['scalerank'];
    //
    //             return c;
    //         });
    //
    //
    // chartElement.append('g')
    //     .attr('class', 'cities eclipse')
    //     .selectAll('path')
    //         .data(mapData['collection']['features'])
    //     .enter().append('path')
    //         .attr('d', path)
    //         .attr('class', function(d) {
    //             var c = 'place';
    //
    //             c += ' ' + classify(d['id']);
    //
    //             return c;
    //         });
    //
    // /*
    //  * Render neighboring cities.
    //  */
    // chartElement.append('g')
    //     .attr('class', 'cities neighbors')
    //     .selectAll('path')
    //         .data(mapData['neighbors']['features'])
    //     .enter().append('path')
    //         .attr('d', path)
    //         .attr('class', function(d) {
    //             var c = 'place';
    //
    //             c += ' ' + classify(d['properties']['city']);
    //             c += ' ' + classify(d['properties']['featurecla']);
    //             c += ' scalerank-' + d['properties']['scalerank'];
    //
    //             return c;
    //         });
    //
    //
    //
    // /*
    //  * Apply adjustments to label positioning.
    //  */
    // var positionLabel = function(adjustments, id, attribute) {
    //     if (adjustments[id]) {
    //         if (adjustments[id][attribute]) {
    //             return adjustments[id][attribute];
    //         } else {
    //             return LABEL_DEFAULTS[attribute];
    //         }
    //     } else {
    //         return LABEL_DEFAULTS[attribute];
    //     }
    // }
    //
    // /*
    //  * Render country labels.
    //  */
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
    //
    // // Highlight primary country
    // var primaryCountryClass = classify(config['primaryCountry']);
    //
    // d3.select('.country-labels text.' + primaryCountryClass)
    //     .classed('label primary ' + primaryCountryClass, true);
    //
    // /*
    //  * Render city labels.
    //  */
    // var layers = [
    //     'city-labels shadow',
    //     'city-labels',
    //     'city-labels shadow primary',
    //     'city-labels primary'
    // ];
    //
    // layers.forEach(function(layer) {
    //     var data = [];
    //
    //     if (layer == 'city-labels shadow' || layer == 'city-labels') {
    //         data = mapData['neighbors']['features'];
    //     } else {
    //         data = mapData['cities']['features'];
    //     }
    //
    //     chartElement.append('g')
    //         .attr('class', layer)
    //         .selectAll('.label')
    //             .data(data)
    //         .enter().append('text')
    //             .attr('class', function(d) {
    //                 var c = 'label';
    //
    //                 c += ' ' + classify(d['properties']['city']);
    //                 c += ' ' + classify(d['properties']['featurecla']);
    //                 c += ' scalerank-' + d['properties']['scalerank'];
    //
    //                 return c;
    //             })
    //             .attr('transform', function(d) {
    //                 return 'translate(' + projection(d['geometry']['coordinates']) + ')';
    //             })
    //             .attr('style', function(d) {
    //                 return 'text-anchor: ' + positionLabel(CITY_LABEL_ADJUSTMENTS, d['properties']['city'], 'text-anchor');
    //             })
    //             .attr('dx', function(d) {
    //                 return positionLabel(CITY_LABEL_ADJUSTMENTS, d['properties']['city'], 'dx');
    //             })
    //             .attr('dy', function(d) {
    //                 return positionLabel(CITY_LABEL_ADJUSTMENTS, d['properties']['city'], 'dy');
    //             })
    //             .text(function(d) {
    //                 return CITIES[d['properties']['city']] || d['properties']['city'];
    //             });
    // });
    //
    // chartElement.append('g')
    //     .attr('class', 'city-labels eclipse')
    //     .selectAll('.label')
    //         .data(mapData['collection']['features'])
    //     .enter().append('text')
    //         .attr('class', function(d) {
    //             var c = 'label';
    //
    //             c +=  ' ' + classify(d['id'])
    //
    //             return c;
    //         })
    //         .attr('transform', function(d) {
    //             return 'translate(' + projection(d['geometry']['coordinates']) + ')';
    //         })
    //         .attr('style', function(d) {
    //             return 'text-anchor: ' + positionLabel(CITY_LABEL_ADJUSTMENTS, d['id'], 'text-anchor');
    //         })
    //         .attr('dx', function(d) {
    //             return positionLabel(CITY_LABEL_ADJUSTMENTS, d['id'], 'dx');
    //         })
    //         .attr('dy', function(d) {
    //             return positionLabel(CITY_LABEL_ADJUSTMENTS, d['id'], 'dy');
    //         })
    //         .text(function(d) {
    //             return CITIES[d['id']] || d['id'];
    //         });
    //
    // d3.selectAll('.shadow')
    //     .attr('filter', 'url(#textshadow)');

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
        .text(scaleBarDistance + ' mile');

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
 * Render a grouped stacked column chart.
 */
var renderGroupedStackedColumnChart = function(config) {

    /*
     * Setup
     */
    var labelColumn = 'label';

    var aspectWidth = 16;
    var aspectHeight = 9;
    var valueGap = 6;

    var margins = {
        top: 5,
        right: 1,
        bottom: 50,
        left: 33
    };

    var ticksY = 5;
    var roundTicksFactor = 50;

    if (isMobile) {
        aspectWidth = 4;
        aspectHeight = 2;
        margins['bottom'] = 65;
    }

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = Math.ceil((chartWidth * aspectHeight) / aspectWidth);

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    /*
     * Create D3 scale objects.
     */
    var xScale = d3.scale.ordinal()
        .domain(_.pluck(config['data'], 'category'))
        .rangeRoundBands([0, chartWidth], .1)

    var xScaleBars = d3.scale.ordinal()
        .domain(_.pluck(config['data'], labelColumn))
        .rangeRoundBands([0, xScale.rangeBand()], .1)

    var min = d3.min(config['data'], function(d) {
        return Math.floor(d['total'] / roundTicksFactor) * roundTicksFactor;
    });

    if (min > 0) {
        min = 0;
    }

    var max = d3.max(config['data'], function(d) {
        return Math.ceil(d['total'] / roundTicksFactor) * roundTicksFactor;
    });

    var yScale = d3.scale.linear()
        .domain([min, max])
        .rangeRound([chartHeight, 0]);

    var colorScale = d3.scale.ordinal()
        .domain(d3.keys(config['data'][0]).filter(function(d) {
            if (!_.contains(skipLabels, d)) {
                return d;
            }
        }))
        .range([ '#f1bb4f' ]);

    /*
     * Render the legend.
     */
    // var legend = containerElement.append('ul')
	// 	.attr('class', 'key')
	// 	.selectAll('g')
	// 		.data(colorScale.domain())
	// 	.enter().append('li')
	// 		.attr('class', function(d, i) {
	// 			return 'key-item key-' + i + ' ' + classify(d);
	// 		});
    //
    // legend.append('b')
    //     .style('background-color', function(d) {
    //         return colorScale(d);
    //     });
    //
    // legend.append('label')
    //     .text(function(d) {
    //         return d;
    //     });

    /*
     * Create the root SVG element.
     */
    var chartWrapper = containerElement.append('div')
        .attr('class', 'graphic-wrapper');

    var chartElement = chartWrapper.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
            .attr('transform', makeTranslate(margins['left'], margins['top']));

    /*
     * Create D3 axes.
     */
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat(function(d) {
            return d;
        });

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(ticksY)
        .tickFormat(function(d) {
            return (config.pct) ?
             d + '%' : d; });

    /*
     * Render axes to chart.
     */
    chartElement.append('g')
         .attr('class', 'x axis category')
         .attr('transform', makeTranslate(0, chartHeight))
         .call(xAxis);

    chartElement.selectAll('.x.axis.category .tick line').remove();
    chartElement.selectAll('.x.axis.category text')
        .attr('y', 35)
        .attr('dy', 0)
        .call(wrapText, xScale.rangeBand(), 13);

    chartElement.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    /*
     * Render grid to chart.
     */
    var yAxisGrid = function() {
        return yAxis;
    };

    chartElement.append('g')
        .attr('class', 'y grid')
        .call(yAxisGrid()
            .tickSize(-chartWidth, 0)
            .tickFormat('')
        );

    /*
     * Render bars to chart.
     */
    xScale.domain().forEach(function(c, k) {
        var categoryElement = chartElement.append('g')
            .attr('class', classify(c));

        var columns = categoryElement.selectAll('.columns')
            .data(config['data'].filter(function(d,i) {
                return d['category'] == c;
            }))
            .enter().append('g')
                .attr('class', function(d) {
                    return 'column ' + classify(d['label']);
                })
                .attr('transform', function(d) {
                    return makeTranslate(xScale(d['category']), 0);
                });

        // axis labels
        var xAxisBars = d3.svg.axis()
            .scale(xScaleBars)
            .orient('bottom')
            .tickFormat(function(d) {
                return d;
            });
        columns.append('g')
            .attr('class', 'x axis bars')
            .attr('transform', makeTranslate(0, chartHeight))
            .call(xAxisBars);

        // column segments
        var bars = columns.append('g')
            .attr('class', 'bar')
            .attr('transform', function(d) {
                return makeTranslate(xScaleBars(d[labelColumn]), 0);
            });

        bars.selectAll('rect')
            .data(function(d) {
                return d['values'];
            })
            .enter().append('rect')
                .attr('y', function(d) {
                    if (d['y1'] < d['y0']) {
                        return yScale(d['y0']);
                    }

                    return yScale(d['y1']);
                })
                .attr('width', xScaleBars.rangeBand())
                .attr('height', function(d) {
                    return Math.abs(yScale(d['y0']) - yScale(d['y1']));
                })
                .attr('class', function(d) {
                    return classify(d['name']);
                });

        /*
         * Render values to chart.
         */

        bars.selectAll('text')
            .data(function(d) {
                return d['values'];
            })
            .enter().append('text')
                .text(function(d) {
                    return (config.pct) ?
                     fmtnumber(d['val']) + '%' : fmtnumber(d['val']);
                })
                .attr('class', function(d) {
                    return classify(d['name']);
                })
                .attr('x', function(d) {
                    return xScaleBars.rangeBand() / 2;
                })
                .attr('y', function(d) {
                    var textHeight = d3.select(this).node().getBBox().height;
                    var barHeight = Math.abs(yScale(d['y0']) - yScale(d['y1']));

                    var barCenter = yScale(d['y1']) + ((yScale(d['y0']) - yScale(d['y1'])) / 2);
                    var centerPos = barCenter + textHeight / 2;

                    if (textHeight + valueGap * 2 > barHeight) {
                        d3.select(this).classed('hidden', true);
                        return centerPos - 3;
                    } else {
                        return centerPos;
                    }
                });
    })

    /*
     * Render 0 value line.
     */
    if (min < 0) {
        chartElement.append('line')
            .attr('class', 'zero-line')
            .attr('x1', 0)
            .attr('x2', chartWidth)
            .attr('y1', yScale(0))
            .attr('y2', yScale(0));
    }
}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
