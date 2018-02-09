// Global vars
var pymChild = null;
var isMobile = false;
var dataSeries = [];

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
                    'amt': d[column] ? d[column]*100 : null
                };
    // filter out empty data. uncomment this if you have inconsistent data.
           }).filter(function(d) {
               return d['amt'] != null;
            })
        });
    }
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
    renderLineChart({
        container: '#line-chart',
        width: containerWidth,
        data: dataSeries
    });

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * Render some small multiple line charts
 */

 var renderLineChart = function(config) {

    var dateColumn = 'date';
    var valueColumn = 'amt';

    var ticksX = 5;
    var ticksY = 4;

    var width = 100;
    var height = 100;

    var margins = {
        top: 50,
        right: 10,
        bottom: 50,
        left: 40
    };


    //     // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    var chartWrapper = containerElement.append('div')
            .attr('class', 'graphic-wrapper');
    
        var chartElement = chartWrapper.selectAll('svg')
            .data(config.data)
            .enter()
            .append('svg')
            .attr('class',function(d) { return classify(d.name) })
            .attr('width', width + margins['left'] + margins['right'])
            .attr('height', height + margins['top'] + margins['bottom'])
            .append('g')
            .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

     /*
     * Create D3 scale objects.
     */
    
    var xScale = d3.time.scale()
        .domain(d3.extent(config['data'][0]['values'], function(d) {
            return d['date'];
        }))
        .range([ 0, width ])

    var yScale = d3.scale.linear()
        .domain([0, 100])
        .range([height, 0]);

    var colorScale = d3.scale.ordinal()
        .domain(_.pluck(config['data'], 'name'))
        .range([colors.red]);
 
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(ticksX)
        .tickFormat(function(d, i) {
            return '\u2019' + fmtYearAbbrev(d);
        });


    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(ticksY)
        .tickFormat(function(d) {
            return d + '%';
        });

    /*
     * Render axes to chart.
     */

     chartElement.append('g')
        .attr('class', 'x axis')
        .attr('transform', makeTranslate(0, height))
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
        .attr('transform', makeTranslate(0, height))
        .call(xAxisGrid()
            .tickSize(-height, 0, 0)
            .tickFormat('')
        );

    chartElement.append('g')
        .attr('class', 'y grid')
        .call(yAxisGrid()
            .tickSize(-width, 0, 0)
            .tickFormat('')
        );


    dates = ['1/1/14','1/1/15','1/1/16','1/1/17']
    averages = [83.5,85.8,85.0,86.2]
    var region_avg = [{'name': 'Region Average','values':[]}]

    for (i=0; i<dates.length;i++) {
        date = d3.time.format('%m/%d/%y').parse(dates[i])
        region_avg[0].values.push({'date': date, 'amt': averages[i]})
    }
    
   

    /*
     * Render lines to chart.
     */
    var line = d3.svg.line()
        .interpolate('monotone')
        .x(function(d) {
            return xScale(d[dateColumn]);
        })
        .y(function(d) {
            return yScale(d[valueColumn]);
        });

        


    var lines = chartElement.append('g')
        .attr('class', 'lines')
        
    lines.append('path')
            .attr('class', function(d, i) {
                return 'line ' + classify(d['name']);
            })
            .attr('stroke', function(d) {
                return colorScale(d['name']);
            })
            .attr('d', function(d) {
                return line(d['values']);
            });

    lines.selectAll('.average')
            .data(region_avg)
            .enter()
            .append('path')
            .attr('class', 'line average')
            .attr('stroke', '#666')
            .attr('d', function(d) {
                return line(d['values']);
            });

    /*
    * Render district name
    */

    chartElement.append('text')
    // .attr('transform', 'translate(' + -5 + ',' + 0 + ')')  
    .attr('x', (width)/2)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .text(function(d){ return d.name;})
    .call(wrapText, width, 14)

    /*
    * Add average helper text
    */

    chartWrapper.select('.affton-101').select('g')
        .append('g')
        .attr('class','help-text')
        .append('text')
        .attr('text-anchor','middle')
        .attr('x', (width)/2)
        .attr('y', yScale(68))
        .text('Region average')

}
/*
 * Render a line chart.
 */
// var renderLineChart = function(config) {
//     console.log(config.data)
//     /*
//      * Setup
//      */
//     var dateColumn = 'date';
//     var valueColumn = 'amt';

//     var aspectWidth = isMobile ? 4 : 16;
//     var aspectHeight = isMobile ? 8 : 30;

//     var margins = {
//         top: 5,
//         right: 75,
//         bottom: 20,
//         left: 30
//     };

//     var ticksX = 10;
//     var ticksY = 4;
//     var roundTicksFactor = 5;

//     // Mobile
//     if (isMobile) {
//         ticksX = 5;
//         ticksY = 5;
//         margins['right'] = 25;
//     }

//     // Calculate actual chart dimensions
//     var chartWidth = config['width'] - margins['left'] - margins['right'];
//     var chartHeight = Math.ceil((config['width'] * aspectHeight) / aspectWidth) - margins['top'] - margins['bottom'];

//     // Clear existing graphic (for redraw)
//     var containerElement = d3.select(config['container']);
//     containerElement.html('');

