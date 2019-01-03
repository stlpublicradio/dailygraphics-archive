// Global vars
var pymChild = null;
var isMobile = false;

d3.selection.prototype.moveToFront = function() {  
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };
  d3.selection.prototype.moveToBack = function() {  
      return this.each(function() { 
          var firstChild = this.parentNode.firstChild; 
          if (firstChild) { 
              this.parentNode.insertBefore(this, firstChild); 
          } 
      });
  };

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function () {
    if (Modernizr.svg) {
        pymChild = new pym.Child({
            renderCallback: render
        });
    } else {
        pymChild = new pym.Child({});
    }

}

var colors = {
    'brown': '#6b6256',
    'tan': '#a5a585',
    'ltgreen': '#70a99a',
    'green': '#449970',
    'dkgreen': '#31716e',
    'ltblue': '#55b7d9',
    'blue': '#358fb3',
    'dkblue': '#006c8e',
    'yellow': '#f1bb4f',
    'orange': '#f6883e',
    'tangerine': '#e8604d',
    'red': '#cc203b',
    'pink': '#c72068',
    'maroon': '#8c1b52',
    'purple': '#571751'
};

/*
 * Render the graphic.
 */
var render = function (containerWidth) {
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
var renderGraphic = function (config) {
    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
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
        .attr('class', 'text-results')

    textElement.append('h2')

    textElement.append("div")
        .append("ul")
        .attr("class", "list")



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
        .attr("stop-color", "#006c8e")

    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#cc203b")

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
    d3.json("congress.topojson", function (error, geodata) {

        var regions = topojson.feature(geodata, geodata.objects.congress);

        d3.csv("assets/cleaned_results.csv", function (d) {
                return {
                    slug: d.slug,
                    race: d.race,
                    candidate: d.candidate,
                    party: d.party,
                    votes: +d.votes.replace(/,/g, ''),
                    race_total_votes: +d.race_total_votes.replace(/,/g, '')
                };
            },
            function (data) {
                // filter races to congress
                results = data.filter(function (d) {
                    race = d.slug.split('-')

                    return race[0] + '-' + race[1] + '-' + race[2] == 'u-s-representative'
                })


                // format data
                results = d3.nest()
                    .key(function (d) {
                        return d.slug;
                    })
                    .map(results);


                // add winner

                for (var i in results) {

                    leader_total = 0

                    for (var j = 0; j < results[i].length; j++) {
                        if (+results[i][j].votes > leader_total) {
                            leader_total = results[i][j].votes
                        }
                    }

                    for (var j = 0; j < results[i].length; j++) {
                        if (results[i][j].votes == leader_total) {
                            results[i][j]['winner'] = true;
                        } else {
                            results[i][j]['winner'] = false;
                        }
                    }

                };


                var demToRep = textures.lines()
                    .heavier()
                    .stroke('#cc203b')

                var repToDem = textures.lines()
                    .heavier()
                    .stroke('#006c8e')

                var projection = d3.geoAlbers()
                    .parallels([36, 40])
                    .center([4, 38])
                    .fitExtent([
                        [0, 0],
                        [chartWidth, chartHeight - (isMobile ? 100 : 70)]
                    ], regions)
                var path = d3.geo.path()
                    .projection(projection)


                // Create initial text

                winners = {}

                for (var i in results) {

                    for (var j = 0; j < results[i].length; j++) {
                        if (results[i][j].winner == true) {

                            winners[results[i][j].slug] = {};


                            winners[results[i][j].slug]['candidate'] = results[i][j]['candidate']

                            winners[results[i][j].slug]['race'] = results[i][j]['race']

                            winners[results[i][j].slug]['party'] = results[i][j]['party']

                            winners[results[i][j].slug]['votes'] = results[i][j]['votes']

                            winners[results[i][j].slug]['race_total_votes'] = results[i][j]['race_total_votes']

                            winners[results[i][j].slug]['pct'] = results[i][j]['votes'] / results[i][j]['race_total_votes']
                        }
                    }

                }

                createText = function (candidates, district) {
                    console.log(candidates)
                    data = []
                    if (!district) {

                        textElement.select("h2")
                            .html('Statewide winners')

                        for (var i in candidates) {
                            data.push(candidates[i])
                        }

                        var list = textElement.select('ul')
                        var listItems = list.selectAll('li')
                        var updateSelection = listItems.data(d3.entries(data));

                        updateSelection.enter().append("li")

                        updateSelection
                            .attr("class", function (d) {
                                if (d.value.party == 'Democratic') {
                                    party = 'dem'
                                }
                                else if (d.value.party == 'Republican') {
                                    party = 'rep'
                                }
                                else {
                                    party = 'ind'
                                }
                                return classify(d.value.race) + ' ' + party;
                            })
                            .html(function (d) {
                                district = d.value.race.split(" - ")[1]

                                return '<span class="district">' + district + ': </span><span class="candidate">' + d.value.candidate + '</span>';
                            })

                    } else {
                        textElement.select("h2")
                            .html('District ' + district + '<span>Total votes counted: ' + fmtComma(candidates[0].race_total_votes))

                        for (var i in candidates) {
                            data.push(candidates[i])
                        }

                        var list = textElement.select('ul')
                        var listItems = list.selectAll('li')
                        var updateSelection = listItems.data(d3.entries(data));


                        updateSelection.enter().append("li")

                        updateSelection
                        .attr("class", function (d) {
                            if (d.value.party == 'Democratic') {
                                party = 'dem'
                            }
                            else if (d.value.party == 'Republican') {
                                party = 'rep'
                            }
                            else {
                                party = 'ind'
                            }
                            return classify(d.value.race) + ' ' + party + ' ' + (d.value.winner ? 'winner' : '');
                        })
                            .html(function (d) {
                                district = d.value.race.split(" - ")[1]

                                return '<span class="candidate">' + d.value.candidate + ':</span> <span class="pct">' + fmtPct((d.value.votes / d.value.race_total_votes)*100) + '%</span><br/><span class="votes">(' + fmtComma(d.value.votes) + ')</span>';
                            })

                        updateSelection.exit().remove()

                    }
                }

                createText(winners)


                // Creates map
                chartElement.call(demToRep)
                chartElement.call(repToDem)

                getColor = function (district) {
                    current = {
                        '01': 'Democratic',
                        '02': 'Republican',
                        '03': 'Republican',
                        '04': 'Republican',
                        '05': 'Democratic',
                        '06': 'Republican',
                        '07': 'Republican',
                        '08': 'Republican'
                    }

                    key = 'u-s-representative-district-' + district.replace(/0/, '');

                    for (var i = 0; i < results[key].length; i++) {
                        if (results[key][i].winner) {
                            winner = results[key][i].party
                        }
                    }

                    if (current[district] == 'Democratic') {
                        if (winner == 'Democratic') {
                            return '#358fb3'
                        } else {
                            return demToRep.url()
                        }
                    } else {
                        if (winner == 'Republican') {
                            return '#cc203b'
                        } else {
                            return repToDem.url()
                        }
                    }
                }

                chartElement.selectAll(".district")
                    .data(regions.features)
                    .enter().append("path")
                    .attr("class", function (d) {
                        return "district district-" + d.properties.CD115FP;
                    })

                    .style('fill', function (d) {

                        return getColor(d.properties.CD115FP)

                    })
                    .attr("d", path)
                    .on("mouseover", function (d) {
                        // districtClass = '.district-' + d.properties.CD115FP
                        
                        // d3.selectAll(districtClass)
                        d3.select(this).classed("selected", true).moveToFront();

                        district = +d.properties.CD115FP
                        race = 'u-s-representative-district-' + district

                        createText(results[race], district)
                    })
                    .on("mouseout", function(d) {
                        // districtClass = 'district-' + d.properties.CD115FP
                        // d3.select(districtClass)
                        
                        d3.select(this).classed("selected", false);
                        
                        createText(winners)
                    })

                d3.selectAll('.county-line')
                    .classed("normal", false)
                    .classed("fade", true)

            })
    })
}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;