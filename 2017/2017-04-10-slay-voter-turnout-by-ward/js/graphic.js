// Global vars
var pymChild = null;
var isMobile = false;

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
    DATA.forEach(function(d) {
        d['turnout'] = +d['turnout']*100;
    });
}

var fmtPct = d3.format('.2f');

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
    renderDotChart({
        container: '#dot-chart',
        width: containerWidth,
        data: DATA
    });

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * Render a bar chart.
 */
var renderDotChart = function(config) {

    var sortOrder = ["More than 90% Black","Between 50% and 90% Black","Between 10% and 50% Black","Less than 10% Black"]

    var nested = d3.nest()
        .key(function(d) {return d.place; })
        .key(function(d) {return d.type; }).sortKeys(function(a,b) { return sortOrder.indexOf(a) - sortOrder.indexOf(b); })
        .entries(config.data)

    var getMaxTypes = function(data) {
        lengths = [];
        for (i = 0; i < data.length; i++) {
        lengths.push(data[i].values.length)
        };
        return (Math.max.apply(null, lengths));
    };

    /*
     * Setup
     */

    // var labelColumn = 'label';
    // var valueColumn = 'amt';
    // var minColumn = 'min';
    // var maxColumn = 'max';
    //

    var labelWidth = 30;
    var labelMargin = 5;
    var valueMinWidth = 30;
    var dotRadius = 3;
    var groupHeight = 50;
    var groupGap = 30;
    var barHeight = 5;
    var barGap = 5;

    var margins = {
        top: 20,
        right: 20,
        bottom: 0,
        left: (labelWidth + labelMargin)
    };

    var ticksX = 4;
    var roundTicksFactor = 5;

    if (isMobile) {
        ticksX = 6;
        margins['right'] = 30;
    }

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = ((barHeight + barGap) * getMaxTypes(nested)) + 250;

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
    var min = 0;
    var max = d3.max(config['data'], function(d) {
        return Math.ceil(d['turnout'] / roundTicksFactor) * roundTicksFactor;
    });

    var xScale = d3.scale.linear()
        .domain([min, max])
        .range([0, chartWidth]);

    /*
     * Create D3 axes.
     */
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('top')
        .ticks(ticksX)
        .tickFormat(function(d) {
            return d + '%';
        });

    /*
     * Render axes to chart.
     */
    chartElement.append('g')
        .attr('class', 'x axis')
        .call(xAxis);

    /*
     * Render grid to chart.
     */
    var xAxisGrid = function() {
        return xAxis;
    };

    chartElement.append('g')
        .attr('class', 'x grid')
        .call(xAxisGrid()
            .tickSize(-chartHeight, 0, 0)
            .tickFormat('')
        );

    /*
     * Render group for each place.
     */
    var places = chartElement.append('g')
        .attr('class', 'bars')
        .selectAll('line')
        .data(nested)
        .enter()
        .append('g')
        .attr('class', function(d) { return classify(d.key); })
        .attr('transform', function (d, i) {
            if (i == 0) {
                return makeTranslate(0,0);
            }
            else {
                return makeTranslate(0, (groupHeight + groupGap) * i);
            }
        })

    var races = places.selectAll('g')
        .data(function(d) {
            return d.values;
        })
        .enter()
        .append('g')
        .attr('class', function(d) { return classify(d.key); })
        .attr('transform', function (d, i) {
            if (i == 0) {
                return makeTranslate(0,0);
            }
            else {
                return makeTranslate(0, (barHeight + barGap) * i);
            }
        })

    var  dots = races.selectAll('circle')
        .data(function(d) {
            return d.values;
        })
        .enter().append('circle')
            .attr('class', function(d, i) {
                return "year-" + d.type + " id-" + d.id;
            })
            .attr('cx', function(d,i) {
                return xScale(d.turnout);
            })
            .attr('cy', '10')
            .attr('r', dotRadius)
            .on("mouseover", function(d) {
                highlightSameRace(d)
            })
            .on("mouseout", function() {
                resetHighlight()
            })
            .on("touchstart", function(d) {
                    resetHighlight();
                    highlightSameRace("id-" + d.id);
            })


    /*
     * Render place labels.
     */
    containerElement
        .append('ul')
        .attr('class', 'labels')
        .attr('style', formatStyle({
            'width': labelWidth + 'px',
            'top': margins['top'] + 'px',
            'left': '0'
        }))
        .selectAll('li')
        .data(nested)
        .enter()
        .append('li')
            .attr('style', function(d, i) {
                return formatStyle({
                    'width': labelWidth + 'px',
                    'height': barHeight + 'px',
                    'left': '0px',
                    'top': (i * (groupHeight + groupGap)) + 'px;'
                });
            })
            .attr('class', function(d) {
                return classify(d.key);
            })
            .append('span')
                .text(function(d) {
                    return d.key;
                });

     /*
      * Function to link up same race
      */

      var highlightSameRace = function(d) {
          d3.selectAll('circle')
          .transition()
          .duration(200)
          .style("opacity", .4);

          d3.selectAll('.id-' + d.id)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .attr('r', 6);

          createPopup(d)

      };

      var resetHighlight = function() {
          d3.selectAll('circle')
          .transition()
          .duration(200)
          .style("opacity", 1)
          .attr('r', dotRadius)

          killPopup()
      }

      /*
       * Function to create popup
       */
       var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

       var createPopup = function(d) {
           div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("Ward " + d.id + "<br/>(" + d.percent_black + " black in " + d.place +")<br/>Percentage for Slay: <strong>" + fmtPct(d.turnout) + "%</strong>")
                .style("left", function(d) {
                        if (d3.event.pageX < chartWidth / 2) {
                            return (d3.event.pageX + 10) + "px"
                        }
                        else {
                            return (d3.event.pageX - 160) + "px"
                        }
                })
                .style("top", (d3.event.pageY - 70) + "px");
       }

       var killPopup = function() {
           div.transition()
            .duration(200)
            .style("opacity", 0)

            div.transition()
            .delay(200)
            .style("left", "0px")
            .style("top", "0px")

            div.html("")
       }


    //
    // /*
    //  * Render bar values.
    //  */
    // _.each(['shadow', 'value'], function(cls) {
    //     chartElement.append('g')
    //         .attr('class', cls)
    //         .selectAll('text')
    //         .data(config['data'])
    //         .enter().append('text')
    //             .attr('x', function(d, i) {
    //                 return xScale(d[maxColumn]) + 6;
    //             })
    //             .attr('y', function(d,i) {
    //                 return i * (barHeight + barGap) + (barHeight / 2) + 3;
    //             })
    //             .text(function(d) {
    //                 return d[valueColumn].toFixed(1) + '%';
    //             });
    // });
}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
