// Global config
var GRAPHIC_DEFAULT_WIDTH = 600;
var MOBILE_THRESHOLD = 500;
var GRAPHIC_GUTTER = 10;
var LABEL_WIDTH = 15;

// Global vars
var pymChild = null;
var isMobile = false;
var graphicData = null;

// D3 formatters
var fmtComma = d3.format(',');

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        loadLocalData(GRAPHIC_DATA);
        //loadCSV('data.csv')
    } else {
        pymChild = new pym.Child({});
    }
}

/*
 * Load graphic data from a local source.
 */
var loadLocalData = function(data) {
    popData = data[0];
    raceData = data[1];
    pop_chgData = data[2];
    pct_vacantData = data[3];
    income = data[4];
    violent_crime = data[5];
    property_crime = data[6];
    obese = data[7];

    formatData(popData);
    formatData(raceData);
    formatData(pop_chgData);
    formatData(pct_vacantData);
    formatData(income);
    formatData(violent_crime);
    formatData(property_crime);
    formatData(obese);

    pymChild = new pym.Child({
        renderCallback: render
    });
}

/*
 * Load graphic data from a CSV.
 */
var loadCSV = function(url) {
    d3.csv(GRAPHIC_DATA_URL, function(error, data) {
        graphicData = data;

        formatData();

        pymChild = new pym.Child({
            renderCallback: render
        });
    });
}

/*
 * Format graphic data for processing by D3.
 */
var formatData = function(data) {
    data.forEach(function(d) {
        d['amt'] = +d['amt'];
    });
}

/*
 * Render the graphic(s). Called by pym with the container width.
 */
var render = function(containerWidth) {
    if (!containerWidth) {
        containerWidth = GRAPHIC_DEFAULT_WIDTH;
    }

    if (containerWidth <= MOBILE_THRESHOLD) {
        isMobile = true;
        graphicWidth = containerWidth - GRAPHIC_GUTTER - LABEL_WIDTH;

    } else {
        isMobile = false;
        graphicWidth = Math.floor(((containerWidth - (GRAPHIC_GUTTER * 3) - LABEL_WIDTH) / 2));

    }


    // Render the chart!
    renderColumnChart({
      title: 'Population',
        container: '#pop',
        width: graphicWidth,
        data: popData,
        format: ',.0f',
        formatTick: ',.2s'
    });

    renderColumnChart({
      title: 'Population change 2000-2010',
        container: '#pop_chg',
        width: graphicWidth,
        data: pop_chgData,
        format: '0.3p',
        formatTick: '0.1p',
        stl: -.083
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
    var valueColumn = 'amt';
    var aspectWidth = isMobile ? 3 : 4;
    var aspectHeight = isMobile ? 3 : 4;
    var valueMinHeight = 30;

    var margins = {
        top: 20,
        right: 45,
        bottom: 150,
        left: 40
    };

    var ticksY = 4;
    var roundTicksFactor = .1;

    var format = d3.format(config['format']);
    var formatTick = d3.format(config['formatTick']);

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

        var title = chartWrapper.append('h3')
        .html(config['title']);

    var chartElement = chartWrapper.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    /*
     * Create D3 scale objects.
     */
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, chartWidth], .1)
        .domain(config['data'].map(function (d) {
            return d[labelColumn];
        }));

    var yScale = d3.scale.linear()
        .domain([d3.min([0,d3.min(config['data'], function(d) {
            return Math.floor(d[valueColumn] / roundTicksFactor) * roundTicksFactor;
        })]), d3.max([config['stl'],d3.max(config['data'], function(d) {
            return Math.ceil(d[valueColumn] / roundTicksFactor) * roundTicksFactor;
        })])])
        .range([chartHeight, 0]);

    /*
     * Create D3 axes.
     */
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat(function(d, i) {
            return d;
        });

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(ticksY)
        .tickFormat(function(d) {
            return formatTick(d);
        });

    /*
     * Render axes to chart.
     */
    chartElement.append('g')
        .attr('class', 'x axis')
        .attr('transform', makeTranslate(0, chartHeight))
        .call(xAxis)
        .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

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
     * Render bars to chart.
     */
    chartElement.append('g')
        .attr('class', 'bars')
        .selectAll('rect')
        .data(config['data'])
        .enter()
        .append('rect')
            .attr('x', function(d) {
                return xScale(d[labelColumn]);
            })
            .attr('y', function(d) {
                if (d[valueColumn] < 0) {
                    return yScale(0);
                }

                return yScale(d[valueColumn]);
            })
            .attr('width', xScale.rangeBand())
            .attr('height', function(d) {
                if (d[valueColumn] < 0) {
                    return yScale(d[valueColumn]) - yScale(0);
                }

                return yScale(0) - yScale(d[valueColumn]);
            })
            .attr('class', function(d) {
                return 'bar bar-' + d[labelColumn];
            });

      /* append STL average */
      if (config['stl']) {
      chartElement.append('line')
      .attr('class', 'stl')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', yScale(+config['stl']))
      .attr('y2', yScale(+config['stl']));};

    /*
     * Render 0 value line.
     */
    chartElement.append('line')
        .attr('class', 'y grid grid-0')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0));

    /*
     * Render bar values.
     */

     if (!isMobile) {
    chartElement.append('g')
        .attr('class', 'value')
        .selectAll('text')
        .data(config['data'])
        .enter()
        .append('text')
            .attr('x', function(d, i) {
                return xScale(d[labelColumn]) + (xScale.rangeBand() / 2);
            })
            .attr('y', function(d) {
                var y = yScale(d[valueColumn]);

                if (d[valueColumn] > 0) {

                  if (chartHeight - y > valueMinHeight) {
                      return y + 15;
                  }

                  return y - 6;
                }

                else {
                  if (chartHeight - yScale(d[valueColumn]) > chartHeight - valueMinHeight) {
                      return y + 15;
                  } else {
                      return y - 6;
                  }
                }
            })
            .attr('text-anchor', 'middle')
            .attr('class', function(d) {
                var c = 'y-' + classify(d[labelColumn]);

                if (d[valueColumn] > 0) {
                  if (chartHeight - yScale(d[valueColumn]) > valueMinHeight) {
                      c += ' in';
                  } else {
                      c += ' out';
                  }
                }
                else {
                  if (chartHeight - yScale(d[valueColumn]) > chartHeight - valueMinHeight) {
                      c += ' out';
                  } else {
                      c += ' in';
                  }
                }


                return c;
            })
            .text(function(d) {
                return format(d[valueColumn]);
            });

}


// render STL value
            if (config['stl']) {
            chartElement.append('g')
            .attr('class','value')
              .append('text')
              .attr('class', 'stl-value')
              .attr('x', chartWidth + 3)
              .attr('y', yScale(config['stl']) + 3)
              .text(format(config['stl']));
              }

}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
