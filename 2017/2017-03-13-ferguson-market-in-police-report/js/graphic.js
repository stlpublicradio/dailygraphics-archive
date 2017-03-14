// Global vars
var pymChild = null;
var isMobile = false;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        pymChild = new pym.Child({
            renderCallback: render
        });
    } else {
        console.log("Bing")

        pymChild = new pym.Child({});
    }


}

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

    dc.embed.loadNote('//www.documentcloud.org/documents/1370562-14-43984-care-main/annotations/343530.js');

    dc.embed.loadNote('//www.documentcloud.org/documents/1370562-14-43984-care-main/annotations/343529.js');


    // Update iframe
    setTimeout(function() {
    if (pymChild) {
        pymChild.sendHeight();
    }

}, 1000)
}


/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
