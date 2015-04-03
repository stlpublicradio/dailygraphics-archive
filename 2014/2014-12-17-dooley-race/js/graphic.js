var pymChild = null;



/*
 * Render the graphic
 */
function render(width) {

	var fmtpct = d3.format('.2%');
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 580 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	/* 
	 * value accessor - returns the value to encode for a given data object.
	 * scale - maps value to a visual display encoding, such as a pixel position.
	 * map function - maps from data value to display value
	 * axis - sets up axis
	 */ 

	// setup x 
	var xValue = function(d) { return d.pct_black;}, // data -> value
	    xScale = d3.scale.linear().range([0, width]), // value -> display
	    xMap = function(d) { return xScale(xValue(d)*100);}, // data -> display
	    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	// setup y
	var yValue = function(d) { return d.pct_dooley;}, // data -> value
	    yScale = d3.scale.linear().range([height, 0]), // value -> display
	    yMap = function(d) { return yScale(yValue(d)*100);}, // data -> display
	    yAxis = d3.svg.axis().scale(yScale).orient("left");

	// add the graph canvas to the body of the webpage
	var svg = d3.select("#graphic").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add the tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
	    .attr("class", "tooltip")
	    .style("opacity", 0);

	// load data
	d3.csv("data.csv", function(error, data) {

	  // change string (from CSV) into number format
	  data.forEach(function(d) {
	    d.pct_black = +d.pct_black;
	    d.pct_dooley = +d.pct_dooley;
	//    console.log(d);
	  });

	  xScale.domain([0,90]);
	  yScale.domain([0,90]);

	  // x-axis
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("Percent black");

	  // y-axis
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Percent of votes for Dooley");

	  // draw dots
	  svg.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", 3.5)
	      .attr("cx", xMap)
	      .attr("cy", yMap)
		  .style("fill", function(d) {
			  if (d.pct_dooley > d.pct_black) {
			  	return "#f1bb4f"
			  }
			  else {
			  	return "#55b7d9"
			  }
			
		  })
	      .on("mouseover", function(d) {
	               console.log(d3.event.pageX)
			  var page_pos = function() {
					   if ((d3.event.pageX + 5) < 400) {
					   	return (d3.event.pageX + 5)
					   }
					   else {
					   	return (d3.event.pageX - 155)
					   }
	               };
				   
	          tooltip.transition()
	               .duration(200)
	               .style("opacity", .9);
	          tooltip.html(d.township + "<br/>Percent Black: " + fmtpct(xValue(d)) + "<br/>Percent of votes for Dooley: " + fmtpct(yValue(d)))
				   .style("left", page_pos(d3.event.pageX) + "px")
	               .style("top", (d3.event.pageY - 28) + "px");
	      })
	      .on("mouseout", function(d) {
	          tooltip.transition()
	               .duration(500)
	               .style("opacity", 0);
	      });

	});
    
    if (pymChild) {
        pymChild.sendHeightToParent();
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
})
