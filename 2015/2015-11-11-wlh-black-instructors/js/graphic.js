// Global vars
var pymChild = null;
var isMobile = false;

var fmtPct = d3.format('.2%');
function all(d) { return d };
function non_hbcu(d) { return d.hbcu_bool == 'False' };
function mo(d) { return d.state == 'MO' };
function um(d) { return d.school_name == 'Missouri University of Science and Technology' || d.school_name == 'University of Missouri-Columbia' || d.school_name == 'University of Missouri-Kansas City' || d.school_name == 'University of Missouri-St Louis'};


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
        container: '#graphic_1',
        width: containerWidth,
        data: 'data.csv',
        filter: all
    });

    renderGraphic({
        container: '#graphic_2',
        width: containerWidth,
        data: 'data.csv',
        filter: non_hbcu
    });

    renderGraphic({
        container: '#graphic_3',
        width: containerWidth,
        data: 'data.csv',
        filter: mo
    });

    renderGraphic({
        container: '#graphic_4',
        width: containerWidth,
        data: 'data.csv',
        filter: um
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

    var aspectWidth = 15;
    var aspectHeight = 2;

    var margins = {
        top: 0,
        right: 15,
        bottom: 20,
        left: 15
    };

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = 40 - margins['top'] - margins['bottom'];

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    // Create container
    var chartElement = containerElement.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    var x = d3.scale.linear()
        .range([0, chartWidth]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset(function(d) { return (d.staff_black_pct < .5) ? [-10,80] : [-10,-80]; })
      .html(function(d) {
        return "<span style='color:white'>" + d.school_name + " (" + fmtPct(d.staff_black_pct) + ")</span>";
      })

    chartElement.call(tip);

    // Draw here!
    d3.csv(config['data'], function(error, data) {

        data.forEach(function(d) {
            d.staff_black_pct = +d.staff_black_pct;
        });

        x.domain([0,100]);

        chartElement.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", chartWidth)
            .attr("y", -10)
            .style("text-anchor", "end")
            .text("% black instructors");

        chartElement.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .filter(config.filter)
            .attr("class", "dot")
            .attr("r", 5.5)
            .attr("cx", function(d) { return x(d.staff_black_pct * 100); })
            .attr("cy", chartHeight)
            .style("fill", "#f1bb4f")
            .style("opacity", .5)
            .on('mouseover', tip.show)
            .on('click', tip.show)
            .on('mouseout', tip.hide)

    })
}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
