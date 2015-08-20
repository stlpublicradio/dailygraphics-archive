var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

var margin = {top: 85, right: 15, bottom: 70, left: 15},
    width = 150 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
	
	var formatScore = d3.format(".0");
	
	var formatPercent = d3.format(".0");

	var color = d3.scale.ordinal()
		.range([colors.red,colors.yellow,colors.orange])
		.domain(["Salary","Earning Potential","Loan Payback"]);
		
	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);	
		
	var y = d3.scale.linear()
	    .range([height, margin.top]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(formatScore);
	
		d3.csv("data.csv", function(data) {

		  // Data is nested by country
		  var counties = d3.nest()
		      .key(function(d) { return d.school; })
		      .entries(data);
		      
		  // Parse dates and numbers. We assume values are sorted by date.
		  // Also compute the maximum price per symbol, needed for the y-domain.
		  // symbols.forEach(function(s) {
		  //   s.values.forEach(function(d) { d.date = parse(d.date); d.price = +d.price; });
		  //   s.maxPrice = d3.max(s.values, function(d) { return d.price; });
		  // });

		  // Compute the minimum and maximum year and percent across symbols.
		  x.domain(data.map(function(d) { return d.category; }));
		  y.domain([0, 100]);

		  // Add an SVG element for each country, with the desired dimensions and margin.
		  var svg = d3.select("#graphic").selectAll("svg")
		    .data(counties)
		    .enter()
		    .append("svg:svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)

		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
			  .call(xAxis)
	      .selectAll("text")
	          .attr("y", 0)
	          .attr("x", 9)
	          .attr("dy", ".35em")
	          .attr("transform", "rotate(90)")
	          .style("text-anchor", "start");

		  svg.append("g")
			  .attr("transform", "translate(" + width / 2 + ",0)")
		      // Hide y axis
		      // .attr("class", "y axis")
		      // .call(yAxis)
		    .append("text")
		    .attr("class", "school")
		    .attr("x", 0)
		    .attr("y", 0)
		    .attr("dy", ".71em")
		    .attr("text-anchor", "middle")
		    .attr("font-size", "1.1em")
		    .text(function(d) { return d.key})
		    .call(wrap, width);

		  // Accessing nested data: https://groups.google.com/forum/#!topic/d3-js/kummm9mS4EA
		  // data(function(d) {return d.values;}) 
		  // this will dereference the values for nested data for each group
		
		// var tip = d3.tip()
		//   .attr('class', 'd3-tip')
		//   .offset([-10, 0])
		//   .html(
		// 	  function (d) { return "<strong>" + d.county + "\t" + d.condition + "</strong><br/><span style='color:#fff'>Bridges: " + d.count + "</span><br/>";
		//   });
		  
		  svg.selectAll(".bar")
		      .data(function(d) {return d.values;})
		      .enter()
		      .append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.category); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d.rank); })
		      .attr("height", function(d) { return height - y(d.rank); })
		      .attr("fill", function(d) {return color(d.category)})
		
		  svg.selectAll(".totals")
		.data(function(d) {return d.values;})
		.enter()
		.append("text")
		.attr("x", function(d) {return x(d.category) + (x.rangeBand() / 2); })
		.attr("y", function(d) {return y(d.rank);})
		.attr("text-anchor", "middle")
		.attr("font-size", "1.1em")
		.attr("dy", function(d) {return d.rank<20 ? "-.5em" : "1em"})
		.text(function(d) {return d.rank ? d.rank : "N/A";})
	      // .on('mouseover', tip.show)
	      // .on('mouseout', tip.hide);
		  
		  // svg.call(tip);
		  
 
		  

		  

		});
		
	  function wrap(text, width) {
	    text.each(function() {
	      var text = d3.select(this),
	          words = text.text().split(/\s+|-/).reverse(),
	          word,
	          line = [],
	          lineNumber = 0,
	          lineHeight = 1.1, // ems
	          y = text.attr("y"),
	          dy = parseFloat(text.attr("dy")),
	          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
	      while (word = words.pop()) {
	        line.push(word);
	        tspan.text(line.join(" "));
	        if (tspan.node().getComputedTextLength() > width) {
	          line.pop();
	          tspan.text(line.join(" "));
	          line = [word];
	          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	        }
	      }
	    });
	  }
		
		
		
		

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
