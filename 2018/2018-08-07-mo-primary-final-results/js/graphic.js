// Global vars
var pymChild = null;
var isMobile = false;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    cong_dist_1_dem = '';
    cong_dist_1_rep = '';
    cong_dist_2_dem = '';
    cong_dist_2_rep = '';
    cong_sen_rep = '';
    cong_sen_dem = '';
    auditor_rep = '';
    cong_sen_green = '';
    prop_a = '';
    mo_sen_14_dem = '';
    mo_house_71_dem = '';
    mo_sen_18_rep = '';
    mo_house_73_dem = '';
    mo_house_72_dem = '';
    mo_house_76_dem = '';
    mo_house_75_dem = '';
    mo_house_79_dem = '';
    mo_house_77_dem = '';
    mo_house_81_dem = '';
    mo_house_80_dem = '';
    mo_house_84_dem = '';
    mo_house_82_dem = '';
    mo_house_86_dem = '';
    mo_house_85_dem = '';
    mo_house_95_rep = '';
    mo_house_87_dem = '';
    mo_house_109_rep = '';
    mo_house_97_rep = '';
    mo_house_118_rep = '';
    mo_house_110_rep = '';
    mo_house_118_dem = '';


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
 * Format data for D3.
 */
var formatData = function() {

    d3.csv("assets/cleaned_results.csv", function(data) {
        cong_dist_1_dem = data.filter(function(row) {
            return row['slug'] == 'u-s-representative-district-1' && row['party'] == 'Democratic';
        })
        
        
        cong_dist_1_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })


        cong_dist_1_rep = data.filter(function(row) {
            return row['slug'] == 'u-s-representative-district-1' && row['party'] == 'Republican';
        })
        
        
        cong_dist_1_rep.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        cong_dist_2_dem = data.filter(function(row) {
            return row['slug'] == 'u-s-representative-district-2' && row['party'] == 'Democratic';
        })
        
        
        cong_dist_2_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        console.log(cong_dist_2_dem)


        cong_dist_2_rep = data.filter(function(row) {
            return row['slug'] == 'u-s-representative-district-2' && row['party'] == 'Republican';
        })
        
        
        cong_dist_2_rep.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        cong_sen_dem = data.filter(function(row) {
            return row['slug'] == 'u-s-senator' && row['party'] == 'Democratic';
        })
        
        
        cong_sen_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })


        cong_sen_rep = data.filter(function(row) {
            return row['slug'] == 'u-s-senator' && row['party'] == 'Republican';
        })
        
        
        cong_sen_rep.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        cong_sen_green = data.filter(function(row) {
            return row['slug'] == 'u-s-senator' && row['party'] == 'Green';
        })
        
        
        cong_sen_green.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        auditor_rep = data.filter(function(row) {
            return row['slug'] == 'state-auditor' && row['party'] == 'Republican';
        })
        
        
        auditor_rep.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        prop_a = data.filter(function(row) {
            return row['slug'] == 'proposition-a';
        })
        
        
        prop_a.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_sen_14_dem = data.filter(function(row) {
            return row['slug'] == 'state-senator-district-14' && row['party'] == 'Democratic';
        })
        
        
        mo_sen_14_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_sen_18_rep = data.filter(function(row) {
            return row['slug'] == 'state-senator-district-18' && row['party'] == 'Republican';
        })
        
        
        mo_sen_18_rep.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_71_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-71' && row['party'] == 'Democratic';
        })
        
        
        mo_house_71_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_72_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-72' && row['party'] == 'Democratic';
        })
        
        
        mo_house_72_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_73_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-73' && row['party'] == 'Democratic';
        })
        
        
        mo_house_73_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_73_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-73' && row['party'] == 'Democratic';
        })
        
        
        mo_house_73_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_75_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-75' && row['party'] == 'Democratic';
        })
        
        
        mo_house_75_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_76_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-76' && row['party'] == 'Democratic';
        })
        
        
        mo_house_76_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_77_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-77' && row['party'] == 'Democratic';
        })
        
        
        mo_house_77_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_79_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-79' && row['party'] == 'Democratic';
        })
        
        
        mo_house_79_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_80_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-80' && row['party'] == 'Democratic';
        })
        
        
        mo_house_80_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_81_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-81' && row['party'] == 'Democratic';
        })
        
        
        mo_house_81_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_82_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-82' && row['party'] == 'Democratic';
        })
        
        
        mo_house_82_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_84_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-84' && row['party'] == 'Democratic';
        })
        
        
        mo_house_84_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_85_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-85' && row['party'] == 'Democratic';
        })
        
        
        mo_house_85_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_86_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-86' && row['party'] == 'Democratic';
        })
        
        
        mo_house_86_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_87_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-87' && row['party'] == 'Democratic';
        })
        
        
        mo_house_87_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_95_rep = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-95' && row['party'] == 'Republican';
        })
        
        
        mo_house_95_rep.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_97_rep = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-97' && row['party'] == 'Republican';
        })
        
        
        mo_house_97_rep.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_109_rep = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-109' && row['party'] == 'Republican';
        })
        
        
        mo_house_109_rep.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_110_rep = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-110' && row['party'] == 'Republican';
        })
        
        
        mo_house_110_rep.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_118_rep = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-118' && row['party'] == 'Republican';
        })
        
        
        mo_house_118_rep.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        mo_house_118_dem = data.filter(function(row) {
            return row['slug'] == 'state-representative-district-118' && row['party'] == 'Democratic';
        })
        
        
        mo_house_118_dem.forEach(function(d) {
            d['votes'] = +d['votes'];
            d['party_total_votes'] = +d['party_total_votes'];
            d['race_total_votes'] = +d['race_total_votes'];
            d['reported_pct'] = +d['reported_pct']
        })

        



        render()
    });
    
}



