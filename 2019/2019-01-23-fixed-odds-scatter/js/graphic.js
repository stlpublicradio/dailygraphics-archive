// Global vars
var pymChild = null;
var isMobile = false;
var whichData = "all";

var highlightStates = ['Missouri','Oregon','Connecticut', 'Kansas'];

var fmtMoney = d3.format('$,.0f');
var fmtPennies = d3.format('$,.2f');

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
        formatData();

        pymChild = new pym.Child({
            renderCallback: render
})
}

/*
 * Format graphic data for processing by D3.
 */
var formatData = function() {
    DATA.forEach(function(d) {
        d['help_per_cap'] = +d['help_per_cap'];
        d['income_per_cap'] = +d['income_per_cap'];

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
    renderColumnChart({
        container: '#column-chart',
        width: containerWidth,
        data: DATA
    });

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * Render a column chart.
 */
var renderColumnChart = function(config) {
    /*
     * Setup chart container.
     */
    var labelColumn = 'label';
    var xColumn = 'income_per_cap';
    var yColumn = 'help_per_cap';


    var aspectWidth = isMobile ? 4 : 16;
    var aspectHeight = isMobile ? 3 : 9;
    var valueGap = 6;

    var margins = {
        top: 5,
        right: 10,
        bottom: 20,
        left: 40
    };

    var radius = 3

    var ticksY = 4;
    var ticksX = 8;
    var x_roundTicksFactor = 10;
    var y_roundTicksFactor = .1;

    if (isMobile) {
        ticksX = 3;
        radius = 2;
    }

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = Math.ceil((config['width'] * aspectHeight) / aspectWidth) - margins['top'] - margins['bottom'];

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
    var x_min = d3.min(config['data'], function(d) {
        return Math.floor(d[xColumn] / x_roundTicksFactor) * x_roundTicksFactor;
    });

    // if (min > 0) {
    //     min = 0;
    // }

    var x_max = d3.max(config['data'], function(d) {
        return Math.ceil(d[xColumn] / x_roundTicksFactor) * x_roundTicksFactor;
    });
    
    var xScale = d3.scale.linear()
        // .rangeRoundBands([0, chartWidth], .1)
        .range([0, chartWidth])
        .domain([x_min,x_max])
        // .domain(config['data'].map(function (d) {
        //     return d[labelColumn];
        // }));

    var y_min = d3.min(config['data'], function(d) {
        return Math.floor(d[yColumn] / y_roundTicksFactor) * y_roundTicksFactor;
    });

    if (y_min > 0) {
        y_min = 0;
    }

    var y_max = d3.max(config['data'], function(d) {
        return Math.ceil(d[yColumn] / y_roundTicksFactor) * y_roundTicksFactor;
    });

    var yScale = d3.scale.linear()
        .domain([y_min, y_max])
        .range([chartHeight, 0]);

    /*
     * Create D3 axes.
     */
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(ticksX)
        .tickFormat(function(d, i) {
            return fmtMoney(d);
        });

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(ticksY)
        .tickFormat(function(d) {
            return fmtPennies(d);
        });

    /*
     * Render axes to chart.
     */
    chartElement.append('g')
        .attr('class', 'x axis')
        .attr('transform', makeTranslate(0, chartHeight))
        .call(xAxis);

    chartElement.append('g')
        .attr('class', 'y axis')
        .call(yAxis)

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
     * Render dots to chart.
     */
    chartElement.append('g')
        .attr('class', 'circle')
        .selectAll('circle')
        .data(config['data'])
        .enter()
        .append('circle')
            .attr('cx', function(d) {
                return xScale(d[xColumn]);
            })
            .attr('cy', function(d) {
                if (d[yColumn] < 0) {
                    return yScale(0);
                }

                return yScale(d[yColumn]);
            })
            .attr('r', function(d) {
                if (highlightStates.includes(d[labelColumn])) {
                    return radius + 2
                }
                else {
                    return radius
                }
            })
            .attr('class', function(d) {
                return 'dot dot-' + classify(d[labelColumn]);
            });

    chartElement.append('g')
        .attr('class', 'state-label')
        .selectAll('text')
        .data(config['data'].filter(function(d) { return highlightStates.includes(d[labelColumn])}))
        .enter()
        .append('text')
        .attr('x', function(d) {
            return xScale(d[xColumn]);
        })
        .attr('y', function(d) {
            if (d[yColumn] < 0) {
                return yScale(0);
            }

            return yScale(d[yColumn]);
        })
        .attr('dx', 5)
        .attr('dy', -5)
        .text(function(d) {return d[labelColumn]})

    /*
     * Render 0 value line.
     */
    if (y_min < 0) {
        chartElement.append('line')
            .attr('class', 'zero-line')
            .attr('x1', 0)
            .attr('x2', chartWidth)
            .attr('y1', yScale(0))
            .attr('y2', yScale(0));
    }

    chartElement.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", chartWidth)
        .attr("y", chartHeight - 6)
        .text("casino & lottery revenue; per capita");


    chartElement.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -5)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("problem gambling spending; per capita");

    chartElement.append("g")
        .attr("class", "state-label")
        .selectAll("text")
        .data(config['data'].filter(function(d) { return d[labelColumn] == 'Nevada'; }))
        .enter()
        .append('text')
        .attr('text-anchor','end')
        .attr('x', function(d) {
            return xScale(d[xColumn]);
        })
        .attr('y', function(d) {
            if (d[yColumn] < 0) {
                return yScale(0);
            }

            return yScale(d[yColumn]);
        })
        .attr('dx', -5)
        .attr('dy', -5)
        .text(function(d) {return d[labelColumn]})

}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
