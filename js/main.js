(function() {

    var chart = twitterchart();
    d3.select("#chart-interface-container").call(chart);

    $(function() {
        var viewer = ImageViewer();

        $(".clickable img").click(function() {
            viewer.show(this.src);
        });

        var searchTerm = "";

        $("input#chart-search-box").on("change input", function() {
            chart.filter(this.value);
            var not_found = !$("#chart-interface-container .card").not(".hidden").size();

            $(this).toggleClass("not-found", not_found);
        });

    });
})();

