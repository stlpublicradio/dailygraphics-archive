// Global vars
var pymChild = null;
var isMobile = false;
var skipLabels = ['values', 'label', 'category'];
var selected_data = [];
var nodes = [];
var chartWidth;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function () {
    if (Modernizr.svg) {
        formatData();
        pymChild = new pym.Child({
            renderCallback: render
        });
    } else {
        pymChild = new pym.Child({});
    }

}

/*
 * Format the data
 */
var formatData = function () {
    DATA.forEach(function (d) {
        var y0 = 0;

        d['values'] = [];

        for (var key in d) {
            if (_.contains(skipLabels, key)) {
                continue;
            }

            d[key] = +d[key];

            // var y1 = y0 + d[key];
            // d['total'] += d[key];

            d['values'].push({
                'name': key,
                // 'y0': y0,
                // 'y1': y1,
                'val': d[key]
            })

            // y0 = y1;
        }
    });
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
        data: DATA
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
    var aspectWidth = isMobile ? 3 : 4;
    var aspectHeight = 3;

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

    d3.select('#buttons').html('')

    // Create container
    var chartElement = containerElement.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    var nested_data = d3.nest()
        .key(function (d) {
            return d.category;
        })
        .entries(config.data);


    var buttons = d3.select('#buttons').selectAll("a")
        .data(nested_data)
        .enter().append("a")
        .attr("class", function(d) {
            var selected;
            if (selected_data.length > 0) {
                if (selected_data[0].category == d.key) {
                    selected = true;
                }
            }

            return selected ? "button selected" : "button";
        })
        .attr("id", function (d) {
            return d.key
        })
        .text(function (d) {
            return d.key
        })
        .on("click", function (d) {
            buttons.classed("selected", false);
            button = d3.select(this);
            button.classed("selected", true);

            selected_data = d.values;
            updateData();
        })

    // Draw here!

    var fill = d3.scale.category10();




    var force = d3.layout.force()
        .nodes(nodes)
        .gravity(.2)
        .friction(.8)
        .size([chartWidth, chartHeight])
        .on("tick", tick);

    var node = chartElement.selectAll(".node");


    var updateData = function () {
        if (selected_data.length < 1) {
            selected_data = [config.data[0]]
        }

        if (selected_data.length == 1) {
            foci = [{
                x: chartWidth / 2,
                y: chartHeight / 2
            }]
        }
        if (selected_data.length == 2) {
            foci = [{
                x: 0,
                y: chartHeight / 2
            }, {
                x: chartWidth,
                y: chartHeight / 2
            }]
        }

        if (selected_data.length == 3) {
            foci = [{
                x: 0,
                y: 0
            }, {
                x: chartWidth,
                y: 0
            }, {
                x: chartWidth / 2,
                y: chartHeight
            }]
        }

        if (selected_data.length == 4) {
            foci = [{
                    x: 0,
                    y: 0
                },
                {
                    x: chartWidth,
                    y: 0
                },
                {
                    x: 0,
                    y: chartHeight
                },
                {
                    x: chartWidth,
                    y: chartHeight
                }
            ]
        }

        nodes = nodes.filter(function (d) {
            return d.type == 'circle'
        });


        total = 0
        selected_data.forEach(function (d, i) {
            total += d.number;
        });

        if (nodes.length > total) {
            nodes.length = total
        }

        while (nodes.length < total) {
            nodes.push({
                type: "circle",
                r: 0,
                x: 0,
                y: 0,
                id: null
            })
        }

        categories = [0];

        selected_data.forEach(function (d, index) {
            new_total = d.number + categories[categories.length - 1]
            categories.push(new_total)
        })

        for (i = 0; i < categories.length - 1; i++) {
            nodes.slice(categories[i], categories[i + 1]).forEach(function (d, index) {
                d.id = i,
                    d.nodeID = selected_data[i].category + '-' + (categories[i] + index)
            })
        }


        selected_data.forEach(function (d, index) {
            y_padding = 75
            x_padding = 45
            text_locations = [
                [{
                    x: chartWidth / 2 - x_padding,
                    y: 0 + y_padding
                }],
                [{
                    x: 0 + x_padding * 2,
                    y: 0 + y_padding
                }, {
                    x: chartWidth - (x_padding * 2),
                    y: 0 + y_padding
                }],
                [{
                        x: 0 + x_padding * 2,
                        y: 0 + y_padding
                    }, {
                        x: chartWidth - (x_padding * 2),
                        y: 0 + y_padding
                    },
                    {
                        x: chartWidth / 2 - x_padding,
                        y: chartHeight - y_padding
                    }
                ],
                [{
                        x: 0 + x_padding * 2,
                        y: 0 + y_padding
                    }, {
                        x: chartWidth - (x_padding * 2),
                        y: 0 + y_padding
                    },
                    {
                        x: 0 + x_padding * 2,
                        y: chartHeight - y_padding
                    },
                    {
                        x: chartWidth - (x_padding * 2),
                        y: chartHeight - y_padding
                    }
                ]
            ]

            mobile_text_locations = [
                [{
                    x: chartWidth / 2 - x_padding,
                    y: 0 + y_padding
                }],
                [{
                    x: 0 + x_padding,
                    y: 0 + y_padding
                }, {
                    x: chartWidth - (x_padding),
                    y: 0 + y_padding
                }],
                [{
                        x: 0 + x_padding,
                        y: 0 + y_padding / 2
                    }, {
                        x: chartWidth - (x_padding),
                        y: 0 + y_padding / 2
                    },
                    {
                        x: chartWidth / 2,
                        y: chartHeight
                    }
                ],
                [{
                        x: 0 + x_padding,
                        y: 0 + y_padding / 2
                    }, {
                        x: chartWidth - (x_padding),
                        y: 0 + y_padding / 2
                    },
                    {
                        x: 0 + x_padding,
                        y: chartHeight
                    },
                    {
                        x: chartWidth - x_padding,
                        y: chartHeight
                    }
                ]
            ]



            node_text = d.label + ': ' + d.number;
            nodes.push({
                id: index,
                nodeID: d.category + '-' + (nodes.length),
                type: "text",
                text: node_text,
                r: 0,
                x: isMobile ? mobile_text_locations[selected_data.length - 1][index]['x'] : text_locations[selected_data.length - 1][index]['x'],
                y: isMobile ? mobile_text_locations[selected_data.length - 1][index]['y'] : text_locations[selected_data.length - 1][index]['y'],
                fixed: true
            })
        })



        var node = chartElement.selectAll("g").data(nodes, function (d) {
            return d.nodeID
        })



        node.exit().remove()

        transitioning = node.transition()
            .duration(500)

        transitioning.filter(function (d) {
                return d.type == 'circle'
            })
            .selectAll("circle")
            .style("fill", function (d) {
                return fill(d.id);
            })
            .style("stroke", function (d) {
                return d3.rgb(fill(d.id)).darker(2);
            })

        transitioning.filter(function (d) {
                return d.type == 'text'

            })
            .selectAll("text")
            .text(function (d) {
                return d.text;
            })
            .call(wrapText, 100, 16)





        entering = node.enter().append("g")
            .attr("class", "node")

        entering.filter(function (d) {
                return d.type == 'circle'
            })
            .append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", function (d) {
                return isMobile ? 1 : 3;
            })
            .style("fill", function (d) {
                return fill(d.id);
            })
            .style("stroke", function (d) {
                return d3.rgb(fill(d.id)).darker(2);
            })

        entering.filter(function (d) {
                return d.type == 'text'
            })
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr('dx', -45)
            .attr('dy', -10)
            .text(function (d) {
                return d.text
            })
            .call(wrapText, 100, 16)


        force.nodes(nodes)
            .alpha(1)
            .charge(function (d) {
                if (d.type == 'text') {
                    return -900;
                } else {
                    return isMobile ? -2 : -20;
                }
            })
            .start()

    }

    var padding = 1 // separation between circles
    var text_width_padding = 5
    var text_height_padding = 1


    function collide(k) {
        var q = d3.geom.quadtree(nodes);
        return function (node) {
            if (node.type == 'circle') {
                var nr = node.r + padding,
                    nx1 = node.x - nr,
                    nx2 = node.x + nr,
                    ny1 = node.y - nr,
                    ny2 = node.y + nr;
            } else {
                var nr_w = node.r + text_width_padding,
                    nr_h = node.r + text_height_padding,
                    nx1 = node.x - nr_w,
                    nx2 = node.x + nr_w,
                    ny1 = node.y - nr_h,
                    ny2 = node.y + nr_h;
            }
            q.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                    var x = node.x - quad.point.x,
                        y = node.y - quad.point.y,
                        lx = Math.abs(x),
                        ly = Math.abs(y),
                        r = nr + quad.point.r;
                    if (lx < r && ly < r) {
                        if (lx > ly) {
                            lx = (lx - r) * (x < 0 ? -k : k);
                            node.x -= lx;
                            quad.point.x += lx;
                        } else {
                            ly = (ly - r) * (y < 0 ? -k : k);
                            node.y -= ly;
                            quad.point.y += ly;
                        }
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }

    // createInitialDataset()
    updateData();



    function tick(e) {
        var k = .1 * e.alpha;

        // Push nodes toward their designated focus.
        nodes.forEach(function (o, i) {
            o.y += (foci[o.id].y - o.y) * k;
            o.x += (foci[o.id].x - o.x) * k;
        });

        // node
        //     .each(collide(.5))


        node = chartElement.selectAll(".node")
            .attr("transform", function (d) {
                return "translate(" + ~~(d.x - d.r) + "," + ~~(d.y - d.r) + ")";
            });

    }

}



/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;