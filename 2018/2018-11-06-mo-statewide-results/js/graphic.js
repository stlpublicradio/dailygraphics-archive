// Global vars
var pymChild = null;
var isMobile = false;
compiled_data = {};

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    races = ['state-auditor','constitutional-amendment-no-4','state-senator-district-2','state-senator-district-4','state-senator-district-6','state-senator-district-10','state-senator-district-16','state-senator-district-18','state-senator-district-22','state-senator-district-24','state-senator-district-26','state-senator-district-28','state-representative-district-5','state-representative-district-41','state-representative-district-61','state-representative-district-62','state-representative-district-63','state-representative-district-64','state-representative-district-70','state-representative-district-71','state-representative-district-72','state-representative-district-79','state-representative-district-82','state-representative-district-83','state-representative-district-85','state-representative-district-87','state-representative-district-88','state-representative-district-89','state-representative-district-91','state-representative-district-92','state-representative-district-94','state-representative-district-95','state-representative-district-96','state-representative-district-97','state-representative-district-98','state-representative-district-99','state-representative-district-100','state-representative-district-101','state-representative-district-102','state-representative-district-103','state-representative-district-104','state-representative-district-105','state-representative-district-106','state-representative-district-107','state-representative-district-108','state-representative-district-109','state-representative-district-110','state-representative-district-111','state-representative-district-112','state-representative-district-113','state-representative-district-114','state-representative-district-116','state-representative-district-118','state-representative-district-119','state-representative-district-120','state-representative-district-121','state-representative-district-124','state-representative-district-129']

    incumbents = {
        'state-auditor': 'Nicole Galloway', 'state-senator-district-2': 'Bob Onder', 'state-senator-district-10': 'Jeanie Riddle', 'state-senator-district-22': 'Paul Wieland', 'state-senator-district-24': 'Jill Schupp', 'state-senator-district-26': 'Dave Schatz', 'state-senator-district-28': 'Sandy Crawford','state-representative-district-41': 'Randy Pietzman', 'state-representative-district-62': 'Tom Hurst', 'state-representative-district-63': 'Bryan Spencer', 'state-representative-district-70': 'Mark Matthiesen', 'state-representative-district-82': 'Donna M.C. Baringer', 'state-representative-district-83': 'Gina Mitten', 'state-representative-district-88': 'Tracy McCreery', 'state-representative-district-89': 'Dean Plocher', 'state-representative-district-91': 'Sarah Unsicker', 'state-representative-district-92': 'Doug Beck', 'state-representative-district-96': 'David J. Gregory', 'state-representative-district-97': 'Mike Revis', 'state-representative-district-98': 'Shamed Dogan', 'state-representative-district-99': 'Jean Evans', 'state-representative-district-100': 'Derek Grier', 'state-representative-district-101': 'Bruce DeGroot','state-representative-district-103': 'John Wiemann', 'state-representative-district-105': 'Phil Christofanelli', 'state-representative-district-106': 'Chrissy Sommer', 'state-representative-district-107': 'Nick Schroer', 'state-representative-district-108': 'Justin Hill', 'state-representative-district-111': 'Shane Roden', 'state-representative-district-112': 'Rob Vescovo', 'state-representative-district-113': 'Dan Shaul', 'state-representative-district-114': 'Becky Ruth', 'state-representative-district-119': 'Nate Tate', 'state-representative-district-120': 'Jason Chipman', 'state-representative-district-124': 'Rocky Miller', 'state-representative-district-129': 'Jeff Knight'
    }

    winners = {
        'state-auditor': 'Nicole Galloway',
        'constitutional-amendment-no-4': 'N/A',
        'state-senator-district-2': 'Bob Onder', 'state-senator-district-4': 'Karla May', 'state-senator-district-6': 'Mike Bernskoetter', 'state-senator-district-16': 'Justin Dan Brown', 'state-senator-district-10': 'Jeanie Riddle', 'state-senator-district-18': "Cindy O'Laughlin", 'state-senator-district-22': 'Paul Wieland', 'state-senator-district-24': 'Jill Schupp', 'state-senator-district-26': 'Dave Schatz', 'state-senator-district-28': 'Sandy Crawford', 'state-representative-district-5': 'Louis Riggs', 'state-representative-district-41': 'Randy Pietzman', 'state-representative-district-61': 'Aaron D. Griesheimer', 'state-representative-district-62': 'Tom Hurst', 'state-representative-district-63': 'Bryan Spencer', 'state-representative-district-64': 'Tony Lovasco', 'state-representative-district-70': 'Paula Brown', 'state-representative-district-71': 'LaDonna Appelbaum', 'state-representative-district-72': 'Doug Clemens', 'state-representative-district-79': 'LaKeySha Bosley', 'state-representative-district-82': 'Donna M.C. Baringer', 'state-representative-district-83': 'Gina Mitten', 'state-representative-district-85': 'Kevin L. Windham, Jr.', 'state-representative-district-87': 'Ian Mackey', 'state-representative-district-88': 'Tracy McCreery', 'state-representative-district-89': 'Dean Plocher', 'state-representative-district-91': 'Sarah Unsicker', 'state-representative-district-92': 'Doug Beck', 'state-representative-district-94': 'Jim Murphy', 'state-representative-district-95': 'Michael A. ODonnell', 'state-representative-district-96': 'David J. Gregory', 'state-representative-district-97': 'Mary Elizabeth Coleman', 'state-representative-district-98': 'Shamed Dogan', 'state-representative-district-99': 'Jean Evans', 'state-representative-district-100': 'Derek Grier', 'state-representative-district-101': 'Bruce DeGroot', 'state-representative-district-102': 'Ron Hicks', 'state-representative-district-103': 'John D. Wiemann', 'state-representative-district-104': 'Adam Schnelting', 'state-representative-district-105': 'Phil Christofanelli', 'state-representative-district-106': 'Chrissy Sommer', 'state-representative-district-107': 'Nick Schroer', 'state-representative-district-108': 'Justin Hill', 'state-representative-district-109': 'John Simmons', 'state-representative-district-110': 'Dottie Bailey', 'state-representative-district-111': 'Shane Roden', 'state-representative-district-112': 'Rob Vescovo', 'state-representative-district-113': 'Dan Shaul', 'state-representative-district-114': 'Becky Ruth', 'state-representative-district-116': 'Dale L. Wright', 'state-representative-district-118': 'Mike McGirl', 'state-representative-district-119': 'Nate Tate', 'state-representative-district-120': 'Jason Chipman', 'state-representative-district-121': 'Don Mayhew', 'state-representative-district-124': 'Rocky Miller', 'state-representative-district-129': 'Jeff Knight'
    }


    

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


        races.forEach(function(d) {
            candidates = data.filter(function(row) {
                return row['slug'] == d;
            })
            
            compiled_data[d] = []

            candidates.forEach(function(candidate) {
                compiled_data[d].push(candidate)
            })

        })

        for (var i in compiled_data) {

                compiled_data[i].forEach(function(d) {
                if (d.votes == '0') {
                    d['votes'] = 0
                }
                else {
                    d['votes'] = +d.votes.replace(/,/g, '');
                }
                if (d.race_total_votes == '0') {
                    d['race_total_votes'] = 0
                }
                else {
                    d['race_total_votes'] = +d.race_total_votes.replace(/,/g, '');
                }
                if (d.reported_pct == '0') {
                    d['reported_pct'] = 0
                }
                else {
                d['reported_pct'] = +d['reported_pct']
                }

                if (d.candidate == winners[d.slug]) {
                    d['winner'] = 'winner';
                }
                if (d.slug in incumbents) {
                    if (d.candidate == incumbents[d.slug]) {
                       n = d.candidate.split(' ');

                    
                        last = n.pop()

                        
                        d.candidate = n + ' ' + last.toUpperCase() + '*'
                    }
                }
            })
        }

        compiled_data['constitutional-amendment-no-4'].pop()

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

    races.forEach(function(d) {
        
        if (compiled_data[d]) {
            renderBarChart({
            container: '#' + d,
            width: containerWidth,
            data: compiled_data[d]
        })
    }

    })

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

    if (config['data'].length == 1) {
        max = 100
    }

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
                switch (d['party']) {
                    case 'Republican':
                        party = 'gop'
                        break
                    case 'Democratic':
                        party = 'dem'
                        break
                    case 'N/A':
                        party = 'yes'
                        break    
                    default:
                        party = 'ind'
                        break 
                }

                return 'bar-' + i + ' ' + classify(d[labelColumn]) + ' ' + party + ' ' + d['winner'];
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
                    if (d[labelColumn] == 'N/A') {
                        return 'YES';
                    }
                    else {
                        return d[labelColumn];
                    }
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
