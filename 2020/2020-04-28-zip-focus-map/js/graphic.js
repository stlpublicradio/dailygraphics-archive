// Global vars
var pymChild = null;
var isMobile = false;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function () {
    pymChild = new pym.Child({
        renderCallback: render
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
        data: []
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
    var aspectWidth = 823;
    var aspectHeight = 650;
    var zoom = 11;

    img_width = config.width;
    img_height = Math.round(config.width * (aspectHeight / aspectWidth));

    if (img_width < 400) {
        zoom = 10
    }
    


    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    // Create container
    // var chartElement = containerElement.append('svg')
    //     .attr('width', chartWidth + margins['left'] + margins['right'])
    //     .attr('height', chartHeight + margins['top'] + margins['bottom'])
    //     .append('g')
    //     .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    // Draw here!

    img_url = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(%7B%0A%22type%22%3A%20%22FeatureCollection%22%2C%0A%22crs%22%3A%20%7B%20%22type%22%3A%20%22name%22%2C%20%22properties%22%3A%20%7B%20%22name%22%3A%20%22urn%3Aogc%3Adef%3Acrs%3AEPSG%3A%3A4269%22%20%7D%20%7D%2C%0A%22features%22%3A%20%5B%0A%7B%20%22type%22%3A%20%22Feature%22%2C%20%22properties%22%3A%20%7B%20%22ZCTA5CE10%22%3A%20%2263106%22%2C%20%22AFFGEOID10%22%3A%20%228600000US63106%22%2C%20%22GEOID10%22%3A%20%2263106%22%2C%20%22ALAND10%22%3A%205842040%2C%20%22AWATER10%22%3A%200%20%7D%2C%20%22geometry%22%3A%20%7B%20%22type%22%3A%20%22Polygon%22%2C%20%22coordinates%22%3A%20%5B%20%5B%20%5B%20-90.23301%2C%2038.643971%20%5D%2C%20%5B%20-90.230009%2C%2038.642654%20%5D%2C%20%5B%20-90.227307%2C%2038.645874%20%5D%2C%20%5B%20-90.229238%2C%2038.646709%20%5D%2C%20%5B%20-90.228692%2C%2038.647482%20%5D%2C%20%5B%20-90.226835%2C%2038.646686%20%5D%2C%20%5B%20-90.228284%2C%2038.648321%20%5D%2C%20%5B%20-90.227812%2C%2038.648959%20%5D%2C%20%5B%20-90.225985%2C%2038.648159%20%5D%2C%20%5B%20-90.223826%2C%2038.651242%20%5D%2C%20%5B%20-90.224769%2C%2038.651661%20%5D%2C%20%5B%20-90.222054%2C%2038.655459%20%5D%2C%20%5B%20-90.220772%2C%2038.655492%20%5D%2C%20%5B%20-90.21713%2C%2038.653823%20%5D%2C%20%5B%20-90.212942%2C%2038.653854%20%5D%2C%20%5B%20-90.205078%2C%2038.652261%20%5D%2C%20%5B%20-90.202829%2C%2038.651211%20%5D%2C%20%5B%20-90.19969%2C%2038.650637%20%5D%2C%20%5B%20-90.193545%2C%2038.652525%20%5D%2C%20%5B%20-90.188687%2C%2038.642619%20%5D%2C%20%5B%20-90.187155%2C%2038.640103%20%5D%2C%20%5B%20-90.186355%2C%2038.635413%20%5D%2C%20%5B%20-90.187385%2C%2038.635854%20%5D%2C%20%5B%20-90.190453%2C%2038.635357%20%5D%2C%20%5B%20-90.191482%2C%2038.637957%20%5D%2C%20%5B%20-90.191865%2C%2038.636724%20%5D%2C%20%5B%20-90.195681%2C%2038.637535%20%5D%2C%20%5B%20-90.196483%2C%2038.634427%20%5D%2C%20%5B%20-90.198362%2C%2038.633729%20%5D%2C%20%5B%20-90.202745%2C%2038.634653%20%5D%2C%20%5B%20-90.20406%2C%2038.635489%20%5D%2C%20%5B%20-90.208483%2C%2038.636412%20%5D%2C%20%5B%20-90.208304%2C%2038.63691%20%5D%2C%20%5B%20-90.211263%2C%2038.637532%20%5D%2C%20%5B%20-90.211615%2C%2038.636505%20%5D%2C%20%5B%20-90.215232%2C%2038.63733%20%5D%2C%20%5B%20-90.214902%2C%2038.638284%20%5D%2C%20%5B%20-90.216908%2C%2038.638112%20%5D%2C%20%5B%20-90.222491%2C%2038.638856%20%5D%2C%20%5B%20-90.228721%2C%2038.640153%20%5D%2C%20%5B%20-90.228367%2C%2038.641083%20%5D%2C%20%5B%20-90.229955%2C%2038.641238%20%5D%2C%20%5B%20-90.233827%2C%2038.642817%20%5D%2C%20%5B%20-90.23301%2C%2038.643971%20%5D%20%5D%2C%20%5B%20%5B%20-90.191482%2C%2038.637957%20%5D%2C%20%5B%20-90.191341%2C%2038.638409%20%5D%2C%20%5B%20-90.190658%2C%2038.64043%20%5D%2C%20%5B%20-90.191893%2C%2038.640688%20%5D%2C%20%5B%20-90.191991%2C%2038.639502%20%5D%2C%20%5B%20-90.192554%2C%2038.638184%20%5D%2C%20%5B%20-90.191482%2C%2038.637957%20%5D%20%5D%20%5D%20%7D%20%7D%0A%5D%0A%7D)/auto/600x300@2x?access_token=pk.eyJ1Ijoic3RscHIiLCJhIjoicHNFVGhjUSJ9.WZtzslO6NLYL8Is7S-fdxg'

    // var img = document.createElement("img");
    var img = new Image();
    img.onload = function() { if (pymChild) {
        pymChild.sendHeight();
    }}
    console.log(img)
    img.src = img_url;
    img.alt = "63106 Zip Code in St. Louis"

    var img_container = document.getElementById("graphic")
    img_container.appendChild(img)

}


/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;