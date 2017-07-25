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

    // Draw here!
    var q1 = q2 = q3 = q4 = q5 = q6 = qp = null;

    function changeVisibility(visibility) {
        d3.select('.answers')
            .classed('hide', true)
        d3.select('.to-do')
            .classed('hide', true)
        d3.selectAll('.answer-container')
            .classed('hide',true)
        d3.selectAll('.to-do-container')
            .classed('hide',true)

      for (var i = 0, len = visibility.hide.length; i < len; i++) {
          el = '#' + visibility.hide[i]
          d3.select(el)
          .classed("hide", true)
      }

      for (var i = 0, len = visibility.show.length; i < len; i++) {
          el = '#' + visibility.show[i]
          d3.select(el)
          .classed("hide", false)
          .select('form')
          .selectAll('input')
          .attr('disabled',null)
          .property('checked', false)
      }

      pymChild.sendHeight();
    };

    function runSummary() {
    d3.select('.answers')
        .classed('hide', false)
    d3.select('.to-do')
        .classed('hide', false)
    d3.selectAll('.answer-container')
        .classed('hide',true)
    d3.selectAll('.to-do-container')
        .classed('hide',true)

      questions = [q1,q2,q3,q4,q5,q6,qp]

      // summarize responses

      if (q1 == 1 && q2 == 0) {
          d3.select('#a1')
            .classed('hide',false)
      }

      if (q1 == 0) {
          d3.select('#a1n')
            .classed('hide',false)
      }

      if (q1 == 1 && q2 == 1) {
          d3.select('#a1e')
            .classed('hide',false)
      }

      if (q3 == 1) {
          d3.select('#a3')
            .classed('hide',false)
      }

      if (q3 == 0) {
          d3.select('#a3n')
            .classed('hide',false)
      }

      if (q4 == 1) {
          d3.select('#a4')
            .classed('hide',false)
      }

      if (q4 == 0) {
          d3.select('#a4n')
            .classed('hide',false)
      }

      if (q5 == 1) {
          d3.select('#a5')
            .classed('hide',false)
      }

      if (q5 == 0) {
          d3.select('#a5n')
            .classed('hide',false)
      }

      if (q6 == 1) {
          d3.select('#a6')
            .classed('hide',false)
      }

      if (q6 == 0) {
          d3.select('#a6n')
            .classed('hide',false)
      }

      if (q6 == 'unk') {
          d3.select('#a6u')
            .classed('hide',false)
      }

      // what they need to do
      if (q1 == 1 && q2 == 0) {
          d3.select('#a7')
            .classed('hide',false)
      }

      if (q1 == 1 && q2 == 1 && q3 == 1) {
          d3.select('#a8')
            .classed('hide',false)
      }

      if (q1 == 0 && q3 == 1) {
          d3.select('#a9')
            .classed('hide',false)
      }

      if (q1 == 1 && q2 == 1 && q4 == 1 && q5 == 1) {
          d3.select('#a10')
            .classed('hide',false)
      }

      if (q1 == 0 && q4 == 1 && q5 == 1) {
          d3.select('#a11')
            .classed('hide',false)
      }

      if (q1 == 1 && q2 == 1 && q4 == 1 && q5 == 0) {
          d3.select('#a12')
            .classed('hide',false)
      }

      if (q1 == 0 && q4 == 1 && q5 == 0) {
          d3.select('#a13')
            .classed('hide',false)
      }

      if (q1 == 1 && q2 == 1 && q4 == 0 && q5 == 1) {
          d3.select('#a14')
            .classed('hide',false);
        d3.select('#a16')
          .classed('hide',false)
      }

      if (q1 == 0 && q4 == 0 && q5 == 1) {
          d3.select('#a15')
            .classed('hide',false);
        d3.select('#a16')
          .classed('hide',false)
      }

      if (q1 == 1 && q2 == 1 && q4 == 0 && q5 == 0) {
          d3.select('#a14')
            .classed('hide',false);
        d3.select('#a17')
          .classed('hide',false)
      }

      if (q1 == 0 && q4 == 0 && q5 == 0) {
          d3.select('#a15')
            .classed('hide',false);
        d3.select('#a17')
          .classed('hide',false)
      }

      if (q6 == 1 && q3 == 1) {
          d3.select('#a18')
            .classed('hide',false)
      }

      if (q6 == 1 && q3 != 1) {
          d3.select('#a19')
            .classed('hide',false)
      }

      if (q6 == 'unk' && q3 == 1) {
          d3.select('#a20')
            .classed('hide',false)
      }

      if (q6 == 'unk' && q3 != 1) {
          d3.select('#a21')
            .classed('hide',false)
      }

      if (q6 == 0 && q3 == 1) {
          d3.select('#a22')
            .classed('hide',false)
      }

      if (q6 == 0 && q3 != 1) {
          d3.select('#a23')
            .classed('hide',false)
      }

      if (qp == 1) {
          d3.select('#ap')
            .classed('hide', false)
          d3.select('#ap2')
            .classed('hide', false)
      }

      if (qp == 0) {
          d3.select('#apn')
            .classed('hide', false)
      }


      pymChild.sendHeight();

    }

    d3.select('#q1')
      .classed('current',true)
      .classed('hide', false)
      .select('form')
      .selectAll('input')
      .attr('disabled',null)

    d3.selectAll('input[name="q1"]').on("change", function(d, i) {
     q1 = this.value;
     q2 = q3 = q4 = q5 = q6 = qp = null;

     if (q1 == 1) {
       visibility = {hide : ['q3','qp','q4','q5','q6'], show : ['q2']}
       changeVisibility(visibility)
     }

     if (q1 == 0) {
       visibility = {show : ['q3'], hide : ['q2','qp','q4','q5','q6']}
       changeVisibility(visibility)
     }
    });

    d3.selectAll('input[name="q2"]').on("change", function(d, i) {
     q2 = this.value
     q3 = q4 = q5 = q6 = qp = null;


     if (q2 == 1) {
       visibility = {show : ['q3'], hide : ['qp','q4','q5','q6']}
       changeVisibility(visibility)
     }

     if (q2 == 0) {
       visibility = {hide : ['q3','qp','q4','q5'], show : ['q6']}
       changeVisibility(visibility)
     }
    });

    d3.selectAll('input[name="q3"]').on("change", function(d, i) {
     q3 = this.value
     q4 = q5 = q6 = qp = null;

     if (q3 == 1) {
       visibility = {show : ['q6'], hide : ['qp','q4','q5']}
       changeVisibility(visibility)
     }

     if (q3 == 0) {
       visibility = {hide : ['q4','q5','q6'], show : ['qp']}
       changeVisibility(visibility)
     }
    });

    d3.selectAll('input[name="qp"]').on("change", function(d, i) {
     qp = this.value
     q4 = q5 = q6 = null;

     if (qp == 1) {
       visibility = {show : ['q6'], hide : ['q4','q5']}
       changeVisibility(visibility)
     }

     if (qp == 0) {
       visibility = {hide : ['q5','q6'], show : ['q4']}
       changeVisibility(visibility)
     }
    });

    d3.selectAll('input[name="q4"]').on("change", function(d, i) {
     q4 = this.value
     q5 = q6 = null;

     if (q4 == 1) {
       visibility = {show : ['q5'], hide : ['q6']}
       changeVisibility(visibility)
     }

     if (q4 == 0) {
       visibility = {hide : ['q6'], show : ['q5']}
       changeVisibility(visibility)
     }
    });

    d3.selectAll('input[name="q5"]').on("change", function(d, i) {
     q5 = this.value
     q6 = null;

     if (q5 == 1) {
       visibility = {show : ['q6'], hide : []}
       changeVisibility(visibility)
     }

     if (q5 == 0) {
       visibility = {hide : [], show : ['q6']}
       changeVisibility(visibility)
     }
    });

    d3.selectAll('input[name="q6"]').on("change", function(d, i) {
     q6 = this.value
     runSummary();
    });

}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
