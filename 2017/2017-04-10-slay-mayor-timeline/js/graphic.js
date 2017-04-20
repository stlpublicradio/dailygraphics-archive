// Global vars
var pymChild = null;
var isMobile = false;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        pymChild = new pym.Child({
            renderCallback: render
        });
    } else {
        pymChild = new pym.Child({});
    }

}

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

var fmtYear = d3.format('.0f')

/*
 * Render the graphic.
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
    renderGraphic({
        container: '#graphic',
        width: containerWidth,
        data: DATA
    });

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * Render a graphic.
 */
var renderGraphic = function(config) {
    var aspectWidth = 4;
    var aspectHeight = 20;

    var margins = {
        top: 20,
        right: 15,
        bottom: 10,
        left: 15
    };

    var mayorGap = 00;
    var size = Object.keys(config['data']).length;

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    // var chartHeight = Math.ceil((config['width'] * aspectHeight) / aspectWidth) - margins['top'] - margins['bottom'];
    var chartHeight = 4500;

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    // Create container
    var chartElement = containerElement.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    // Draw here!

    var minYear = d3.min(config['data'], function(d) {
        return +d['start'];
    });

    var maxYear = d3.max(config['data'], function(d) {
        return +d['end'];
    });

    var yScale = d3.scale.linear()
        .domain([minYear, maxYear])
        .range([0, chartHeight]);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(50)
        .tickFormat(function(d) {return fmtYear(d)})
        .outerTickSize(0)
        .innerTickSize(20)

        chartElement.append("g")
            .attr("class", "axis")
            .attr('transform', makeTranslate(chartWidth / 2 + 10, 0))
            .call(yAxis)

    d3.selectAll('g.tick')
        .filter(function(d) {
            removeYears = [1850,1855,1870,1875,1885]
            if (removeYears.indexOf(d) >= 0) {
                return d
            };
        })
        .remove()

    mayorTimelineGroups = chartElement.selectAll('.timeline')
        .data(config['data'])
        .enter()
        .append('g')
        .attr('class', function(d) {return classify(d.fname + " " + d.lname) + " timeline";})
        .attr('transform', function(d, i) {
            if (i == 0) {
                return makeTranslate (chartWidth/2,0)
            }
            else {
                return makeTranslate(chartWidth/2, (yScale(d.start) + (mayorGap)))
            }
        });

        mayorTimelineGroups.append('circle')
        .attr('cx',10)
        .attr('cy',0)
        .attr('r', 10)

        mayorTimelineGroups.append('rect')
        .attr('x', 5)
        .attr('y', 0)
        .attr('height', function(d) {return (yScale(+d.end) - yScale(+d.start) + 5); })
        .attr('width', 10);

    mayorNameGroups = chartElement.selectAll('.names')
        .data(config['data'])
        .enter()
        .append('g')
        .attr()
        .attr('class', function(d, i) {
            if (i % 2) {
                var side = "right";
            }
            else {
                var side = "left";
            }

            return classify(d.fname + " " + d.lname) + " " + side + " names";
        })
        .attr('transform', function(d, i) {
            if (i % 2) {
                var side = 35;
            }
            else {
                var side = -15;
            }

            if (i == 0) {
                return makeTranslate ((chartWidth / 2) + side,5)
            }
            else {
                return makeTranslate((chartWidth / 2) + side, (7 + yScale(d.start) + (mayorGap)))
            }
        });

        d3.select('.arthur-baret.names')
            .attr('transform', function(d) {
                    return makeTranslate(chartWidth/2 - 15, (7 + yScale(d.start) + (mayorGap) - 20))
            });

    mayorNameGroups.append('text')
        .text(function(d) { return d.fname + " " + d.lname;})
        .attr('class', 'name')

    mayorNameGroups.append('text')
        .text(function(d) { return fmtYear(d.start) + "—" + fmtYear(d.end); })
        .attr('dy', 18)
        .attr('class', 'year')





}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
