// Global vars
var pymChild = null;
var isMobile = false;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        pymChild = new pym.Child({
            renderCallback: render(null)
        });
    } else {
        pymChild = new pym.Child({});
    }

}

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic.
 */
var render = function(containerWidth) {
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
        // data: DATA
    });

    // Update iframe
    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * Render a graphic.
 */
var renderGraphic = function(config) {
    var aspectWidth = 4;
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

    containerElement.append('h2')
    .text('Percent black, 2016');

    containerElement.append('div')
        .attr('class', 'key')
        .selectAll('div')
        .data(["<10%","10-20%","20-30%","30-40%",">40%"])
        .enter().append('div')
        .attr('class', function(d, i) { return "key-" + i})
        .text(function(d) { return d });

    // Create container
    var chartElement = containerElement.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    containerElement.append('h2')
    .text('Percent below poverty line, 2016');

    containerElement.append('div')
        .attr('class', 'key')
        .selectAll('div')
        .data(["<10%","10-15%","15-20%","20-25%",">25%"])
        .enter().append('div')
        .attr('class', function(d, i) { return "key-" + i})
        .text(function(d) { return d });

    var chartElement2 = containerElement.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')'); 

    containerElement.append('h2')
        .text('Percent low birth weight, 2010-2016');

        containerElement.append('div')
        .attr('class', 'key')
        .selectAll('div')
        .data(["<6%","6-8%","8-10%","10-12%",">12%"])
        .enter().append('div')
        .attr('class', function(d, i) { return "key-" + i})
        .text(function(d) { return d });

        var chartElement3 = containerElement.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'])
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');     

    // Draw here!
    
    d3.json("mo_counties_low_birth_weight.json", function(error, counties) {

        colorScale = ['#aadbec',colors.ltblue,colors.blue,colors.dkblue,'#003647']

        var colorRace = d3.scale.threshold()
            .domain([10,20,30,40,50])
            .range(colorScale);

        var colorPoverty = d3.scale.threshold()
            .domain([10,15,20,25,35])
            .range(colorScale);

        var colorBirthweight = d3.scale.threshold()
            .domain([6,8,10,12,14])
            .range(colorScale);    

        var projection = d3.geo.albers()
            .scale(chartWidth*9.5)
            .center([4,38.5])
            .translate([chartWidth / 2, chartHeight / 2]);

        var path = d3.geo.path()
        .projection(projection);

        chartElement.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(counties, counties.objects.mo_counties_low_birth_weight).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill",function(d) { 
                if (d.properties.pct_black == null) {
                    return '#efefef'
                }
                else {
                    return colorRace(+d.properties.pct_black)
                }
            })

        chartElement2.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(counties, counties.objects.mo_counties_low_birth_weight).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill",function(d) { 
                if (d.properties.pct_poverty == null) {
                    return '#efefef'
                }
                else {
                    return colorPoverty(+d.properties.pct_poverty)
                }
            })

        chartElement3.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(counties, counties.objects.mo_counties_low_birth_weight).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill",function(d) { 
                if (d.properties.pct_low_bw == null) {
                    return '#efefef'
                }
                else {
                    return colorBirthweight(+d.properties.pct_low_bw)
                }
            })    
            
    });


}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
