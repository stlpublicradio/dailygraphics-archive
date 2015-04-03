var pymChild = null;
GRAPHIC_DEFAULT_WIDTH = 500;
MOBILE_THRESHOLD = 300;

var courts = null;
var people = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

var onWindowLoaded = function() {
    if (Modernizr.svg) {
        $graphic = $('#graphic');

        d3.json("data.json", function(json1) {

		
        	d3.json("people.json", function(json2) {
			
			courts = json1;
        		people = json2;
				
				console.log(courts)

            pymChild = new pym.Child({
                renderCallback: render
            });
        });
	});
    } else {
        pymChild = new pym.Child({ });
    }
}

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
    drawGraph(containerWidth);

    // update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * Render the graphic
 */
var drawGraph = function(graphicWidth) {

		console.log(graphicWidth)
		console.log(isMobile)
        var aspectHeight = 1;
        var aspectWidth = 1;
        if (isMobile) {
            aspectHeight = 1;
            aspectWidth = 1;
        }
	
        var margin = {  
            top: 100, 
            right: 0, 
            bottom: 0, 
            left: 100
	}	
	
        var width = graphicWidth - 60 - margin['left'] - margin['right'];
        var height = Math.ceil(((graphicWidth - 60 )* aspectHeight) / aspectWidth) ;
		
        var x = d3.scale.ordinal().rangeBands([0, width]);

    var svg = d3.select("#graphic").append("svg")
        .attr("width", graphicWidth - 50)
        .attr("height", height)
		.style("margin-bottom", margin['bottom'])
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	
      var matrix = [],
          nodes = courts.nodes,
          n = nodes.length;
		  
  	var tooltip = d3.select("body").append("div")
  	    .attr("class", "tooltip")
  	    .style("opacity", 0);

      // Compute index per node.
      nodes.forEach(function(node, i) {
        node.index = i;
        node.count = 0;
        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0, jj: 0, pp: 0, jp: 0, pj: 0, jfjf: 0, pfpf: 0, jfpf: 0, pfjf: 0}; });
      });

      // Convert links to matrix; count character occurrences.
      courts.links.forEach(function(link) {
        total = link.jj + link.pp + link.jp + link.pj + link.jfjf + link.pfpf + link.pfjf + link.jfpf

        matrix[link.source][link.target].jj += link.jj;
        matrix[link.source][link.target].pp += link.pp;
        matrix[link.source][link.target].jp += link.jp;
        matrix[link.source][link.target].pj += link.pj;
        matrix[link.source][link.target].jfjf += link.jfjf;
        matrix[link.source][link.target].pfpf += link.pfpf;
        matrix[link.source][link.target].pfjf += link.pfjf;
        matrix[link.source][link.target].jfpf += link.jfpf;
        matrix[link.source][link.target].z += total;
        nodes[link.source].count += total;
    


      });

      var orders = {
        name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
        count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; })
      };

      // The default sort order.
      x.domain(orders.count);

      svg.append("rect")
          .attr("class", "background")
          .attr("width", width)
          .attr("height", height);

      var row = svg.selectAll(".row")
          .data(matrix)
        .enter().append("g")
          .attr("class", "row")
          .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
          .each(row);

      row.append("line")
          .attr("x2", width);

      row.append("text")
          .attr("x", -6)
          .attr("y", x.rangeBand() / 2)
          .attr("dy", ".32em")
          .attr("text-anchor", "end")
          .text(function(d, i) { return nodes[i].name; });

      var column = svg.selectAll(".column")
          .data(matrix)
        .enter().append("g")
          .attr("class", "column")
          .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

      column.append("line")
          .attr("x1", -width);

      column.append("text")
          .attr("x", 6)
          .attr("y", x.rangeBand() / 2)
          .attr("dy", ".32em")
          .attr("text-anchor", "start")
          .text(function(d, i) { return nodes[i].name; });


      function row(row) {
        var cell = d3.select(this).selectAll(".cell")
            .data(row.filter(function(d) { return d.z; }))
          .enter().append("rect")
            .attr("class", "cell")
            .attr("x", function(d) { return x(d.x); })
            .attr("width", x.rangeBand())
            .attr("height", x.rangeBand())
            // .style("fill-opacity", function(d) { return z(d.z); })
            .style("fill", function(d) { return d.jj > 0 ? '#31716e' : d.pp > 0 ? '#e8604d' : d.jp > 0 ? '#70a99a' : d.pj > 0 ? '#f6883e' : '#571751' })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);
      }

      function mouseover(p) {
		  
		  c1 = p.y == p.x ? nodes[p.y].name : nodes[p.y].name,
		  c2 = p.y == p.x ? '' : nodes[p.x].name,
		  j1 = people[p.y].judge,
		  j2 = p.y == p.x ? '' : people[p.x].judge,
		  jf1 = people[p.y].judge_firm,
		  jf2 = p.y == p.x ? '' : people[p.x].judge_firm,
		  p1 = people[p.y].prosecutor,
		  p2 = p.y == p.x ? '' : people[p.x].prosecutor,
		  pf1 = people[p.y].prosecutor_firm,
		  pf2 = p.y == p.x ? '' : people[p.x].prosecutor_firm;

        toolTipTable = '<table id="info"><tr id="name"><th class="blank"></th><th class="city1">' + c1 + '</th><th class="city2">' + c2 + '</th></tr><tr id="judge"><td class="key">Judge:</td><td class="city1">' + j1 + '</td><td class="city2">' + j2 + '</td></tr><tr id="judge_firm"><td class="key">Judge\'s law firm:</td><td class="city1">' + jf1 + '</td><td class="city2">' + jf2 + '</td></tr><tr id="prosecutor"><td class="key">Prosecutor:</td><td class="city1">' + p1 + '</td><td class="city2">' + p2 + '</td></tr><tr id="prosecutor_firm"><td class="key">Prosecutor\'s law firm:</td><td class="city1">' + pf1 + '</td><td class="city2">' + pf2 + '</td></tr></table>'
		  
		  
		
		d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
        d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
				
	  	var page_pos_x = function() {
			   if ((d3.event.pageX + 5) < graphicWidth / 2) {
			   	return (d3.event.pageX + 5)
			   }
			   else {
			   	return (d3.event.pageX - 240)
			   }
             };
			 
			 var page_pos_y = function() {
	 			   if ((d3.event.pageY + 5) < height / 2) {
	 			   	return (d3.event.pageY - 28)
	 			   }
	 			   else {
	 			   	return (d3.event.pageY - 145)
	 			   }
	              };
		   
        tooltip.transition()
             .duration(200)
             .style("opacity", .9);
        tooltip.html(toolTipTable)
		   .style("left", page_pos_x(d3.event.pageX) + "px")
             .style("top", page_pos_y(d3.event.pageY) + "px");

      }

      function mouseout() {
        d3.selectAll("text").classed("active", false);
   tooltip.transition()
        .duration(500)
        .style("opacity", 0);
		
      }

      d3.select("#order").on("change", function() {
        order(this.value);
      });

      function order(value) {
        x.domain(orders[value]);

        var t = svg.transition().duration(2500);

        t.selectAll(".row")
            .delay(function(d, i) { return x(i) * 4; })
            .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
          .selectAll(".cell")
            .delay(function(d) { return x(d.x) * 4; })
            .attr("x", function(d) { return x(d.x); });

        t.selectAll(".column")
            .delay(function(d, i) { return x(i) * 4; })
            .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
      }
      
      function sticky_relocate() {
          var window_top = $(window).scrollTop();
          var div_top = $('#order').offset().top;
          if (window_top > div_top) {
              $('#info').addClass('stick');
          } else {
              $('#info').removeClass('stick');
          }
      }

      
          $(window).scroll(sticky_relocate);
          sticky_relocate();
      



}

/*
 * NB: Use window.load instead of document.ready
 * to ensure all images have loaded
 */
$(window).load(onWindowLoaded);