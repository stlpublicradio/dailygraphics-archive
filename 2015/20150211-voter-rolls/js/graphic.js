// global vars
var $graphic = null;
var pymChild = null;

var GRAPHIC_DATA_URL = 'voter-rolls.csv';
var GRAPHIC_DEFAULT_WIDTH = 600;
var MOBILE_THRESHOLD = 540;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};
var graphicData = null;
var isMobile = false;

// D3 formatters
var fmtComma = d3.format(',');
var fmtPct = d3.format(".1%")
var fmtYearAbbrev = d3.time.format('%y');
var fmtYearFull = d3.time.format('%Y');


/*
 * INITIALIZE
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        $graphic = $('#graphic');

        d3.csv(GRAPHIC_DATA_URL, function(error, data) {
            graphicData = data.map ( function (d) {
            	var r = {
            		label: d['county'],
					old_voters: parseFloat(d['registered_2004']),
					old_vap: parseFloat(d['vap_2004']),
					new_voters: parseFloat(d['registered_2015']),
					new_vap: parseFloat(d['vap_2013'])
            	};
				return r;
            }),
			
			values = graphicData
				.map( function(d) { return d.old_voters; })
				.filter( function (d) { return d; })
				.concat( graphicData.map( function(d) { return d.new_voters; }).filter( function (d) { return d; }))
				.concat( graphicData.map( function(d) { return d.old_vap; }).filter( function (d) { return d; }))
				.concat( graphicData.map( function(d) { return d.new_vap; }).filter( function (d) { return d; }))
			.sort(d3.descending);
				
            // graphicData.forEach(function(d) {
            //     d['date'] = d3.time.format('%m/%d/%y').parse(d['date']);
            // });

            pymChild = new pym.Child({
                renderCallback: render
            });
        });
    } else {
        pymChild = new pym.Child({ });
    }
}


/*
 * RENDER THE GRAPHIC
 */
