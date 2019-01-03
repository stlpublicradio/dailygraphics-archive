// Global vars
var pymChild = null;
var isMobile = false;
var dataSeries = [];
var all_seasons = [];

/*
 * Initialize graphic
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

}

/*
 * Format graphic data for processing by D3.
 */
var formatData = function() {

    seasons = [DATA_86,DATA_87,DATA_88,DATA_89,DATA_90,DATA_91,DATA_92,DATA_93,DATA_94,DATA_95,DATA_96,DATA_97,DATA_98,DATA_99,DATA_00,DATA_01]

    seasons.forEach(function(DATA) {

        dataSeries = [];

        DATA.forEach(function(d) {
            d['date'] = d3.time.format('%m/%d/%y').parse(d['date']);

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


        all_seasons.push(dataSeries);

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

    // Render the chart!

    chart_containers = [
        '#line-chart-86',
        '#line-chart-87',
        '#line-chart-88',
        '#line-chart-89',
        '#line-chart-90',
        '#line-chart-91',
        '#line-chart-92',
        '#line-chart-93',
        '#line-chart-94',
        '#line-chart-95',
        '#line-chart-96',
        '#line-chart-97',
        '#line-chart-98',
        '#line-chart-99',
        '#line-chart-00',
        '#line-chart-01',
    ]

    chart_containers.forEach( function (d,i) {
       renderLineChart({
           container: d,
           width: containerWidth,
           data: all_seasons[i]
       }); 
    })


    // renderLineChart({
    //     container: '#line-chart-87',
    //     width: containerWidth,
    //     data: all_seasons[0]
    // });

    // renderLineChart({
    //     container: '#line-chart-88',
    //     width: containerWidth,
    //     data: all_seasons[1]
    // });

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

    var aspectWidth = isMobile ? 16 : 16;
    var aspectHeight = isMobile ? 4 : 4;

    var margins = {
        top: 5,
        right: 30,
        bottom: 20,
        left: 30
    };

    var ticksX = 10;
    var ticksY = 5;
    var roundTicksFactor = 5;

    // Mobile
    if (isMobile) {
        ticksX = 5;
        ticksY = 5;
        margins['right'] = 30;
    }

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = Math.ceil((config['width'] * aspectHeight) / aspectWidth) - margins['top'] - margins['bottom'];

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    /*
     * Create D3 scale objects.
     */
    year = config['data'][0]['values'][0]['date'].getFullYear();
    
    // console.log(year)

    var xScale = d3.time.scale()
        .domain( [new Date(year, 3, 1), new Date(year, 9, 5)])
        .range( [0,chartWidth])

    // var xScale = d3.time.scale()
    //     .domain(d3.extent(config['data'][0]['values'], function(d) {
    //         console.log(d['date'])
    //         return d['date'];
    //     }))
    //     .range([ 0, chartWidth ])


    var min = d3.min(config['data'], function(d) {
        return d3.min(d['values'], function(v) {
            return Math.floor(v[valueColumn] / roundTicksFactor) * roundTicksFactor;
        })
    });

    if (min > 0) {
        min = 0;
    }

    // var max = d3.max(config['data'], function(d) {
    //     return d3.max(d['values'], function(v) {
    //         return Math.ceil(v[valueColumn] / roundTicksFactor) * roundTicksFactor;
    //     })
    // });

    var yScale = d3.scale.linear()
        .domain([min, 70])
        .range([chartHeight, 0]);

    var colorScale = d3.scale.ordinal()
        .domain(_.pluck(config['data'], 'name'))
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

            return formatMonth(d);
            // if (isMobile) {
            //     return '\u2019' + fmtYearAbbrev(d);
            // } else {
            //     return fmtYearFull(d);
            // }
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
        .interpolate('step-after')
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
            // .attr('stroke', function(d) {
            //     return colorScale(d['name']);
            // })
            .attr('d', function(d) {
                return line(d['values']);
            });

    chartElement.append('g')
        .attr('class', 'value')
        .selectAll('text')
        .data(config['data'])
        .enter().append('text')
            .attr('x', function(d, i) {
                var last = d['values'][d['values'].length - 1];

                return xScale(last[dateColumn]) + 5;
            })
            .attr('y', function(d) {
                var last = d['values'][d['values'].length - 1];

                return yScale(last[valueColumn]) + 3;
            })
            .text(function(d) {
                var last = d['values'][d['values'].length - 1];
                var value = last[valueColumn];

                var label = last[valueColumn].toFixed(0);


                return label;
            });
}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
