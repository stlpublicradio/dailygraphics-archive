// global vars
var $graphic = null;
var pymChild = null;

var GRAPHIC_DATA_URL = 'area.csv';
var GRAPHIC_DATA_URL_2 = 'taxes.csv';
var GRAPHIC_DEFAULT_WIDTH = 600;
var MOBILE_THRESHOLD = 500;
var VALUE_MIN_HEIGHT = 100;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

var graphicData = null;
var graphicData2 = null;
var isMobile = false;

// D3 formatters
var pctFmt = d3.format('.2%')
var fmtComma = d3.format(',');
var fmtYearAbbrev = d3.time.format('%y');
var fmtYearFull = d3.time.format('%Y');


/*
 * Initialize
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        $graphic = $('#graphic');

        d3.csv(GRAPHIC_DATA_URL, function(error, data) {
	        d3.csv(GRAPHIC_DATA_URL_2, function(error, data2) {
		
            graphicData = data;

            graphicData.forEach(function(d) {
                d['area'] = +d['area'];
            });
	    
            graphicData2 = data2;

            graphicData2.forEach(function(d) {
                d['amount'] = +d['amount'];
            });
	    
	    
            pymChild = new pym.Child({
                renderCallback: render
            });

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
    var graphicWidth;

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
    drawGraph1(containerWidth);
    drawGraph2(containerWidth);

    // update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}


/*
 * DRAW THE GRAPH
 */
var drawGraph1 = function(graphicWidth) {
    var aspectHeight = 9;
    var aspectWidth = 16;
    if (isMobile) {
        aspectHeight = 3;
        aspectWidth = 4;
    }
    var margin = {  
        top: 0, 
        right: 0, 
        bottom: 60, 
        left: 0
    };
    
    var width = (graphicWidth) - margin.left - margin.right,
    height = graphicWidth / 2 + margin.bottom + margin.top,
    radius = Math.min(width, height - margin.bottom - margin.top) / 2 ;

var color = d3.scale.ordinal()
    .range([colors.brown, colors.tan, colors.blue,colors.green]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);
    
var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.area; });
    
    var areaDiv = d3.select("#graphic").append("div")
    .attr("id", "area")

    areaDiv.append("h3")
    .html(GRAPHIC_COPY.area_hed);
    
    areaDiv.append("p")
    .html(GRAPHIC_COPY.area_text);

var svg = areaDiv.append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
svg.append("g")
    .attr("class", "slices")    
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

total = d3.sum(graphicData, function(d) { return d.area })

  // var g = svg.selectAll(".slices")
  //     .data(pie(graphicData))
  //   .enter().append("g")
  //     .attr("class", "slices");
  //
  // g.append("path")
  //     .attr("d", arc)
  //     .style("fill", function(d) { return color(d.data.type); });

var slice = svg.select(".slices").selectAll("path.slice")
  .data(pie(graphicData));
  
  slice.enter()
  .insert("path")
  .style("fill", function(d) { return color(d.data.type); })
  .attr("class", "slice");
  
	slice.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

var text = svg.select(".labels").selectAll("g")
      .data(pie(graphicData));
      
      
      var labels = text.enter().append("g")
      .append("text")
      .attr("dy", ".7em")
      .text(function(d) { return d.data.type + ' ' + pctFmt(d.data.area / total); })
      .call(wrap, 70);
      
      
      function midAngle(d) {
	      return d.startAngle + (d.endAngle - d.startAngle)/2;
      }
      
text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = midAngle(d2) < Math.PI ? graphicWidth * .5 - 80 : graphicWidth * -.5 + 80;
				pos[1] = pos[1] > 0 ? radius * .5 : radius * -.85;
				return "translate("+ pos +")";
			};
			
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});
		
      
var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(graphicData));
	
	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = midAngle(d2) < Math.PI ? graphicWidth * .5 - 85 : graphicWidth * -.5 + 85;
				pos[1] = pos[1] > 0 ? radius * .5 : radius * -.85;
				return [arc.centroid(d2), pos];
			};			
		});
};

