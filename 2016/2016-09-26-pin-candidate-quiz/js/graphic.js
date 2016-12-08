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

var startQuestion = 1;

//randomize questions
function randomize(a,b) {
    return Math.random() - 0.5;
}

questions = DATA.sort(randomize);


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
        data: questions
        });

    // Update iframe
    setTimeout(function(){
        if (pymChild) {
            pymChild.sendHeight();
        }
    },500);
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

    var questions = config.data;

    // Calculate actual chart dimensions
    var chartWidth = config['width'] - margins['left'] - margins['right'];
    var chartHeight = Math.ceil((config['width'] * aspectHeight) / aspectWidth) - margins['top'] - margins['bottom'];

    // Clear existing graphic (for redraw)
    var containerElement = d3.select(config['container']);
    containerElement.html('');

    // Create container
    var chartElement = containerElement.append('div');

    var questionContainer = chartElement.append('div');

    var candidateContainer = chartElement.append('div')
        .attr("class", "candidates");

    var candidates2 = [{"id": "Trump","name": "Donald Trump<br/>Republican"}, {"id": "Clinton", "name": "Hillary Clinton<br/>Democrat"}, {"id": "Johnson", "name": "Gary Johnson<br/>Libertarian"}, {"id": "Stein", "name": "Jill Stein<br/>Green"}];

    var candidateContainerInner = candidateContainer.selectAll('div')
        .data(candidates2)
        .enter()
        .append('div')
        .attr('class','candidate-contain')

        candidateContainerInner
        .append('img')
        .attr("id", function(d) { return d.id })
        .attr("src", function(d) { return "https://s3.amazonaws.com/stlpr-assets/dailygraphics/2016-09-26-pin-candidate-quiz/" + d.id.toLowerCase() + ".jpg"});

        candidateContainerInner
        .append('p')
        .html(function(d) {return d.name});

        candidateContainerInner
        .on("click", function(d) {
            candidateContainer.classed('selected','true')
            d3.select(this).classed('choice')
        })

    var newQuestion = chartElement.append('h2')
        .attr("id","next-question")
        .text("Next question")
        .on("click", function() {
            startQuestion = (startQuestion + 1) % numQuestions;
            displayQuestion(questions[startQuestion]);
            candidateContainer.classed('selected', false);
            candidateContainerInner.classed('choice', false);
        });

    // Draw here!


    var numQuestions = Object.keys(questions).length;

    function displayQuestion(question) {
        questionContainer.html(function() {
            return "<h1><span class='quote'>&ldquo;</span>" + question["question"] + "<span class='quote'>&rdquo;</span><h1>"
        })

        candidateContainer.selectAll("div")
            .classed('correct', function(d) { return question["answer"] == d.id })
            .classed('incorrect', function(d) { return question["answer"] !== d.id })
            .attr("style", '')
            .on("click", function() {
                candidateContainer.classed('selected', true);
                d3.select(this).classed('choice', true);
                candidateContainer.selectAll('div').on('click', null)
                questionContainer.html(function() {
                    return "<h1><span class='quote'>&ldquo;</span><span class='bolded'>" + questions[startQuestion]["bold-quote"] + '</span>' + (questions[startQuestion]["quote"] ? ' ' + questions[startQuestion]["quote"] : '') + "<span class='quote'>&rdquo;</span></h1><p class='person'>&mdash; " + question["name"] + ", " + question["location"] + "</p>"
                });
                pymChild.sendHeight();
            })
;
    }

    displayQuestion(questions[startQuestion]);




}

/*
 * Initially load the graphic
 * (NB: Use window.load to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
