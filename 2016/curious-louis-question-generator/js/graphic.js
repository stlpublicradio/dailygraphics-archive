// Global vars
var pymChild = null;
var isMobile = false;

/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    if (Modernizr.svg) {
        pymChild = new pym.Child({
            renderCallback: render,
            polling: 500
        });
    } else {
        pymChild = new pym.Child({ polling: 500});
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
        data: [{"noun": ["wildlife","geography","a_community","an_event","a_custom","a_career","a_culture","a_law","a_group","folklore","a_legend","history","an_origin","a_museum","a_building","a_monument","terminology","geneology","slang","a_commonness","a_reoccurance","a_regularity"],
        "adjective":["relatable","unexplained","forgotten","quirky","dramatic","mysterious","rare","hidden","overlooked","misunderstood","native","hilarious","complicated"]
        }]
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
    var aspectWidth = 16;
    var aspectHeight = 3;

    var margins = {
        top: 60,
        right: 15,
        bottom: 20,
        left: 15
    };

    var imageWidth = config['width'] * .15;

    var data = config['data']

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = Math.ceil((config['width'] * aspectHeight) / aspectWidth) - margins['top'] - margins['bottom'];

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    var imageLeft = containerElement.append('img')
        .attr('src', 'https://s3.amazonaws.com/stlpr-assets/dailygraphics/curious-louis-question-generator/curious-louis-bulb.jpg');

    // Create container
    var containerDiv = containerElement.append('div')
        .attr('id', 'graphic-container');

    var chartElement = containerDiv.append('svg')
        .attr('width', chartWidth + margins['left'] + margins['right'] - (imageWidth * 2))
        .attr('height', chartHeight + margins['top'] + margins['bottom'])
        .append('g')
        .attr('transform', 'translate(' + margins['left'] + ',' + margins['top'] + ')');

    var currentNoun,
        newNoun,
        currentAdjective,
        newAdjective,
        nounRotating,
        adjectiveRotating;

    var letterspace = 24,
        letterheight = 50;

    var alphabet = "abcdefghijklmnopqrstuvwxyz_".split("");

    var buttonDiv = containerDiv.append('div')
        .attr('id', 'button-div');

    var nounButton = buttonDiv.append('button')
        .attr('id', 'randomize-noun')
        .on("click", function() { toggle('n', nounRotating);})
        .text('New Noun');

    var adjectiveButton = buttonDiv.append('button')
        .attr('id', 'randomize-adjective')
        .on("click", function() { toggle('a', adjectiveRotating);})
        .text('New Adjective');

    function update(data, part) {
      // JOIN new data with old elements.

      var text = part.selectAll("text")
        .data(data, function(d, i) { return d+i.toString(); });

      // UPDATE old elements present in new data.
      text.attr("class", "update")
          .attr("y", 0)
          .style("fill-opacity", 1)
        .transition()
        .duration(1500)
          .attr("x", function(d, i) { return i * letterspace; });

      // ENTER new elements present in new data.
      text.enter().append("text")
          .attr("class", "enter")
        //   .attr("dy", ".35em")
          .attr("y", -60)
          .attr("x", function(d, i) { return i * letterspace; })
          .style("fill-opacity", 1e-6)
          .text(function(d) { return d; })
        .transition()
        .duration(1500)
        .ease(d3.easeQuad)
          .attr("y", 0)
          .style("fill-opacity", 1);

      // EXIT old elements not present in new data.
      text.exit()
          .attr("class", "exit")
        .transition()
            .duration(1500)
            .ease(d3.easePolyInOut)
          .attr("y", 30)
          .style("fill-opacity", 1e-6)
          .remove();
    }

    sentenceBox = chartElement.append("g")
        .attr('class', 'sentenceBox')
        .attr('transform', 'translate(0,0)');

    prefixBox = sentenceBox.append("g")
        .attr('class', 'prefixBox')
        .append("text")
        .text('What about ')
        .attr('letter-spacing', '11px');

    nounBox = sentenceBox.append("g")
        .attr('class','nounBox')
        .attr('transform', 'translate(' + (letterspace * 11) + ',0)');

    middleBox = sentenceBox.append("g")
        .attr('class', 'middleBox')
        .attr('transform', 'translate(0,' + letterheight + ')')
        .append("text")
        .text('that is ')
        .attr('letter-spacing', '11px');

    adjectiveBox = sentenceBox.append("g")
        .attr('class','adjectiveBox')
        .attr('transform', 'translate(' + (letterspace * 8) + ',' + letterheight + ')')

    endBox = sentenceBox.append("g")
        .attr('class', 'endBox')
        .attr('transform', 'translate(' + (letterspace * (9 + getLongestWordLength("adjective"))) + ',' + letterheight + ')')
        .append("text")
        .text('in STL?')
        .attr('letter-spacing', '11px');


    update(getNewWord("noun"), nounBox);
    update(getNewWord("adjective"), adjectiveBox);
    start('n');
    start('a');

    function toggle(d, rotating) {
        rotating ? stop(d) : start(d);
    }

    function start(d) {
        if (d == 'n') {
            noun = d3.interval(function() {
                randomize(d);
            }, 6000);
            nounRotating = true;
            var elem = document.getElementById("randomize-noun");
            elem.innerHTML = "Lock Noun";
        }
        else {
            adjective = d3.interval(function() {
                randomize(d);
            }, 6000);
            adjectiveRotating = true;
            var elem = document.getElementById("randomize-adjective");
            elem.innerHTML = "Lock Adjective";
        }
    };

    function stop(d) {
        if (d == 'n') {
            noun.stop();
            nounRotating = false;
            var elem = document.getElementById("randomize-noun");
            elem.innerHTML = "New Noun";
        }
        else {
            adjective.stop();
            adjectiveRotating = false;
            var elem = document.getElementById("randomize-adjective");
            elem.innerHTML = "New Adjective";
        }
    };

    function getLongestWordLength(part) {
        return data[0][part].sort(function (a, b) { return b.length - a.length; })[0].length;
    }

    function getNewWord(part) {

        longestWordLength = getLongestWordLength(part)

        base = data[0][part][Math.floor(Math.random() * data[0][part].length)];
        spacers = '_'.repeat((longestWordLength - base.length));
        return spacers + base;
    }

    function randomize(d) {
        if (d == 'n') {
            newNoun = getNewWord("noun")
            update(newNoun, nounBox);
        }
        else {
            newAdjective = getNewWord("adjective")
            update(newAdjective, adjectiveBox);
        }
    }

    var imageRight = containerElement.append('img')
            .attr('src', 'https://s3.amazonaws.com/stlpr-assets/dailygraphics/curious-louis-question-generator/curious-louis-mic.jpg');

    var imageFooter = containerElement.append('img')
            .attr('src', 'https://s3.amazonaws.com/stlpr-assets/dailygraphics/curious-louis-question-generator/curious-louis-footer.jpg')
            .attr('id', 'img-footer');


}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
