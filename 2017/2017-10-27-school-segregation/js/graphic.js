// Global vars
var pymChild = null;
var isMobile = false;

GRAPHIC_DATA_URL = 'graphic_data_cleaned.csv'
/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        loadCSV(GRAPHIC_DATA_URL);

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
var formatData = function() {
    graphicData.forEach(function(d) {
        d['key'] = d['school_id'];
        d['values'] = [];

        _.each(d, function(v, k) {
            if (_.contains(['school_id', "SCHOOL_NAME", 'school_type', 'key', 'values'], k)) {
                return;
            }
            if (+v > 0) {
                d['values'].push({ 'label': k, 'amt': +v });
            }
            delete d[k];
        });

        delete d['Group'];
        delete d['key']
    });
}

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
        data: graphicData
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
    var aspectHeight = 4;

    var margins = {
        top: 20,
        right: 5,
        bottom: 20,
        left: 20
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

    var y = d3.scale.linear()
            .domain([0,100])
            .range([(chartHeight - margins.top), 0]);

    var yAxis = d3.svg.axis()
        .ticks(10)
        .scale(y)
        .orient("left")
        .tickFormat(function(d){ return d + "%";})
        .tickSize(-chartWidth,0)

    var x = d3.scale.ordinal()
            .domain(["1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"])
            .rangeRoundPoints([0,(chartWidth - margins.left - margins.right)])

    var xAxis = d3.svg.axis()
        .tickValues(function () { return isMobile ? x.domain().filter(function(d, i) { return !(i % 2);}) : x.domain(); })
        .scale(x)
        .orient("top")

    // Draw here!

    chartElement.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margins.left + "," + (margins.top) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "start");

    chartElement.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margins.left + "," + (margins.top + 10) + ")")
        .call(yAxis)

    if (!isMobile) {
    var text = chartElement.append("g")
        .attr("class", "text demographics more")
        .attr("transform",function() { return "translate(" + margins.left + "," + (margins.top + 10) + ")"})
        .append('text')
        .attr("transform",function() { return "rotate(-29," + x(1991) + "," + y(66) + ")"; })
        .attr('x', function(){return x(1991);})
        .attr('y', function(){return y(66);})
        .text('↑ More non-white students than the city')

        var text = chartElement.append("g")
            .attr("class", "text demographics fewer")
            .attr("transform",function() { return "translate(" + margins.left + "," + (margins.top + 10) + ")"})
            .append('text')
            .attr("transform",function() { return "rotate(-29," + x(1991) + "," + y(64) + ")"; })
            .attr('x', function(){return x(1991);})
            .attr('y', function(){return y(64);})
            .text('↓ More white students than the city')

        var text = chartElement.append("g")
            .attr("class", "text demographics more")
            .attr("transform",function() { return "translate(" + margins.left + "," + (margins.top + 10) + ")"})
            .append('text')
            .attr('x', function(){return x(1991);})
            .attr('y', function(){return y(50);})
            .attr('dy', -2)
            .text('↑ More non-white students than white students')

        var text = chartElement.append("g")
            .attr("class", "text demographics fewer")
            .attr("transform",function() { return "translate(" + margins.left + "," + (margins.top + 10) + ")"})
            .append('text')
            .attr('x', function(){return x(1991);})
            .attr('y', function(){return y(50);})
            .attr('dy', 12)
            .text('↓ More white students than non-white students')
        }

    chartElement.append("g")
        .attr("class", "y axis label")
        .append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(-10," + (chartHeight / 2) + ")rotate(-90)")
            .text("Percent non-white students")


    var line = d3.svg.line()
        .interpolate('monotone')
        .x(function(d) {
            return x(d.label);
        })
        .y(function(d) {
            return y(d.amt);
        });

    var demographics = chartElement.append("g")
        .attr("class", "demographics city")
        .attr("transform",function() { return "translate(" + margins.left + "," + (margins.top + 10) + ")"})
        .append('path')
        .attr('d', line([{"label":"1991","amt":65.37247382},{"label":"2000", "amt": 73.02564415},{"label": "2005", "amt": 68.7717877390048},{"label": "2010", "amt": 77.52931272},{"label": "2015", "amt": 73.86493432}]))
        .attr('stroke', "#666")
        .attr('fill', 'none')

    // var charters = chartElement.append("g")
    //     .attr("class", "demographics charter")
    //     .append('path')
    //     .attr('d', line([{"label":"2001","amt":89.51902369},{"label":"2002","amt":86.05015674},{"label":"2003","amt":84.43860801},{"label":"2004","amt":86.32478632},{"label":"2005","amt":87.80262855},{"label":"2006","amt":88.30305716},{"label":"2007","amt":88.08510638},{"label":"2008","amt":92.01969167},{"label":"2009","amt":92.4592317},{"label":"2010","amt":92.32954545},{"label":"2011","amt":88.25184323},{"label":"2012","amt":87.84964264},{"label":"2013","amt":79.43658624},{"label":"2014","amt":77.66027039},{"label":"2015","amt":77.11314733},{"label":"2016","amt":78.52119193},{"label":"2017","amt":79.03269879}]))
    //     .attr('stroke', '#f1bb4f')
    //     .attr('fill', "none")
    //
    // var public = chartElement.append("g")
    //     .attr("class", "demographics public")
    //     .append('path')
    //     .attr('d', line([{"label":"1991","amt":79.62015326},{"label":"1992","amt":80.01502831},{"label":"1993","amt":80.75847653},{"label":"1994","amt":81.31603438},{"label":"1995","amt":81.75955392},{"label":"1996","amt":82.1303414},{"label":"1997","amt":81.94266496},{"label":"1998","amt":81.96094867},{"label":"1999","amt":83.16670016},{"label":"2000","amt":83.08106883},{"label":"2001","amt":82.21797804},{"label":"2002","amt":83.07429871},{"label":"2003","amt":83.60539583},{"label":"2004","amt":83.81004714},{"label":"2005","amt":84.90637652},{"label":"2006","amt":87.20820083},{"label":"2007","amt":86.59700301},{"label":"2008","amt":88.96165485},{"label":"2009","amt":87.4845559},{"label":"2010","amt":88.25133997},{"label":"2011","amt":86.06599201},{"label":"2012","amt":85.78675685},{"label":"2013","amt":87.8286582},{"label":"2014","amt":88.32464752},{"label":"2015","amt":88.25174241},{"label":"2016","amt":87.94632907},{"label":"2017","amt":86.81881051}]))
    //     .attr('stroke', '#358fb3')
    //     .attr('fill', "none")

    // var enrollment = chartElement.append("g")
    //     .attr("class", "demographics enrolled")
    //     .attr("transform",function() { return "translate(" + margins.left + "," + (margins.top + 10) + ")"})
    //     .append('path')
    //     .attr('d', line([    {"label":"1991","amt":79.62015326},{"label":"1992","amt":80.01502831},{"label":"1993","amt":80.75847653},{"label":"1994","amt":81.31603438},{"label":"1995","amt":81.75955392},{"label":"1996","amt":82.1303414},{"label":"1997","amt":81.94266496},{"label":"1998","amt":81.96094867},{"label":"1999","amt":83.16670016},{"label":"2000","amt":83.08106883},{"label":"2001","amt":82.46491526},{"label":"2002","amt":83.22092365},{"label":"2003","amt":83.66925845},{"label":"2004","amt":84.0487907},{"label":"2005","amt":85.25575056},{"label":"2006","amt":87.35325194},{"label":"2007","amt":86.84098768},{"label":"2008","amt":89.75217683},{"label":"2009","amt":88.9512746},{"label":"2010","amt":89.52631579},{"label":"2011","amt":86.73209957},{"label":"2012","amt":86.47833161},{"label":"2013","amt":85.71727623},{"label":"2014","amt":85.44141489},{"label":"2015","amt":85.03890242},{"label":"2016","amt":84.88221667},{"label":"2017","amt":84.20214883}]))
    //     .attr('stroke', '#449970')
    //     .attr('stroke-width', 2)
    //     .attr('fill', "none")


    d3.csv(config['data'], function(error, data) {
        var school = chartElement.selectAll("g")
            .data(config['data'])
            .enter()
            .append("g")
            .attr("class", function(d){ return "school " + d.school_type; })
            .attr("transform", function(d){
                if (d.school_type == "slps") {
                    offset = isMobile ? -1.5 : -3.5
                }
                else {
                    offset = isMobile ? 1.5 : 3.5
                }
                return "translate(" + (margins.left + offset) + "," + (margins.top + 10) + ")"
            })

        school.selectAll(".dot")
            .data(function(d) { return d['values']; })
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", function(){ return isMobile ? 1.5 : 3})
            .attr("cx", function(d) { return x(d.label) })
            .attr("cy", function(d) { return y(d.amt) })

    })
}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