//     /*
//      * Create D3 scale objects.
//      */
//     var xScale = d3.time.scale()
//         .domain(d3.extent(config['data'][0]['values'], function(d) {
//             return d['date'];
//         }))
//         .range([ 0, chartWidth ])

//     var min = d3.min(config['data'], function(d) {
//         return d3.min(d['values'], function(v) {
//             return Math.floor(v[valueColumn] / roundTicksFactor) * roundTicksFactor;
//         })
//     });

//     if (min > 0) {
//         min = 0;
//     }

//     var max = d3.max(config['data'], function(d) {
//         return d3.max(d['values'], function(v) {
//             return Math.ceil((v[valueColumn]) / roundTicksFactor) * roundTicksFactor;
//         })
//     });

//     var yScale = d3.scale.linear()
//         .domain([min, max])
//         .range([chartHeight, 0]);

//     var colorScale = d3.scale.ordinal()
//         .domain(_.pluck(config['data'], 'name'))
//         .range([colors.red]);

//     /*
//      * Render the HTML legend.
//      */
//     var legend = containerElement.append('ul')
//         .attr('class', 'key')
//         .selectAll('g')
//         .data(config['data'])
//         .enter().append('li')
//             .attr('class', function(d, i) {
//                 return 'key-item ' + classify(d['name']);
//             });

//     legend.append('b')
//         .style('background-color', function(d) {
//             return colorScale(d['name']);
//         });

//     legend.append('label')
//         .text(function(d) {
//             return d['name'];
//         });

//     /*
//      * Create the root SVG element.
//      */
//     var chartWrapper = containerElement.append('div')
//         .attr('class', 'graphic-wrapper');

//     var chartElement = chartWrapper.append('svg')
//         .attr('width', chartWidth + margins['left'] + margins['right'])
//         .attr('height', chartHeight + margins['top'] + margins['bottom'])
//         .append('g')
//         .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

//     /*
//      * Create D3 axes.
//      */
//     var xAxis = d3.svg.axis()
//         .scale(xScale)
//         .orient('bottom')
//         .ticks(ticksX)
//         .tickFormat(function(d, i) {
//             if (isMobile) {
//                 return '\u2019' + fmtYearAbbrev(d);
//             } else {
//                 return fmtYearFull(d);
//             }
//         });

//     var yAxis = d3.svg.axis()
//         .scale(yScale)
//         .orient('left')
//         .ticks(ticksY);

//     /*
//      * Render axes to chart.
//      */
//     chartElement.append('g')
//         .attr('class', 'x axis')
//         .attr('transform', makeTranslate(0, chartHeight))
//         .call(xAxis);

//     chartElement.append('g')
//         .attr('class', 'y axis')
//         .call(yAxis);

//     /*
//      * Render grid to chart.
//      */
//     var xAxisGrid = function() {
//         return xAxis;
//     }

//     var yAxisGrid = function() {
//         return yAxis;
//     }

//     chartElement.append('g')
//         .attr('class', 'x grid')
//         .attr('transform', makeTranslate(0, chartHeight))
//         .call(xAxisGrid()
//             .tickSize(-chartHeight, 0, 0)
//             .tickFormat('')
//         );

//     chartElement.append('g')
//         .attr('class', 'y grid')
//         .call(yAxisGrid()
//             .tickSize(-chartWidth, 0, 0)
//             .tickFormat('')
//         );

//     /*
//      * Render 0 value line.
//      */
//     if (min < 0) {
//         chartElement.append('line')
//             .attr('class', 'zero-line')
//             .attr('x1', 0)
//             .attr('x2', chartWidth)
//             .attr('y1', yScale(0))
//             .attr('y2', yScale(0));
//     }

//     /*
//      * Render lines to chart.
//      */
//     var line = d3.svg.line()
//         .interpolate('monotone')
//         .x(function(d) {
//             return xScale(d[dateColumn]);
//         })
//         .y(function(d) {
//             return yScale(d[valueColumn]);
//         });

//     chartElement.append('g')
//         .attr('class', 'lines')
//         .selectAll('path')
//         .data(config['data'])
//         .enter()
//         .append('path')
//             .attr('class', function(d, i) {
//                 return 'line ' + classify(d['name']);
//             })
//             .attr('stroke', function(d) {
//                 return colorScale(d['name']);
//             })
//             .attr('d', function(d) {
//                 return line(d['values']);
//             });

//     chartElement.append('g')
//         .attr('class', 'value')
//         .selectAll('text')
//         .data(config['data'])
//         .enter().append('text')
//             .attr('x', function(d, i) {
//                 var last = d['values'][d['values'].length - 1];

//                 return xScale(last[dateColumn]) + 5;
//             })
//             .attr('y', function(d) {
//                 var last = d['values'][d['values'].length - 1];

//                 return yScale(last[valueColumn]) + 3;
//             })
//             .text(function(d) {
//                 var last = d['values'][d['values'].length - 1];
//                 var value = last[valueColumn];

//                 var label = last[valueColumn].toFixed(1);

//                 if (!isMobile) {
//                     label = d['name'] + ': ' + label;
//                 }

//                 return label;
//             });
// }

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
