// Global vars
var pymChild = null;
var isMobile = false;
var dataSeries = [];
var all_facilities = [];

/*
 * Initialize graphic
 */
var onWindowLoaded = function() {
    formatData();

    pymChild = new pym.Child({
        renderCallback: render
    });

}

/*
 * Format graphic data for processing by D3.
 */
var formatData = function() {

    facilities = [DATA_01,DATA_02, DATA_03, DATA_04,DATA_05,DATA_06,DATA_07,DATA_08,DATA_09,DATA_10,DATA_11,DATA_12,DATA_13,DATA_14,DATA_15,DATA_16,DATA_17,DATA_18,DATA_19,DATA_20,DATA_21,DATA_22,]
    
    facilities.forEach(function(DATA) {

        dataSeries = [];

        DATA.forEach(function(d) {
            d['date'] = d3.time.format('%B').parse(d['date']);

            for (var key in d) {
                if (key != 'date' && d[key] != null && d[key].length > 0) {
                    d[key] = +d[key];
                }
            }
        });

        /*
        * Restructure tabular data for easier charting.
        */
        for (var column in DATA[0]) {
            if (column == 'date') {
                continue;
            }

            dataSeries.push({
                'name': column,
                'values': DATA.map(function(d) {
                    return {
                        'date': d['date'],
                        'amt': d[column]
                    };
        // filter out empty data. uncomment this if you have inconsistent data.
               }).filter(function(d) {
                   return d['amt'] != null;
                })
            });
        }

        all_facilities.push(dataSeries);

    })
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

    chart_containers = [
        '#line-chart-01',
        '#line-chart-02',
        '#line-chart-03',
        '#line-chart-04',
        '#line-chart-05',
        '#line-chart-06',
        '#line-chart-07',
        '#line-chart-08',
        '#line-chart-09',
        '#line-chart-10',
        '#line-chart-11',
        '#line-chart-12',
        '#line-chart-13',
        '#line-chart-14',
        '#line-chart-15',
        '#line-chart-16',
        '#line-chart-17',
        '#line-chart-18',
        '#line-chart-19',
        '#line-chart-20',
        '#line-chart-21',
        '#line-chart-22',
    ]
    
    // Render the chart!
    chart_containers.forEach( function (d,i) {
            renderLineChart({
            container: d,
            width: containerWidth,
            data: all_facilities[i]
        });
    })

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * Render a line chart.
 */
var renderLineChart = function(config) {
    /*
     * Setup
     */
    var dateColumn = 'date';
    var valueColumn = 'amt';

    // var aspectWidth = isMobile ? 4 : 16;
    // var aspectHeight = isMobile ? 3 : 9;

    var width = 100;
    var height = 100;

    var margins = {
        top: 10,
        right: 30,
        bottom: 50,
        left: 40,
    };

    var ticksX = 4;
    var ticksY = 4;
    var roundTicksFactor = 1;

    // Mobile
    if (isMobile) {
        ticksX = 4;
        ticksY = 4;
    }

    // Calculate actual chart dimensions
    var chartWidth = width;
    var chartHeight = height;

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    /*
     * Create D3 scale objects.
     */
    var xScale = d3.time.scale()
        .domain(d3.extent(config['data'][0]['values'], function(d) {
            return d['date'];
        }))
        .range([ 0, chartWidth ])

    var min = d3.min(config['data'], function(d) {
        return d3.min(d['values'], function(v) {
            return Math.floor(v[valueColumn] / roundTicksFactor) * roundTicksFactor;
        })
    });

    if (min > 0) {
        min = 0;
    }

    var max = d3.max(config['data'], function(d) {
        return d3.max(d['values'], function(v) {
            return Math.ceil(v[valueColumn] / roundTicksFactor) * roundTicksFactor;
        })
    });

    var yScale = d3.scale.linear()
        .domain([0, 30])
        .range([chartHeight, 0]);

    var colorScale = d3.scale.ordinal()
        .domain(config.data.map(function(d) { return d.name }))
        .range([colors.red,colors.blue,colors.yellow,colors.orange]);

    /*
     * Render the HTML legend.
     */
    // var legend = containerElement.append('ul')
    //     .attr('class', 'key')
    //     .selectAll('g')
    //     .data(config['data'])
    //     .enter().append('li')
    //         .attr('class', function(d, i) {
    //             return 'key-item ' + classify(d['name']);
    //         });

    // legend.append('b')
    //     .style('background-color', function(d) {
    //         return colorScale(d['name']);
    //     });

    // legend.append('label')
    //     .text(function(d) {
    //         return d['name'];
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
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    /*
     * Create D3 axes.
     */
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(ticksX)
        .tickFormat(function(d, i) {
            if (isMobile) {
                return getAPMonth(d);
            } else {
                return getAPMonth(d);
            }
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

    chartElement.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    /*
     * Render grid to chart.
     */
    var xAxisGrid = function() {
        return xAxis;
    }

    var yAxisGrid = function() {
        return yAxis;
    }

    chartElement.append('g')
        .attr('class', 'x grid')
        .attr('transform', makeTranslate(0, chartHeight))
        .call(xAxisGrid()
            .tickSize(-chartHeight, 0, 0)
            .tickFormat('')
        );

    chartElement.append('g')
        .attr('class', 'y grid')
        .call(yAxisGrid()
            .tickSize(-chartWidth, 0, 0)
            .tickFormat('')
        );

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

    /*
     * Render lines to chart.
     */
    var line = d3.svg.line()
        .interpolate('linear')
        .x(function(d) {
            return xScale(d[dateColumn]);
        })
        .y(function(d) {
            return yScale(d[valueColumn]);
        });

    chartElement.append('g')
        .attr('class', 'lines')
        .selectAll('path')
        .data(config['data'])
        .enter()
        .append('path')
            .attr('class', function(d, i) {
                return 'line ' + classify(d['name']);
            })
            .attr('stroke', function(d) {
                return colorScale(d['name']);
            })
            .attr('d', function(d) {
                return line(d['values']);
            });

    // chartElement.append('g')
    //     .attr('class', 'value')
    //     .selectAll('text')
    //     .data(config['data'])
    //     .enter().append('text')
    //         .attr('x', function(d, i) {

    //             if (d['name'] == '2019') {
    //                 var first = d['values'][0];

    //                 return xScale(first[dateColumn]) + 5;
    //             } else {
    //                 var last = d['values'][d['values'].length - 1];

    //                 return xScale(last[dateColumn]) + 5;
    //             }
    //         })
    //         .attr('y', function(d) {
                
    //                 if (d['name'] == '2019') {
    //                     var last = d['values'][d['values'].length - 1];
    
    //                     return yScale(0);
    //                 } else {
    //                     var last = d['values'][d['values'].length - 1];
    
    //                     return yScale(last[valueColumn]) + 3;
    //                 }
    //         })
    //         .text(function(d) {
    //             var last = d['values'][d['values'].length - 1];
    //             var value = last[valueColumn];

    //             var label = last[valueColumn].toFixed(0);

    //             if (!isMobile) {
    //                 label = label;
    //             }

    //             return label;
    //         })
    //         .call(wrapText, margins.right, 12);
}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
