/*
 * Initialize the graphic.
 */
var onWindowLoaded = function() {
    // Uncomment to enable column sorting

    var tablesort = new Tablesort(document.getElementById('school-table'));

    $(document).ready(function () {
        $("#school-table td:nth-child(3)").each(function () {
            if ($(this).text() == "Yes") {
                $(this).css("background-color", "#C9E2F3");
            } else if ($(this).text() == "No") {
                $(this).css("background-color", "#D5D2D1");
            } else if ($(this).text() == "No *") {
                $(this).css("background-color", "#D5D2D1");
            }
        });
    });

    $(document).ready(function () {
        $("#school-table td:nth-child(2)").each(function () {
            if ($(this).text() == "Yes") {
                $(this).css("background-color", "#C9E2F3");
            } else if ($(this).text() == "No") {
                $(this).css("background-color", "#D5D2D1");
            }
        });
    });

    pymChild = new pym.Child({});

}


/*
 * Initially load the graphic
 * (NB: Use window.load instead of document.ready
 * to ensure all images have loaded)
 */
window.onload = onWindowLoaded;
