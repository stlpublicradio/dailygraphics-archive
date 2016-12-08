// Global vars
var pymChild = null;
var isMobile = false;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        pymChild = new pym.Child({
            renderCallback: render,
            polling:500
        });
    } else {
        pymChild = new pym.Child({polling:500});
    }

    // pymChild.onMessage('on-screen', function(bucket) {
    //     ANALYTICS.trackEvent('on-screen', bucket);
    // });
    // pymChild.onMessage('scroll-depth', function(data) {
    //     data = JSON.parse(data);
    //     ANALYTICS.trackEvent('scroll-depth', data.percent, data.seconds);
    // });
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
        data: DATA,
        candidates: CANDIDATES
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

    d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

    var results = config.data;
    var aspectWidth = 4;
    var aspectHeight = isMobile ? 5 : 4;

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
    var textElement = containerElement.append('div')
            .attr('class','text-results')

        textElement.append('h2')

        textElement.append("div")
            .append("ul")
            .attr("class","list")



    var chartElement = containerElement.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');


    var defs = chartElement.append("defs");
    var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient")

    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")

    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#cc203b")

    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#449970")

    var arrowhead = defs.append("marker")
        .attr("id", "arrow")

        arrowhead
            .attr("markerWidth", "10")
            .attr("markerHeight", "10")
            .attr("refX", "0")
            .attr("refY", "3")
            .attr("orient", "auto")
            .attr("markerUnits", "strokeWidth")

        arrowhead.append("path")
            .attr("d", "M0,0 L0,6 L9,3 z")
            .attr("fill", "#333")

    // Draw here!
        d3.json("mocountieskc.json", function(error, geodata) {

            var regions = topojson.feature(geodata, geodata.objects.mocountieskc);

            for (var i = 0; i < results.length; i++) {
                var dataCountyFP = results[i].countyfp;

                var stuff = {};
                var total = 0;

                for (var k = 0; k < d3.entries(config.candidates).length; k++) {
                    party = d3.entries(config.candidates)[k]["key"]
                    stuff[party] = +results[i][party]
                    total += +results[i][party]
                }

                for (var j = 0; j < regions.features.length; j++) {
                    var mapCountyFP = regions.features[j].properties.COUNTYFP;
                    if (mapCountyFP == dataCountyFP) {
                        regions.features[j].properties.yes = stuff["yes"];
                        regions.features[j].properties.no = stuff["no"];
                        regions.features[j].properties.total = total;
                        regions.features[j].properties.r_pct = stuff["yes"] / total;
                        regions.features[j].properties.d_pct = stuff["no"] / total;
                        regions.features[j].properties.r_lead = (stuff["yes"] / total) - (stuff["no"] / total);
                    }
                }
                console.log(regions)
            }

            var projection = d3.geoAlbers()
                .parallels([40,45])
                .center([4,38])
                .fitExtent([[0,0],[chartWidth, chartHeight - (isMobile ? 100: 70)]], regions)
            var path = d3.geo.path()
                .projection(projection)

// Function computes extents of range

            var getLeadCap = function(data) {
                var max = 0, x;
                for (x in data) {
                    if (Math.abs(data[x].properties.r_lead) > max) max = Math.abs(data[x].properties.r_lead);
                }
                cap = Math.ceil(max*10)*10;
                return [(cap*-1),cap]
            }

// Function computes max votes in a county

            var getMaxVotes = function(data) {
                var max = 0, x;
                for (x in data) {
                    if (data[x].properties.total > max) max = data[x].properties.total;
                }
                return max;
            }

// Set up color scale
            var color = d3.scale.linear()
                .domain(getLeadCap(regions.features))
                .interpolate(d3.interpolateRgb)
                .range([d3.rgb("#cc203b"),d3.rgb("#449970")])

// Creates text

        var MakeText = function(row) {

            var data = {};
            var total = 0;

                for (var i = 0; i < d3.entries(config.candidates).length; i++) {
                    total += +results[row][d3.entries(config.candidates)[i]["key"]];
                }

                textElement.select("h2")
                    .html(results[row]["name"] + '<span>Total votes counted: ' + fmtComma(total))

                for (var i = 0; i < d3.entries(config.candidates).length; i++) {

                    (total == 0) ? cand_pct = 0 : cand_pct =  +results[row][d3.entries(config.candidates)[i]["key"]] / total

                    data[d3.entries(config.candidates)[i]["key"]] = {"candidates": d3.entries(config.candidates)[i]["value"], "pct": cand_pct, "total": +results[row][d3.entries(config.candidates)[i]["key"]] };
                }

                var list = textElement.select("ul")

                var listItems = list.selectAll("li")

                var updateSelection = listItems.data(d3.entries(data));

                updateSelection
                .enter().append("li")

                updateSelection
                .attr("class", function(d) { return d["key"]; })
                .html(function(d) { return d["value"]["candidates"] + ": <span class='pct'>" + fmtPct(d["value"]["pct"]) + "</span> <span class='votes'>(" + fmtComma(d["value"]["total"]) + ")</span>"; })

            }

        MakeText(results.length - 1)


// Creates map
            chartElement.selectAll(".county")
                .data(regions.features)
                .enter().append("path")
                .attr("class", function(d) { return "county county-" + d.properties.COUNTYFP;})
                .attr("stroke", "#333")
                .attr("stroke-opacity", ".1")
                .attr("stroke-width", "1")
                .attr("fill", function(d) {
                    if (d.properties.r_lead) {
                        return color(d.properties.r_lead * 100)
                    }
                    else {
                        return '#ddd'
                    }
                })
                .attr("d", path)
                .on("mouseover", function(d) {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i]["name"] == d.properties.NAMELSAD) {
                            MakeText(i)
                        }
                    }
                    d3.selectAll('.county-line')
                        .classed("normal", false)
                        .classed("fade", true)
                    countyClass = ".county-" + d.properties.COUNTYFP
                    d3.selectAll(countyClass)
                        .classed("fade", false)
                        .classed("normal", false)
                        .classed("highlighted", true)
                        .moveToFront()
                })
                .on("mouseout", function(d) {
                    countyClass = ".county-" + d.properties.COUNTYFP
                    d3.selectAll(".county-line")
                        .classed("fade", false)
                        .classed("normal", true)
                    d3.selectAll(countyClass)
                        .classed("normal", true)
                        .classed("highlighted", false)
                })

