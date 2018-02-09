// Global vars
var pymChild = null;
var isMobile = false;

var fmtPct = d3.format(",.2%");

var LABEL_DEFAULTS = {
    'text-anchor': 'start',
    'dx': '5',
    'dy': '4'
}
var WARD_LABEL_ADJUSTMENTS = {
    '1': { 'text-anchor': 'middle', 'dx': -3, 'dy': -5},
    '3': { 'text-anchor': 'end', 'dx': -10, 'dy': 5},
    '4': { 'dx': 0, 'dy': -2},
    '5': { 'text-anchor': 'middle', 'dx': -5, 'dy': 15},
    '19': { 'text-anchor': 'middle', 'dx': 0, 'dy': 15},
    '21': { 'dx': 0, 'dy': -2},
    '22': { 'text-anchor': 'end', 'dx': -10, 'dy': -2},
    '25': { 'text-anchor': 'middle', 'dx': -3, 'dy': -5},
    '27': { 'text-anchor': 'middle', 'dx': 0, 'dy': 15}
}

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

var formatData = function() {
    DATA.forEach(function(d) {
        d['turnout'] = +d['turnout'];
        d['support'] = +d['support'];
    });
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
    var aspectHeight = 3;

    var margins = {
        top: 0,
        right: 10,
        bottom: 40,
        left: 50
    };

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = Math.ceil((config['width'] * aspectHeight) / aspectWidth) - margins['top'] - margins['bottom'];

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
    var roundTicksFactor = .05;
    var ticksX = 10;
    var ticksY = 10;

    var min = 0;
    var max_turnout = d3.max(config['data'], function(d) {
        return Math.ceil(d['turnout']/roundTicksFactor) * roundTicksFactor;
    });
    var max_support = d3.max(config['data'], function(d) {
        return Math.ceil(d['support']/roundTicksFactor) * roundTicksFactor;
    });

    var xScale = d3.scale.linear()
        .domain([min,max_turnout])
        .range([0,chartWidth]);

    var yScale = d3.scale.linear()
        .domain([min,max_support])
        .range([chartHeight, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(ticksX)
        .tickFormat(function(d) {
            return d*100 + '%';
        })

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(ticksY)
        .tickFormat(function(d) {
            return d*100 + '%';
        })

    chartElement.append('g')
        .attr('class','x axis')
        .call(xAxis)
        .attr('transform', function() {
            return makeTranslate(0, chartHeight);
        })

    chartElement.append('g')
        .attr('class','y axis')
        .call(yAxis);

    var xAxisGrid = function() {
        return xAxis;
    };

    chartElement.append('g')
        .attr('class', 'x grid')
        .call(xAxisGrid()
            .tickSize(chartHeight, 0, 0)
            .tickFormat('')
        );

    var yAxisGrid = function() {
        return yAxis;
    };

    chartElement.append('g')
        .attr('class', 'y grid')
        .call(yAxisGrid()
            .tickSize(-chartWidth, 0, 0)
            .tickFormat('')
        );

    /*
     * Render data
     */

     var wards = chartElement.append('g')
        .attr('class','data')
        .selectAll('g')
        .data(config.data)
        .enter()
        .append('g')
        .attr('class', function(d) {
            return 'ward ward-' + d.ward
        })
        .attr('transform',function(d){
            return makeTranslate(xScale(d.turnout),yScale(d.support))
        })
        .append('circle')
        .attr('cy', 0)
        .attr('cx', 0)
        .attr('r', 3)

    var positionLabel = function(adjustments, id, attribute) {
        if (adjustments[id]) {
            if (adjustments[id][attribute]) {
                return adjustments[id][attribute];
            } else {
                return LABEL_DEFAULTS[attribute];
            }
        } else {
            return LABEL_DEFAULTS[attribute];
        }
    }

    var ward_labels = chartElement.selectAll('.ward')
        .append('text')
        .attr('class','ward-label')
        .text(function(d) { return d.ward})
        .attr('style', function(d) {
            return 'text-anchor: ' + positionLabel(WARD_LABEL_ADJUSTMENTS, d.ward, 'text-anchor');
        })
        .attr('dx', function(d) {
            return positionLabel(WARD_LABEL_ADJUSTMENTS, d.ward, 'dx');
        })
        .attr('dy', function(d) {
            return positionLabel(WARD_LABEL_ADJUSTMENTS, d.ward, 'dy');
        })

    chartElement.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('dy', 12)
        .attr('transform', function() {
            return makeTranslate(-margins.left, chartHeight / 2) + 'rotate(-90)'
        })
        .text('Percent support for Prop P')

    chartElement.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', 'middle')
        .attr('transform', function() {
            return makeTranslate(chartWidth / 2, chartHeight + (.8 * margins.bottom))
        })
        .text('Percent turnout')




};

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