var render = function(containerWidth) {
    // fallback if page is loaded outside of an iframe
    if (!containerWidth) {
        containerWidth = GRAPHIC_DEFAULT_WIDTH;
    }

    // check the container width; set mobile flag if applicable
    if (containerWidth <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    // clear out existing graphics
    $graphic.empty();

    // draw the new graphic
    // (this is a separate function in case I want to be able to draw multiple charts later.)
    drawGraph(containerWidth);

    // update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}


/*
 * DRAW THE GRAPH
 */
var drawGraph = function(graphicWidth) {
    var aspectHeight;
    var aspectWidth;
    var graph = d3.select('#graphic');
var color = d3.scale.ordinal()
    .range([ colors['red'], colors['yellow'], colors['blue'], colors['green'], colors['tangerine'] ]);
    var margin = {
    	top: 50,
    	right: 15,
    	bottom: 30,
    	left: 5
    };

    // params that depend on the container width
    if (isMobile) {
        aspectWidth = 4;
        aspectHeight = 12;
    } else {
        aspectWidth = 16;
        aspectHeight = 48;
    }
	
    // define chart dimensions
    var width = graphicWidth - margin['left'] - margin['right'];
    var height = Math.ceil((graphicWidth * aspectHeight) / aspectWidth) - margin['top'] - margin['bottom'];

    
	
var legend = graph.append('ul')
	.attr('class', 'key')
	.selectAll('g')
		.data([{key: "Registered Voters"}, {key: "Voting Age Population (estimated)"}])
	.enter().append('li')
		.attr('class', function(d, i) {
			return 'key-item key-' + i + ' ' + classify(d['key']);
		});
legend.append('b')
    .style('background-color', function(d) {
        return color(d['key']);
    });
legend.append('label')
    .text(function(d) {
        return d['key'];
    });
	
	
	// draw the chart
    var svg = graph.append('svg')
		.attr('width', width + margin['left'] + margin['right'])
		.attr('height', height + margin['top'] + margin['bottom'])
        .append('g')
            .attr('transform', 'translate(' + margin['left'] + ',' + margin['top'] + ')');

	var slope = d3.scale.log()
			.domain([d3.min(values), d3.max(values)])
			.range([height-10, 0]);
		
	var county = svg.selectAll('g.county')
			.data(graphicData)
			.enter()
			.append("g")
			.attr("class", "county");
			
		county
			.on("mouseover", function(d,i) { return d3.select(this).classed("over", true); })
			.on("mouseout", function(d,i) { return d3.select(this).classed("over", false); })
			
		county.append("text")
			.classed("label voters start", true)
			.attr("x",90)
			.attr("y", function(d, i) { var rounded = d3.round((d.old_voters + d.old_vap) / 2, 0); return slope(rounded) })
			.attr("text-anchor", "end")
			.text(function(d) { return d.label });
		
		county.append("text")
			.classed("label voters end", true)
			.attr("x", width-100)
			.attr("y", function(d, i) { var rounded = d3.round((d.new_voters + d.new_vap) / 2, 0); return slope(rounded) })
			.text(function(d) { return d.label });
			
		county.append("line")
			.classed("slope voters", true)
			.attr("x1", 100)
			.attr("x2", width-110)
			.attr("y1", function(d,i) {
			var rounded = d3.round(d.old_voters,0)
			return d.old_voters && d.new_voters ? slope(rounded) : null; 
			})
			.attr("y2", function(d,i) {
			var rounded = d3.round(d.new_voters,0)
			return d.new_voters && d.new_voters ? slope(rounded) : null; 
			})		

		county.append("line")
			.classed("slope vap", true)
			.attr("x1", 100)
			.attr("x2", width-110)
			.attr("y1", function(d,i) {
			var rounded = d3.round(d.old_vap,0)
			return d.old_vap && d.new_vap ? slope(rounded) : null; 
			})
			.attr("y2", function(d,i) {
			var rounded = d3.round(d.new_vap,0)
			return d.new_vap && d.new_vap ? slope(rounded) : null; 
			})
			
				var voters_start_text = county.append("text")
					.classed("number voters start", true)
					.attr("x", 115)
					.attr("y", function(d, i) { var rounded = d3.round(d.old_voters, 0); return slope(rounded) - 30 })
					.attr("text-anchor", "start")
		
				voters_start_text.append("tspan")
					.attr("x", 115)
					.text(function(d) { return fmtComma(d.old_voters); })
			
				voters_start_text.append("tspan")
					.attr("x", 115)
					.attr("dy", "1em")
					.text("registered voters")

				voters_start_text.append("tspan")
					.attr("x", 115)
					.attr("dy", "1em")
					.text("in 2004")
			
				var vap_start_text = county.append("text")
					.classed("number vap start", true)
					.attr("x", 115)
					.attr("y", function(d, i) { var rounded = d3.round(d.old_vap, 0); return slope(rounded) + 15 })
					.attr("text-anchor", "start")
		
				vap_start_text.append("tspan")
					.attr("x", 115)
					.text(function(d) { return fmtComma(d.old_vap); })
			
				vap_start_text.append("tspan")
					.attr("x", 115)
					.attr("dy", "1em")
					.text("estimated VAP")

				vap_start_text.append("tspan")
					.attr("x", 115)
					.attr("dy", "1em")
					.text("in 2004")
			
			
		var voters_end_text = county.append("text")
			.classed("number voters end", true)
			.attr("x", width-115)
			.attr("y", function(d, i) { var rounded = d3.round(d.new_voters, 0); return slope(rounded) + 15 })
			.attr("text-anchor", "end")
		
		voters_end_text.append("tspan")
			.attr("x", width-115)
			.text(function(d) { return fmtComma(d.new_voters); })
			
		voters_end_text.append("tspan")
			.attr("x", width-115)
			.attr("dy", "1em")
			.text("registered voters")

		voters_end_text.append("tspan")
			.attr("x", width-115)
			.attr("dy", "1em")
			.text("in 2015")
			
		var vap_end_text = county.append("text")
			.classed("number vap end", true)
			.attr("x", width-115)
			.attr("y", function(d, i) { var rounded = d3.round(d.new_vap, 0); return slope(rounded) - 30 })
			.attr("text-anchor", "end")
		
		vap_end_text.append("tspan")
			.attr("x", width-115)
			.text(function(d) { return fmtComma(d.new_vap); })
			
		vap_end_text.append("tspan")
			.attr("x", width-115)
			.attr("dy", "1em")
			.text("estimated VAP")

		vap_end_text.append("tspan")
			.attr("x", width-115)
			.attr("dy", "1em")
			.text("in 2013")
			
};
		

/*
 * HELPER FUNCTIONS
 */
var classify = function(str) { // clean up strings to use as CSS classes
    return str.replace(/\s+/g, '-').toLowerCase();
}



/*
 * Initially load the graphic
 * (NB: Use window.load instead of document.ready
 * to ensure all images have loaded)
 */
$(window).load(onWindowLoaded);