var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

var margin = {top: 10, right: 5, bottom: 50, left: 5},
    width = 100 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;
	
	var formatScore = d3.format(".0");
	
	var formatPercent = d3.format(".0");

	var color = d3.scale.ordinal()
		.range([colors.red,colors.orange])
		.domain(["serious","poor"]);
		
	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);	
		
	var y = d3.scale.linear()
	    .range([height, 0]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(formatScore);
	
		d3.csv("mo_bridges_critical.csv", function(data) {

		  // Data is nested by country
		  var counties = d3.nest()
		      .key(function(d) { return d.county; })
		      .entries(data);

		  // Parse dates and numbers. We assume values are sorted by date.
		  // Also compute the maximum price per symbol, needed for the y-domain.
		  // symbols.forEach(function(s) {
		  //   s.values.forEach(function(d) { d.date = parse(d.date); d.price = +d.price; });
		  //   s.maxPrice = d3.max(s.values, function(d) { return d.price; });
		  // });

		  // Compute the minimum and maximum year and percent across symbols.
		  x.domain(data.map(function(d) { return d.condition; }));
		  y.domain([0, 16]);

		  // Add an SVG element for each country, with the desired dimensions and margin.
		  var svg = d3.select("#graphic").selectAll("svg")
		    .data(counties)
		    .enter()
		    .append("svg:svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
			  .call(xAxis);

		  svg.append("g")
		      // Hide y axis
		      // .attr("class", "y axis")
		      // .call(yAxis)
		    .append("text")
		    .attr("x", width / 2)
		    .attr("y", height + margin.bottom - 20)
		    .attr("dy", ".71em")
		    .attr("text-anchor", "middle")
		    .attr("font-size", "1.1em")
		    .text(function(d) { return d.key})
			  ;

		  // Accessing nested data: https://groups.google.com/forum/#!topic/d3-js/kummm9mS4EA
		  // data(function(d) {return d.values;}) 
		  // this will dereference the values for nested data for each group
		
		var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(		  
			  function (d) { return "<strong>" + d.county + "\t" + d.condition + "</strong><br/><span style='color:#fff'>Bridges: " + d.count + "</span><br/>";
		  });
		  
		  
		  svg.selectAll(".bar")
		      .data(function(d) {return d.values;})
		      .enter()
		      .append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.condition); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d.count); })
		      .attr("height", function(d) { return height - y(d.count); })
		      .attr("fill", function(d) {return color(d.condition)})
	      .on('mouseover', tip.show)
	      .on('mouseout', tip.hide);
		  
		  svg.call(tip);
		  
			  var average = [{"condition":"poor","count":"1"},{"condition":"poor","count":"2"},{"condition":"poor","count":"3"},{"condition":"poor","count":"4"},{"condition":"poor","count":"5"},{"condition":"poor","count":"6"},{"condition":"poor","count":"7"},{"condition":"poor","count":"8"},{"condition":"poor","count":"9"},{"condition":"poor","count":"10"},{"condition":"poor","count":"11"},{"condition":"poor","count":"12"},{"condition":"poor","count":"13"},{"condition":"poor","count":"14"},{"condition":"poor","count":"15"},{"condition":"poor","count":"16"},{"condition":"serious","count":"1"},{"condition":"serious","count":"2"},{"condition":"serious","count":"3"},{"condition":"serious","count":"4"},{"condition":"serious","count":"5"},{"condition":"serious","count":"6"},{"condition":"serious","count":"7"},{"condition":"serious","count":"8"},{"condition":"serious","count":"9"},{"condition":"serious","count":"10"},{"condition":"serious","count":"11"},{"condition":"serious","count":"12"},{"condition":"serious","count":"13"},{"condition":"serious","count":"14"},{"condition":"serious","count":"15"},{"condition":"serious","count":"16"}];

			  svg.selectAll(".avg")
			  .data(average)
			  .enter()
			  .append("line")
			  .attr("class", "avg")
			  .attr("x1", function(d) { return x(d.condition); })
			  .attr("x2", function(d) { return x(d.condition) + x.rangeBand();})
			  .attr("y1", function(d) { return y(d.count); })
			  .attr("y2", function(d) { return y(d.count); });
		  

		});
		
		
		
		
		
		

    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * NB: Use window.load instead of document.ready
 * to ensure all images have loaded
 */
$(window).load(function() {
    pymChild = new pym.Child({
        renderCallback: render
    });
    
    setTimeout(function(){pymChild.sendHeight()}, 1000)
})
