// Global vars
var pymChild = null;
var isMobile = false;
var dataSeries = [];

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
            'region': DATA_REGIONS[column],
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


    
    var drawChart = function(region_filter) {

        //     // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    var chartWrapper = containerElement.append('div')
            .attr('class', 'graphic-wrapper');
        
        var chartElement = chartWrapper.selectAll('svg')
            .data(config.data.filter(function(d) { 
                return region_filter.includes(d.region)
            }))
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


    dates = ['1/1/14','1/1/15','1/1/16','1/1/17','1/1/18']
    
    averages = {"statewide": [87.9,90.7,90.2,90.3,94.1],
                "A": [83.8,86.1,85.3,86.5,89.3],
                "B": [83.9,86.4,84.5,83.6,90.9],
                "C": [89.9,92.3,91.6,91.4,94.6],
                "D": [89.4,91.6,92.0,93.0,95.8],
                "E": [84.9,88.0,87.9,88.6,94.1],
                "F": [87.9,91.8,91.8,92.0,95.3],
                "G": [88.6,91.8,91.5,90.9,94.9],
                "H": [91.3,94.2,93.3,92.5,95.6],
                "I": [89.3,93.0,92.7,93.1,95.5]
                }

    var region_avg = {};

    for (var k in averages) {
        region_avg_temp = {'name': k,'values':[]}
    
        for (i=0; i<dates.length;i++) {
            date = d3.time.format('%m/%d/%y').parse(dates[i])
            region_avg_temp.values.push({'date': date, 'amt': averages[k][i]})
        }

        region_avg[k] = region_avg_temp;
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
            .data(function (d) {
                if (region_filter.length > 1) {
                    return [region_avg['statewide']]
                }
                else {
                    return [region_avg[region_filter]]
                }
            })
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

    chartWrapper.select('svg').select('g')
        .append('g')
        .attr('class','help-text')
        .append('text')
        .attr('text-anchor','middle')
        .attr('x', (width)/2)
        .attr('y', yScale(68))
        .text(function(d) {
            if (region_filter.length > 1) {
                return 'Statewide average'
            }
            else {
                return 'Region average'
            }
        })

        
        if (pymChild) {
            pymChild.sendHeight();
        }
        

    }

    drawChart(['A'])

    // Set up toggle buttons

    var button_regions = [
        {'name':'St. Louis Region','key':['A']},
        {'name':'Kansas City Region','key':['B']},
        {'name':'Southwest Region','key':['C']},
        {'name':'Central Region','key':['D']},
        {'name':'Southeast Region','key':['E']},
        {'name':'West Central Region','key':['F']},
        {'name':'South Central Region','key':['G']},
        {'name':'Northwest Region','key':['H']},
        {'name':'Northeast Region','key':['I']},
        {'name':'Statewide','key':['A','B','C','D','E','F','G','H','I']}]

    var buttons = d3.select('#buttons').selectAll('a')
        .data(button_regions)
        .enter()
        .append('a')
        .attr('class', 'button')
        .attr('id', function(d) { return classify(d.name)})
        .attr('value', function(d) { return d.key; })
        .text(function(d) {return d.name})

        d3.select('#st-louis-region').classed('selected', true);


        buttons.on("click", function(d) {
            buttons.classed('selected', false);

            d3.select(this).classed('selected',true);

            drawChart(d.key);
        })

}


/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
