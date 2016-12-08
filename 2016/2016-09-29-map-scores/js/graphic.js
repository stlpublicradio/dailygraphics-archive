/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    // Uncomment to enable column sorting
    var tablesort = new Tablesort(document.getElementById('state-table'));

    pymChild = new pym.Child({});

    selections = d3.select('.graphic').insert("div", ":first-child").classed('selections',true);

    all = d3.select('#state-table').selectAll('tr');
    local = d3.select('#state-table').selectAll('.local');
    charter = d3.select('#state-table').selectAll('.charter');
    local_charter = d3.select('#state-table').selectAll('.local.charter')

    var toggleLocal = function() {
        all.classed('show',false);
        if (showingLocal) {
            if (showingOnlyCharters) {
                charter.classed('show',true);
            }
            else {
                all.classed('show',true);
            }
            localButtonText.text('Show only St. Louis area districts')
        }
        else {
            if (showingOnlyCharters) {
                local_charter.classed('show',true);
            }
            else {
                local.classed('show',true);
            }
            localButtonText.text('Show all districts state wide')
        }
        showingLocal = !showingLocal;
        pymChild.sendHeight();
    }

    var toggleCharter = function() {
        all.classed('show',false);
        if (showingOnlyCharters) {
            if (showingLocal) {
                local.classed('show',true);
            }
            else {
                all.classed('show',true);
            }
            charterButtonText.text('Show only charter districts')
        }
        else {
            if (showingLocal) {
                local_charter.classed('show',true);
            }
            else {
                charter.classed('show',true);
            }
            charterButtonText.text('Show public and charter districts')
        }
        showingOnlyCharters = !showingOnlyCharters;
        pymChild.sendHeight();
    }

    local.classed('show',true)

    var showingLocal = true,
        showingOnlyCharters = false;

    localButton = selections.append('div').classed('show-local',true);

    localButtonText = localButton.append('p').text('Show all districts state wide');

    localButton.on('click',function() {
        toggleLocal();
    })

    charterButton = selections.append('div').classed('show-charter', true)

    charterButtonText = charterButton.append('p').text('Show only charter districts')

    charterButton.on('click',function() {
        toggleCharter();
    });

    pymChild.sendHeight()
}


/*
 * Initially load the graphic
 * (NB: Use window.load instead of document.ready
 * to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
