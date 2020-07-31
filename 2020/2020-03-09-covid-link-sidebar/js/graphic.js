// Global vars
var pymChild = null;
var isMobile = false;
var GRAPHIC_DEFAULT_WIDTH = 600;
var MOBILE_THRESHOLD = 500;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
  pymChild = new pym.Child({
    renderCallback: render
  });
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

  // Update iframe
  if (pymChild) {
    pymChild.sendHeight();
  }
};

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