var drawGraph2 = function(graphicWidth) {
        var aspectHeight = 9;
        var aspectWidth = 16;
        if (isMobile) {
            aspectHeight = 3;
            aspectWidth = 4;
        }
        var margin = {  
            top: 0, 
            right: 0, 
            bottom: 60, 
            left: 0
        };
    
        var width = (graphicWidth) - margin.left - margin.right,
        height = graphicWidth / 2 + margin.bottom + margin.top,
        radius = Math.min(width, height - margin.bottom - margin.top) / 2 ;

    var color = d3.scale.ordinal()
        .range([colors.ltblue, colors.blue, colors.green,colors.ltgreen]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);
    
    var outerArc = d3.svg.arc()
    	.innerRadius(radius * 0.9)
    	.outerRadius(radius * 0.9);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.amount; });
    
        var taxesDiv = d3.select("#graphic").append("div")
        .attr("id", "taxes");

        taxesDiv.append("h3")
        .html(GRAPHIC_COPY.taxes_hed);
    
        taxesDiv.append("p")
        .html(GRAPHIC_COPY.taxes_text);

    var svg = taxesDiv.append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    svg.append("g")
        .attr("class", "slices")    
    svg.append("g")
    	.attr("class", "labels");
    svg.append("g")
    	.attr("class", "lines");

    total = d3.sum(graphicData2, function(d) { return d.amount })

    var slice = svg.select(".slices").selectAll("path.slice")
      .data(pie(graphicData2));
  
      slice.enter()
      .insert("path")
      .style("fill", function(d) { return color(d.data.type); })
      .attr("class", "slice");
  
    	slice.transition().duration(1000)
    		.attrTween("d", function(d) {
    			this._current = this._current || d;
    			var interpolate = d3.interpolate(this._current, d);
    			this._current = interpolate(0);
    			return function(t) {
    				return arc(interpolate(t));
    			};
    		})

    var text = svg.select(".labels").selectAll("g")
          .data(pie(graphicData2));
      
      
          var labels = text.enter().append("g")
          .append("text")
          .attr("dy", ".25em")
          .text(function(d) { return d.data.type + ' ' + pctFmt(d.data.amount / total); })
          .call(wrap, 70)
      
      
      
      
          function midAngle(d) {
    	      return d.startAngle + (d.endAngle - d.startAngle)/2;
          }
      
    text.transition().duration(1000)
    		.attrTween("transform", function(d) {
    			this._current = this._current || d;
    			var interpolate = d3.interpolate(this._current, d);
    			this._current = interpolate(0);
    			return function(t) {
    				var d2 = interpolate(t);
    				var pos = outerArc.centroid(d2);
				pos[0] = midAngle(d2) < Math.PI ? graphicWidth * .5 - 90 : graphicWidth * -.5 + 90;
				pos[1] = pos[1] > 0 ? radius * .5 : radius * -.85;
    				return "translate("+ pos +")";
    			};
    		})
    		.styleTween("text-anchor", function(d){
    			this._current = this._current || d;
    			var interpolate = d3.interpolate(this._current, d);
    			this._current = interpolate(0);
    			return function(t) {
    				var d2 = interpolate(t);
    				return midAngle(d2) < Math.PI ? "start":"end";
    			};
    		});
      
    var polyline = svg.select(".lines").selectAll("polyline")
    		.data(pie(graphicData2));
	
    	polyline.enter()
    		.append("polyline");

    	polyline.transition().duration(1000)
    		.attrTween("points", function(d){
    			this._current = this._current || d;
    			var interpolate = d3.interpolate(this._current, d);
    			this._current = interpolate(0);
    			return function(t) {
    				var d2 = interpolate(t);
    				var pos = outerArc.centroid(d2);
				pos[0] = midAngle(d2) < Math.PI ? graphicWidth * .5 - 95 : graphicWidth * -.5 + 95;
				pos[1] = pos[1] > 0 ? radius * .5 : radius * -.85;
    				return [arc.centroid(d2), pos];
    			};			
    		});
};

/*
 * HELPER FUNCTIONS
 */
var classify = function(str) { // clean up strings to use as CSS classes
    var text = str.replace(/\s+/g, '-').toLowerCase();
    return text.replace(/\.|\,/g, '');
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = .35, // ems
        y = text.attr("y"),
        dy = .7,
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


/*
 * Initially load the graphic
 * (NB: Use window.load instead of document.ready
 * to ensure all images have loaded)
 */
$(window).load(onWindowLoaded);