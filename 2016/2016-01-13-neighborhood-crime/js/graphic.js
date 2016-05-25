// Global vars
var pymChild = null;
var isMobile = false;
var DEFAULT_WIDTH = 500

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

var color_code = [colors.ltblue, colors.tan, colors.dkgreen, colors.brown, colors.pink, colors.tangerine, colors.orange, colors.red]

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
        data: []
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
    var aspectHeight = 10;

    var margins = {
        top: 0,
        right: 15,
        bottom: 20,
        left: 15
    };

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = Math.ceil((config['width'] * aspectHeight) / aspectWidth) - margins['top'] - margins['bottom'];

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    // Create container
    var chartElement = containerElement.append('div')
        .attr('id', 'chart')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    // Draw here!
    var dispatch = d3.dispatch("load", "statechange");
    var numberFormat = d3.format(",.0");
    var decimalFormat = d3.format(",.2f")
    var crimes = [
    "Homicide",
    "Rape",
    "Robbery",
    "Agg. Assault",
    "Burglary",
    "Larceny",
    "Auto Theft",
    "Arson",
    ];



var points = ["points"];

d3.csv("2015_data.csv", type, function(error, crimes) {
    if (error) throw error;
    var neighborhoodByName = d3.map();
    crimes.forEach(function(d) { neighborhoodByName.set(d.neighborhood, d); });
    dispatch.load(neighborhoodByName);
    dispatch.statechange(neighborhoodByName.get("Academy"));
    pymChild.sendHeight()

});

dispatch.on("load.menu", function(neighborhoodByName) {
    var select = d3.select('#chart')
    .append("div")
    .append("select")
    .on("change", function() { dispatch.statechange(neighborhoodByName.get(this.value)); });

    select.selectAll("option")
    .data(neighborhoodByName.values())
    .enter().append("option")
    .attr("value", function(d) { return d.neighborhood; })
    .text(function(d) { return d.neighborhood; });

    dispatch.on("statechange.menu", function(neighborhood) {
        select.property("value", neighborhood.neighborhood);
    });
});

dispatch.on("load.bar", function(neighborhoodByName) {
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 100 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

    var y = d3.scale.linear()
    .domain([0, d3.max(neighborhoodByName.values(), function(d) { return d.total; })])
    .rangeRound([height, 0])
    .nice();

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(numberFormat);

    var svg = d3.select('#chart').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

    svg.append("text")
    .attr("transform", "translate(38, 410) rotate(90)")
    .attr("text-anchor", "end")
    .attr("id", "axis-id")
    .text("Total crimes");


    var rect = svg.append("rect")
    .attr("x", 0)
    .attr("width", width)
    .attr("y", height)
    .attr("height", 0)
    .style("fill", "#aaa");

    svg.append("text")
    .attr("x", 15)
    .attr("id", "totalcrime")
    .attr("text-anchor", "middle")
    .text("function(d) { return d.total; }");


    dispatch.on("statechange.bar", function(d) {
        rect.transition()
        .attr("y", y(d.total))
        .attr("height", y(0) - y(d.total));

        d3.select("#totalcrime")
            .transition()
            .attr("y", y(d.total) - 5)
            .text(numberFormat(d.total));




    });



});

dispatch.on("load.pie", function(neighborhoodByName) {
  var width = 450,
      height = 450,
      radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
      .domain(crimes)
      .range(color_code);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 40);

  var pie = d3.layout.pie()
      .sort(null);

  var svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "piechart")
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var path = svg.selectAll("path")
      .data(crimes)
    .enter().append("path")
      .style("fill", color)
      .each(function() { this._current = {startAngle: 0, endAngle: 0}; });

  dispatch.on("statechange.pie", function(d) {
    path.data(pie.value(function(g) { return d[g]; })(crimes)).transition()
        .attrTween("d", function(d) {
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
            return arc(interpolate(t));

          };

        });

  });
});

dispatch.on("load.map", function(neighborhoodByName) {

      var color = d3.scale.ordinal()
          .domain(crimes)
          .range(color_code);

    var stlmap = d3.select(".piechart")
        .append("g")
        .attr("x", "0")
        .attr("y", "20")
        .selectAll("polygon")
    .data(neighborhoodByName.values())
        .enter()
    .append("polygon")
        .attr("points", function(d) { return d.points; })
        .attr("stroke", "#666")
    .attr("id", function(d) {return d.neighborhood.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ''); })
    .attr("fill", "#eee");

    stlmap
    .attr("transform", "translate(45, 45), scale(.32)");

    var legend = d3.select(".piechart")
    .selectAll("rect")
    .data(crimes);

    legend.enter().append("rect")
    .attr("width", "40")
    .attr("height", "30")
    .attr("x", "220")
    .attr("y", function(d, i) { return 60 + i * 33; })
    .style("fill", color);

    d3.select(".piechart").selectAll("text")
    .data(crimes)
    .enter()
    .append("text")
    .attr("x", "265")
    .attr("y", function(d, i) { return 80 + i * 33; })
    .attr("class", "crimeslist")
    .text(function(d) {return d;});

    var crimebreakdown = d3.select(".piechart").append("g")
    .selectAll("text")
    .data(crimes)
    .enter()
    .append("text")
    .attr("class", "crimebreakdown");

    dispatch.on("statechange.map", function(d) {

        var selection = d.neighborhood.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '');

        d3.select(".piechart").selectAll("polygon")
        .attr("fill", "#eee");

        d3.select("#" + selection)
        .attr("fill", colors.yellow);

        var number = function(g) { return d[g]; }


        crimebreakdown
        .transition().attr("x", "240")
        .attr("y", function(d, i) { return 80 + i * 33; })
        .attr("text-anchor", "middle")
        .text(number);
    });
});

dispatch.on("load.list", function(neighborhoodByName) {

    var summarydiv = d3.select("#chart").append("div")
    .attr("width", "550")
    .attr("id", "summarydiv");

    var summary = summarydiv
    .append("p")
    .attr("class", "summary");

    dispatch.on("statechange.list", function(d) {

        var perThousand = 1000 / d.pop_2010;

        summarydiv.select(".summary")
        .html("<span class=\"emphasis\">" + d.neighborhood + "</span> neighborhood's <span class=\"emphasis\">" + d.total + "</span> total crimes in 2015 were about <span class=\"emphasis\">"
         + decimalFormat(d.total * perThousand) + " crimes per 1,000 people</span> (as of the 2010 census).");


    });
});

function type(d) {
    d.total = +d.total;
    return d;
}

}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
