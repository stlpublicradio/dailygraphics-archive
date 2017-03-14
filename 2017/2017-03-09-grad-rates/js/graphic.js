// Global config
var COLOR_BINS = [ 70, 75, 80, 85, 90, 95, 100.001 ];
var COLOR_RANGE = ['#cc203b', '#e8604d', '#f6883e', '#f1bb4f', '#449970', '#70a99a', '#31716e'];

fmtRound = d3.format(".0f")
fmtTenths = d3.format(".1f")

// Global vars
var pymChild = null;
var isMobile = false;
var binnedData = [];

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        formatData();

        pymChild = new pym.Child({
            renderCallback: render
        });
    } else {
        pymChild = new pym.Child({});
    }

    // pymChild.onMessage('on-screen', function(bucket) {
    //     ANALYTICS.trackEvent('on-screen', bucket);
    // });
    // pymChild.onMessage('scroll-depth', function(data) {
    //     data = JSON.parse(data);
    //     ANALYTICS.trackEvent('scroll-depth', data.percent, data.seconds);
    // });
}

/*
 * Format graphic data for processing by D3.
 */
var formatData = function() {
    var numBins = COLOR_BINS.length - 1;

    // init the bins
    for (var i = 0; i < numBins; i++) {
        binnedData[i] = [];
    }

    // put states in bins
    _.each(DATA, function(d) {
        if (d['amt'] != null) {
            var amt = +d['amt'];
            var state = d['district'];

            for (var i = 0; i < numBins; i++) {
                if (amt >= COLOR_BINS[i] && amt < COLOR_BINS[i + 1]) {
                    binnedData[i].unshift(state);
                    break;
                }
            }
        }
    });

    console.log(binnedData)
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
    if (!isMobile) {
        renderBlockHistogram({
            container: '#chart',
            width: containerWidth,
            data: binnedData,
            bins: COLOR_BINS,
            colors: COLOR_RANGE
        });
    }
    else {
        renderBarChart({
    container: '#chart',
    width: containerWidth,
    data: DATA
});
    }

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * Render a bar chart.
 */
 var renderBarChart = function(config) {
    /*
     * Setup
     */
    var labelColumn = 'district';
    var valueColumn = 'amt';

    var barHeight = 30;
    var barGap = 5;
    var labelWidth = 100;
    var labelMargin = 6;
    var valueGap = 0;

    var margins = {
        top: 0,
        right: 15,
        bottom: 20,
        left: (labelWidth + labelMargin)
    };

    var ticksX = 4;
    var roundTicksFactor = 5;

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = ((barHeight + barGap) * config['data'].length);

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    /*
     * Create the root SVG element.
     */
    var chartWrapper = containerElement.append('div')
        .attr('class', 'graphic-wrapper');

    var chartElement = chartWrapper.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    /*
     * Create D3 scale objects.
     */
    var min = d3.min(config['data'], function(d) {
        return Math.floor(d[valueColumn] / roundTicksFactor) * roundTicksFactor;
    });

    if (min > 0) {
        min = 0;
    }

    var max = d3.max(config['data'], function(d) {
        return Math.ceil(d[valueColumn] / roundTicksFactor) * roundTicksFactor;
    })

    var xScale = d3.scale.linear()
        .domain([min, max])
        .range([0, chartWidth]);

    /*
     * Create D3 axes.
     */
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(ticksX)
        .tickFormat(function(d) {
            return d.toFixed(0) + '%';
        });

    /*
     * Render axes to chart.
     */
    chartElement.append('g')
        .attr('class', 'x axis')
        .attr('transform', makeTranslate(0, chartHeight))
        .call(xAxis);

    /*
     * Render grid to chart.
     */
    var xAxisGrid = function() {
        return xAxis;
    };

    chartElement.append('g')
        .attr('class', 'x grid')
        .attr('transform', makeTranslate(0, chartHeight))
        .call(xAxisGrid()
            .tickSize(-chartHeight, 0, 0)
            .tickFormat('')
        );

    /*
     * Render bars to chart.
     */
    chartElement.append('g')
        .attr('class', 'bars')
        .selectAll('rect')
        .data(config['data'])
        .enter()
        .append('rect')
            .attr('x', function(d) {
                if (d[valueColumn] >= 0) {
                    return xScale(0);
                }

                return xScale(d[valueColumn]);
            })
            .attr('width', function(d) {
                return Math.abs(xScale(0) - xScale(d[valueColumn]));
            })
            .attr('y', function(d, i) {
                return i * (barHeight + barGap);
            })
            .attr('height', barHeight)
            .attr('class', function(d, i) {
                return 'bar-' + i + ' ' + classify(d[labelColumn]);
            });

    /*
     * Render 0-line.
     */
    if (min < 0) {
        chartElement.append('line')
            .attr('class', 'zero-line')
            .attr('x1', xScale(0))
            .attr('x2', xScale(0))
            .attr('y1', 0)
            .attr('y2', chartHeight);
    }

    /*
     * Render bar labels.
     */
    chartWrapper.append('ul')
        .attr('class', 'labels')
        .attr('style', formatStyle({
            'width': labelWidth + 'px',
            'top': margins['top'] + 'px',
            'left': '0'
        }))
        .selectAll('li')
        .data(config['data'])
        .enter()
        .append('li')
            .attr('style', function(d, i) {
                return formatStyle({
                    'width': labelWidth + 'px',
                    'height': barHeight + 'px',
                    'left': '0px',
                    'top': (i * (barHeight + barGap)) + 'px;'
                });
            })
            .attr('class', function(d) {
                return classify(d[labelColumn]);
            })
            .append('span')
                .text(function(d) {
                    return d[labelColumn];
                });

    /*
     * Render bar values.
     */
    chartElement.append('g')
        .attr('class', 'value')
        .selectAll('text')
        .data(config['data'])
        .enter()
        .append('text')
            .text(function(d) {
                return fmtTenths(d[valueColumn]) + '%';
            })
            .attr('x', function(d) {
                return xScale(d[valueColumn]);
            })
            .attr('y', function(d, i) {
                return i * (barHeight + barGap);
            })
            .attr('dx', function(d) {
                var xStart = xScale(d[valueColumn]);
                var textWidth = this.getComputedTextLength()

                // Negative case
                if (d[valueColumn] < 0) {
                    var outsideOffset = -(valueGap + textWidth);

                    if (xStart + outsideOffset < 0) {
                        d3.select(this).classed('in', true)
                        return valueGap;
                    } else {
                        d3.select(this).classed('out', true)
                        return outsideOffset;
                    }
                // Positive case
                } else {
                    if (xStart + valueGap + textWidth > chartWidth) {
                        d3.select(this).classed('in', true)
                        return -(valueGap + textWidth);
                    } else {
                        d3.select(this).classed('out', true)
                        return valueGap + textWidth;
                    }
                }
            })
            .attr('dy', (barHeight / 2) + 3)
}

var renderBlockHistogram = function(config) {
    /*
     * Setup
     */
    var labelColumn = 'district';
    var valueColumn = 'amt';

    var blockHeight = 34;
    if (isMobile) {
        blockHeight = 18;
    }
    var blockGap = 1;

    var margins = {
        top: 20,
        right: 12,
        bottom: 20,
        left: 10
    };

    var ticksY = 4;

    // Determine largest bin
    var largestBin = _.max(binnedData, function(bin) {
        return bin.length;
    }).length;

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = ((blockHeight + blockGap) * largestBin);

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

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
     * Create D3 scale objects.
     */
    var xScale = d3.scale.ordinal()
        .domain(config['bins'].slice(0, -1))
        .rangeRoundBands([0, chartWidth], .1);

    var yScale = d3.scale.linear()
        .domain([ 0, largestBin ])
        .rangeRound([ chartHeight, 0 ]);

    /*
     * Create D3 axes.
     */
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .outerTickSize(0)
        .tickFormat(function(d) {
                return fmtRound(d) + '%';
        });

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(ticksY);

    /*
     * Render axes to chart.
     */
    chartElement.append('g')
        .attr('class', 'x axis')
        .attr('transform', makeTranslate(0, chartHeight))
        .call(xAxis);

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
     * Shift tick marks
     */
    chartElement.selectAll('.x.axis .tick')
        .attr('transform', function() {
            var el = d3.select(this);
            var transform = d3.transform(el.attr('transform'));

            transform.translate[0] = transform.translate[0] - (xScale.rangeBand() / 2) - ((xScale.rangeBand() * .1) / 2);
            transform.translate[1] = 3;

            return transform.toString();
        })

    var lastTick = chartElement.select('.x.axis')
        .append('g')
        .attr('class', 'tick')
        .attr('transform', function() {
            var transform = d3.transform();
            var lastBin = xScale.domain()[xScale.domain().length - 1];

            transform.translate[0] = xScale(lastBin) + xScale.rangeBand() + ((xScale.rangeBand() * .1) / 2);
            transform.translate[1] = 3;

            return transform.toString();
        })

    lastTick.append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', 6)

    lastTick.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', 9)
        .attr('dy', '0.71em')
        .text(function() {
            var t = config['bins'][config['bins'].length - 1];
            return fmtRound(t) + '%'
        });


    /*
     * Render bins to chart.
     */
    var bins = chartElement.selectAll('.bin')
        .data(config['data'])
        .enter().append('g')
            .attr('class', function(d,i) {
                return 'bin bin-' + i;
            })
            .attr('transform', function(d, i) {
                return makeTranslate(xScale(COLOR_BINS[i]), 0);
            });

    bins.selectAll('rect')
        .data(function(d, i) {
            // add the bin index to each row of data so we can assign the right color
            var formattedData = [];
            _.each(d, function(v,k) {
                formattedData.push({ 'key': k, 'value': v, 'parentIndex': i });
            })
            return formattedData;
        })
        .enter().append('rect')
            .attr('width', xScale.rangeBand())
            .attr('x', 0)
            .attr('y', function(d,i) {
                return chartHeight - ((blockHeight + blockGap) * (i + 1));
            })
            .attr('height', blockHeight)
            .attr('fill', function(d) {
                return config['colors'][d['parentIndex']];
            })
            .attr('class', function(d) {
                return classify(d['value']);
            });


    /*
     * Render bin values.
     */
    bins.append('g')
        .attr('class', 'value')
        .selectAll('text')
            .data(function(d) {
                return d3.entries(d);
            })
        .enter().append('text')
            .attr('x', (xScale.rangeBand() / 2))
            .attr('y', function(d,i) {
                return chartHeight - ((blockHeight + blockGap) * (i + 1));
            })
            .attr('dy', 14)
            .text(function(d) {
                return d['value'];
            });

    bins.selectAll('text')
        .call(wrapText, xScale.rangeBand() - 5, 14);

    /*
     * Render annotations
     */
//     var annotations = chartElement.append('g')
//         .attr('class', 'annotations');
//
//     annotations.append('text')
//         .attr('class', 'label-top')
//         .attr('x', xScale(0))
//         .attr('dx', -15)
//         .attr('text-anchor', 'end')
//         .attr('y', -10)
//         .html(LABELS['annotation_left']);
//
//     annotations.append('text')
//         .attr('class', 'label-top')
//         .attr('x', xScale(0))
//         .attr('dx', 5)
//         .attr('text-anchor', 'begin')
//         .attr('y', -10)
//         .html(LABELS['annotation_right']);
//
//     annotations.append('line')
//         .attr('class', 'axis-0')
//         .attr('x1', xScale(0) - ((xScale.rangeBand() * .1) / 2))
//         .attr('y1', -margins['top'])
//         .attr('x2', xScale(0) - ((xScale.rangeBand() * .1) / 2))
//         .attr('y2', chartHeight);
}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