/*
 * Render the graphic(s). Called by pym with the container width.
 */
var render = function(containerWidth) {
    if (!containerWidth || containerWidth < 100) {
        containerWidth = DEFAULT_WIDTH;
    }

    if (containerWidth <= MOBILE_THRESHOLD) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    // Render the chart!
    renderBarChart({
        container: '#cong-dist-1-dem',
        width: containerWidth,
        data: cong_dist_1_dem
    });

    renderBarChart({
        container: '#cong-dist-1-rep',
        width: containerWidth,
        data: cong_dist_1_rep
    });

    renderBarChart({
        container: '#cong-dist-2-dem',
        width: containerWidth,
        data: cong_dist_2_dem
    });

    renderBarChart({
        container: '#cong-dist-2-rep',
        width: containerWidth,
        data: cong_dist_2_rep
    });

    renderBarChart({
        container: '#cong-sen-dem',
        width: containerWidth,
        data: cong_sen_dem
    });

    renderBarChart({
        container: '#cong-sen-rep',
        width: containerWidth,
        data: cong_sen_rep
    });

    renderBarChart({
        container: '#cong-sen-green',
        width: containerWidth,
        data: cong_sen_green
    });

    renderBarChart({
        container: '#auditor-rep',
        width: containerWidth,
        data: auditor_rep
    });

    renderBarChart({
        container: '#prop-a',
        width: containerWidth,
        data: prop_a
    });

    renderBarChart({
        container: '#mo-sen-14-dem',
        width: containerWidth,
        data: mo_sen_14_dem
    });

    renderBarChart({
        container: '#mo-sen-18-rep',
        width: containerWidth,
        data: mo_sen_18_rep
    });

    renderBarChart({
        container: '#mo-house-71-dem',
        width: containerWidth,
        data: mo_house_71_dem
    });

    renderBarChart({
        container: '#mo-house-72-dem',
        width: containerWidth,
        data: mo_house_72_dem
    });

    renderBarChart({
        container: '#mo-house-73-dem',
        width: containerWidth,
        data: mo_house_73_dem
    });

    renderBarChart({
        container: '#mo-house-75-dem',
        width: containerWidth,
        data: mo_house_75_dem
    });

    renderBarChart({
        container: '#mo-house-76-dem',
        width: containerWidth,
        data: mo_house_76_dem
    });

    renderBarChart({
        container: '#mo-house-77-dem',
        width: containerWidth,
        data: mo_house_77_dem
    });

    renderBarChart({
        container: '#mo-house-79-dem',
        width: containerWidth,
        data: mo_house_79_dem
    });

    renderBarChart({
        container: '#mo-house-80-dem',
        width: containerWidth,
        data: mo_house_80_dem
    });

    renderBarChart({
        container: '#mo-house-81-dem',
        width: containerWidth,
        data: mo_house_81_dem
    });

    renderBarChart({
        container: '#mo-house-82-dem',
        width: containerWidth,
        data: mo_house_82_dem
    });

    renderBarChart({
        container: '#mo-house-84-dem',
        width: containerWidth,
        data: mo_house_84_dem
    });

    renderBarChart({
        container: '#mo-house-85-dem',
        width: containerWidth,
        data: mo_house_85_dem
    });

    renderBarChart({
        container: '#mo-house-86-dem',
        width: containerWidth,
        data: mo_house_86_dem
    });

    renderBarChart({
        container: '#mo-house-87-dem',
        width: containerWidth,
        data: mo_house_87_dem
    });

    renderBarChart({
        container: '#mo-house-95-rep',
        width: containerWidth,
        data: mo_house_95_rep
    });

    renderBarChart({
        container: '#mo-house-97-rep',
        width: containerWidth,
        data: mo_house_97_rep
    });

    renderBarChart({
        container: '#mo-house-109-rep',
        width: containerWidth,
        data: mo_house_109_rep
    });

    renderBarChart({
        container: '#mo-house-110-rep',
        width: containerWidth,
        data: mo_house_110_rep
    });

    renderBarChart({
        container: '#mo-house-118-rep',
        width: containerWidth,
        data: mo_house_118_rep
    });

    renderBarChart({
        container: '#mo-house-118-dem',
        width: containerWidth,
        data: mo_house_118_dem
    });

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * Render a bar chart.
 */
var renderBarChart = function(config) {
    /*
     * Setup
     */
    var labelColumn = 'candidate';
    var valueColumn = 'reported_pct';

    var barHeight = 30;
    var barGap = 5;
    var labelWidth = 85;
    var labelMargin = 6;
    var valueGap = 6;

    var margins = {
        top: 0,
        right: 15,
        bottom: 20,
        left: (labelWidth + labelMargin)
    };

    var ticksX = 4;
    var roundTicksFactor = 5;

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = ((barHeight + barGap) * config['data'].length);

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    /*
     * Create the root SVG element.
     */
    var chartWrapper = containerElement.append('div')
        .attr('class', 'graphic-wrapper');

    var chartElement = chartWrapper.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    /*
     * Create D3 scale objects.
     */
    var min = d3.min(config['data'], function(d) {
        return Math.floor(d[valueColumn] / roundTicksFactor) * roundTicksFactor;
    });

    if (min > 0) {
        min = 0;
    }

    var max = d3.max(config['data'], function(d) {
        return Math.ceil(d[valueColumn] / roundTicksFactor) * roundTicksFactor;
    })

    var xScale = d3.scale.linear()
        .domain([min, max])
        .range([0, chartWidth]);

    /*
     * Create D3 axes.
     */
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(ticksX)
        .tickFormat(function(d) {
            return d.toFixed(0) + '%';
        });

    /*
     * Render axes to chart.
     */
    chartElement.append('g')
        .attr('class', 'x axis')
        .attr('transform', makeTranslate(0, chartHeight))
        .call(xAxis);

    /*
     * Render grid to chart.
     */
    var xAxisGrid = function() {
        return xAxis;
    };

    chartElement.append('g')
        .attr('class', 'x grid')
        .attr('transform', makeTranslate(0, chartHeight))
        .call(xAxisGrid()
            .tickSize(-chartHeight, 0, 0)
            .tickFormat('')
        );

    /*
     * Render bars to chart.
     */
    chartElement.append('g')
        .attr('class', 'bars')
        .selectAll('rect')
        .data(config['data'])
        .enter()
        .append('rect')
            .attr('x', function(d) {
                if (d[valueColumn] >= 0) {
                    return xScale(0);
                }

                return xScale(d[valueColumn]);
            })
            .attr('width', function(d) {
                return Math.abs(xScale(0) - xScale(d[valueColumn]));
            })
            .attr('y', function(d, i) {
                return i * (barHeight + barGap);
            })
            .attr('height', barHeight)
            .attr('class', function(d, i) {
                return 'bar-' + i + ' ' + classify(d[labelColumn]);
            });

    /*
     * Render 0-line.
     */
    if (min < 0) {
        chartElement.append('line')
            .attr('class', 'zero-line')
            .attr('x1', xScale(0))
            .attr('x2', xScale(0))
            .attr('y1', 0)
            .attr('y2', chartHeight);
    }

    /*
     * Render bar labels.
     */
    chartWrapper.append('ul')
        .attr('class', 'labels')
        .attr('style', formatStyle({
            'width': labelWidth + 'px',
            'top': margins['top'] + 'px',
            'left': '0'
        }))
        .selectAll('li')
        .data(config['data'])
        .enter()
        .append('li')
            .attr('style', function(d, i) {
                return formatStyle({
                    'width': labelWidth + 'px',
                    'height': barHeight + 'px',
                    'left': '0px',
                    'top': (i * (barHeight + barGap)) + 'px'
                });
            })
            .attr('class', function(d) {
                return classify(d[labelColumn]);
            })
            .append('span')
                .text(function(d) {
                    return d[labelColumn];
                });

    /*
     * Render bar values.
     */
    chartElement.append('g')
        .attr('class', 'value')
        .selectAll('text')
        .data(config['data'])
        .enter()
        .append('text')
            .text(function(d) {
                return d[valueColumn].toFixed(1) + '%';
            })
            .attr('x', function(d) {
                return xScale(d[valueColumn]);
            })
            .attr('y', function(d, i) {
                return i * (barHeight + barGap);
            })
            .attr('dx', function(d) {
                var xStart = xScale(d[valueColumn]);
                var textWidth = this.getComputedTextLength()

                // Negative case
                if (d[valueColumn] < 0) {
                    var outsideOffset = -(valueGap + textWidth);

                    if (xStart + outsideOffset < 0) {
                        d3.select(this).classed('in', true);
                        return valueGap;
                    } else {
                        d3.select(this).classed('out', true);
                        return outsideOffset;
                    }
                // Positive case
                } else {
                    if (xStart + valueGap + textWidth > chartWidth) {
                        d3.select(this).classed('in', true)
                        return -(valueGap + textWidth);
                    } else {
                        d3.select(this).classed('out', true)
                        return valueGap;
                    }
                }
            })
            .attr('dy', (barHeight / 2) + 3);

    containerElement.insert("div",':first-child')
            .attr('class', 'precincts')
            .append('p')
            .text(function() {
                if (config['data'][0]) {
                    return config['data'][0]['race_status'];
                }
            })
            
}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