// Creates distribution

            var xScale = d3.scale.linear()
                .domain(getLeadCap(regions.features))
                .range([0, chartWidth - 40])

            var distHeight = 50;

            var yScale = d3.scale.linear()
                .domain([0, getMaxVotes(regions.features)])
                .range([0, distHeight])


            distributionContain = chartElement.append("g")
                .attr('transform','translate(0,' + (chartHeight - (isMobile ? 45 : 35)) + ')')

            distribution = distributionContain.append("g")
                .attr('transform','translate(40,-' + (distHeight + 2) + ')')


            distribution.selectAll("line")
                .data(regions.features)
                .enter().append("line")
                .attr("class", function(d) { return "county-line county-" + d.properties.COUNTYFP;})
                .attr("x1", function(d) {
                    if (d.properties.r_lead) {
                        return xScale(d.properties.r_lead*100)
                    }
                })
                .attr("x2", function(d) {
                    if (d.properties.r_lead) {
                        return xScale(d.properties.r_lead*100)
                    }
                })
                .attr("y1", function(d) {
                    return (distHeight - yScale(d.properties.total))
                })
                .attr("y2", distHeight)
                .attr("stroke", function(d) {
                    return color(d.properties.r_lead * 100)
                })
                .attr("stroke-width", isMobile ? 3 : 5)
                .on("mouseover", function(d) {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i]["name"] == d.properties.NAMELSAD) {
                            MakeText(i)
                        }
                    }
                    d3.selectAll('.county-line')
                        .classed("normal", false)
                        .classed("fade", true)
                    countyClass = ".county-" + d.properties.COUNTYFP
                    d3.selectAll(countyClass)
                        .classed("fade", false)
                        .classed("normal", false)
                        .classed("highlighted", true)
                        .moveToFront()
                })
                .on("mouseout", function(d) {
                    countyClass = ".county-" + d.properties.COUNTYFP
                    d3.selectAll(".county-line")
                        .classed("fade", false)
                        .classed("normal", true)
                    d3.selectAll(countyClass)
                        .classed("normal", true)
                        .classed("highlighted", false)
                })

            distribution.selectAll(".county-triangle")
                .data(regions.features)
                .enter().append("path")
                .attr("d", d3.svg.symbol()
                            .type("triangle-down").size(20))
                .attr("transform", function(d){
                    return "translate(" + xScale(d.properties.r_lead * 100) + "," + (distHeight - yScale(d.properties.total) - 7) + ")"
                })
                .attr("class", function(d) { return "hidden county-triangle county-" + d.properties.COUNTYFP;})


// Create key
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(isMobile ? 6 : 12)
                .tickFormat(function(d) {
                    return Math.abs(d) + '%'
                })

            distributionContain.append("g")
                .attr('transform','translate(40,0)')
                .call(xAxis)

            d3.select(".domain")
                .attr("fill", 'url(#linear-gradient)')

// Create x-axis legend
            xLegendText = distributionContain.append("g")
                .attr('transform','translate(40,' + (isMobile ? '45' : '35') + ')')

            xLegendText.append("line")
                .attr("class", "legend-line")
                .attr("x1", function() { return xScale(-15); })
                .attr("x2", function() { return xScale(-40); })
                .attr("y1", 0)
                .attr("y2", 0)
                .attr("marker-end", "url(#arrow)")

            xLegendText.append("line")
                .attr("class", "legend-line")
                .attr("x1", function() { return xScale(15); })
                .attr("x2", function() { return xScale(40); })
                .attr("y1", 0)
                .attr("y2", 0)
                .attr("marker-end", "url(#arrow)")

            xLegendText.append("text")
                .text("No")
                .attr("x", function() { return xScale(-15) })
                .attr("y", 17)
                .attr("text-anchor", "end")

            xLegendText.append("text")
                .text("Yes")
                .attr("x", function() { return xScale(15) })
                .attr("y", 17)
                .attr("text-anchor", "beginning")

            xLegendText.append("text")
                .text("Margin of victory")
                .attr("x", function() { return xScale(0) })
                .attr("y", isMobile ? -9 : 0)
                .attr("dy", ".2em")
                .attr("text-anchor", "middle")

// Create y-axis legend
            yLegendText = distributionContain.append("g")
                .attr('transform','translate(0,-40)')

            yLegendText.append("line")
                .attr("class", "legend-line")
                .attr("x1", 20)
                .attr("x2", 20)
                .attr("y1", 40)
                .attr("y2", 0)
                .attr("marker-end", "url(#arrow)")

            yLegendText.append("text")
                .text("Number of votes")
                .attr("transform", "rotate(270)")
                .attr("x", -40)
                .attr("y", 5)
                .attr("text-anchor", "beginning")



    })
}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
