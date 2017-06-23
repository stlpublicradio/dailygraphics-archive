// Global vars
var pymChild = null;
var isMobile = false;
var skipLabels = [ 'Group', 'Year', 'State', 'key', 'values' ];
var fmtNum = d3.format('0f')

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

}

/*
 * Format graphic data for processing by D3.
 */
var formatData = function() {
    DATA = d3.nest()
          .key(function(d) { return d.Group; })
          .key(function(d) { return d.year; })
          .entries(DATA);
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
    renderStackedBarChart({
        container: '#stacked-bar-chart',
        width: containerWidth,
        data: DATA
    });

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * Render a stacked bar chart.
 */
var renderStackedBarChart = function(config) {
    /*
     * Setup
     */
    var labelColumn = 'label';

    var barHeight = 30;
    var barGap = 5;
    var labelWidth = 110;
    var labelMargin = 6;
    var valueGap = 6;
    var placeHeight = (barHeight + barGap) * 4;
    var placeGap = 20;

    var margins = {
        top: 0,
        right: 20,
        bottom: 20,
        left: (labelWidth + labelMargin)
    };

    var ticksX = 4;
    var roundTicksFactor = 100;

    if (isMobile) {
        ticksX = 2;
    }

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = (placeHeight + placeGap) * 9;

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    /*
     * Create D3 scale objects.
     */
     var min = 0;
     var max = 342;

    var xScale = d3.scale.linear()
        .domain([min, max])
        .rangeRound([0, chartWidth]);

    // var colorScale = d3.scale.ordinal()
    //     .domain(d3.keys(config['data'][0]).filter(function(d) {
    //         if (!_.contains(skipLabels, d)) {
    //             return d;
    //         }
    //     }))
    //     .range([ colors.blue, colors.green, colors.yellow, colors.orange ]);

    /*
     * Render the legend.
     */
    var legend = containerElement.append('ul')
		.attr('class', 'key')
		.selectAll('g')
			.data(['Fentanyl-related deaths','All overdose deaths'])
		.enter().append('li')
			.attr('class', function(d, i) {
				return 'key-item key-' + i + ' ' + classify(d);
			});

    legend.append('b');

    legend.append('label')
        .text(function(d) {
            return d;
        });

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
        .tickFormat(function(d) {
            return d;
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
     var places = chartElement.selectAll('.place')
         .data(config['data'])
         .enter()
         .append('g')
         .attr('class', function(d) { return 'place ' + classify(d['key']); })
         .attr('transform', function(d, i) {
             if (i == 0) {
                 return makeTranslate(0, 0);
             }

             return makeTranslate(0, (placeHeight + placeGap) * i);
         });

     var group = places.selectAll('.group')
         .data(function(d) {return d['values']})
         .enter().append('g')
             .attr('class', function(d) {
                 return 'group year-' + d['key'];
             })
             .attr('transform', function(d,i) {
                 return 'translate(0,' + (i * (barHeight + barGap)) + ')';
             });

     group.selectAll('rect')
         .data(function(d) {
             return d.values;
         })
         .enter().append('rect')
             .attr('x', xScale(0))
             .attr('width', function(d) {
                 return xScale(d["number"]);
             })
             .attr('height', barHeight)
             .attr('class', function(d) {
                 return classify(d['type']);
             });

     /*
      * Render bar values.
      */
    if (!isMobile) {
     places.append('g')
        .attr('class', 'value')
        .selectAll('text')
        .data(function(d) {
            return d.values;
        })
        .enter()
        .append('text')
            .text(function(d) {
                if (d.values[1].number != 0) {
                    num = fmtNum(d.values[1].number)
                    if (d.values[0].number == null) {
                        return num + '*';
                    }
                    else {
                        return num;
                    }
                }
            })
            .attr('class', 'label in')
            .attr('x', function(d) {
                    return xScale(+d.values[1].number);
            })
            .attr('dx', function(d) {
                var textWidth = this.getComputedTextLength();
                var barWidth = Math.abs(xScale(d.values[1].number));

                // Hide labels that don't fit
                if (textWidth + valueGap * 2 > barWidth) {
                    if (+d.values[0].number < 12 ) {
                            d3.select(this).classed('out', true);
                            if (d.values[0].number == null) {
                                return 5;
                            }
                            d3.select(this).text(function(d) {
                                if (d.values[1].number != 0) {
                                    return 'Fentanyl: ' + fmtNum(d.values[1].number)
                                }
                            })
                            return 30;

                        }
                    return 5;
                }


                return -(valueGap + textWidth);
            })
            .attr('dy', function(d, i) {
                if (i == 0) {
                    return (barHeight / 2)
                }
                else {
                    return ((barHeight / 2) + (barHeight + barGap) * (i));
                }
            })

    places.append('g')
        .attr('class', 'value')
        .selectAll('text')
        .data(function(d) {
            return d.values;
        })
        .enter()
        .append('text')
            .text(function(d) {
                if (d.values[0].number) {
                    return fmtNum(d.values[0].number)
                }
            })
            .attr('class', 'label')
            .attr('x', function(d) {
                    if (d.values[0].number) {
                        return xScale(+d.values[0].number);
                    }
                    else {
                        return xScale(+d.values[1].number);
                    }
                })
            .attr('dx', function(d) {
                var textWidth = this.getComputedTextLength();
                var barWidth = Math.abs(xScale(d.values[0].number));

                // Hide labels that don't fit
                if (textWidth + valueGap * 2 > barWidth) {
                    if (+d.values[0].number < 15 && +d.values[1].number > 0) {
                        d3.select(this).classed('out', true);
                        d3.select(this).text(function(d) {
                            if (+d.values[0].number != 0) {
                                return 'Total: ' + fmtNum(d.values[0].number)
                            }
                        })
                        return 100;
                    }

                    d3.select(this).classed('out', true);
                    return 5;
                }
                else if (+d.values[0].number - +d.values[1].number < 30) {
                    d3.select(this).classed('out', true);
                    return 5;
                }
                else (
                    d3.select(this).classed('in', true)
                )


                return -(valueGap + textWidth);
            })
            .attr('dy', function(d, i) {
                if (i == 0) {
                    return (barHeight / 2)
                }
                else {
                    return ((barHeight / 2) + (barHeight + barGap) * (i));
                }
            })
          }

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
    var places = chartWrapper.append('ul')
        .attr('class', 'labels')
        .attr('style', formatStyle({
            'width': labelWidth + 'px',
            'top': margins['top'] + 'px',
            'left': '0'
        }))

        places.selectAll('.labels')
        .append('li')
        .data(config['data'])
        .enter()
        .append('li')
            .attr('style', function(d, i) {
                return formatStyle({
                    'width': labelWidth + 'px',
                    'height': barHeight + 'px',
                    'left': '0px',
                    'top': (i * (placeHeight + placeGap)) - 10 + 'px;'
                });
            })
            .attr('class', function(d) {
                return classify("place " + d['key']);
            })
            .append('span')
                .text(function(d) {
                    return d['key'];
                })

    places.selectAll('li').selectAll('.place')
        .append('li')
        .data(['2013','2014','2015','2016'])
        .enter()
        .append('li')
        .attr('class', 'year')
        .text(function(d) { return d;})
        .attr('style', function(d, i) {
            if (i == 0) {
                return formatStyle({
                'width': labelWidth + 'px',
                'height': barHeight + 'px',
                'left': '0px',
                'top': (i * (barHeight + barGap)) + 20 + 'px;'
            });
            }
            else {
                return formatStyle({
                'width': labelWidth + 'px',
                'height': barHeight + 'px',
                'left': '0px',
                'top': (i * (barHeight + barGap)) + 18 + 'px;'
            });
            }
        })




}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
