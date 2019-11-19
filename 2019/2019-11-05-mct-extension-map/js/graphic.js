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

    polyline1 = '_mhkFnc%7BcPgy%40BkVAqP%40oPAsP%3FqPBi%40MAAsNLmT%40iW%3FeCB'
    polyline2 = 's%60lkFxc%7BcPjA%5EdAn%40j%40%7C%40d%40hA%60%40dChAbNhFhn%40tArInErOrHbUpLzQfGvItCjC%7CDhBnJpEdCpBhBvChAlFvB%7CXQbHa%40nIFzBTvA%60%40zBdBlDzI%60KLFjBjIbBbHrAhGdDbC~FvB%60CYfGnBxEnHzf%40leAjBjFp%40nFI%7CFN%60OV%60EbBhE%7CC%7CC%7CMzGfHlCxJjAtNdKxGfHpCvIbCtNJve%40%7B%40rcAIvEKtDw%40jIyP%7Cz%40sJpf%40uP~c%40aT~h%40sQnd%40mKnWwH~A%5BVThCMxCYxCc%40%60CJ%60A%7DAxE%7BDlKy%40~DQ%60FJpLXnNd%40%7CW'
    polyline3 = '_mhkFnc%7BcPrBxIzHDqBeJlb%40TjWBz~AcAhIbDh%7BA_Bt~%40qC%60r%40dAnNFnExChjBYnFz%40p%7B%40kf%40fUk%40'

    img_url = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/path-3+000-.7(' + polyline1 + '),path-3+000-.7(' + polyline2 + '),path-6+006400-1(' + polyline3 + ')/-89.928,38.679,' + zoom + '/' + img_width + 'x' + img_height + '?access_token=pk.eyJ1Ijoic3RscHIiLCJhIjoicHNFVGhjUSJ9.WZtzslO6NLYL8Is7S-fdxg'

    // var img = document.createElement("img");
    var img = new Image();
    img.onload = function() { if (pymChild) {
        pymChild.sendHeight();
    }}
    console.log(img)
    img.src = img_url;
    img.alt = "Goshen Trail Extension"

    var img_container = document.getElementById("graphic")
    img_container.appendChild(img)

}


/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;