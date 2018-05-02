(function() {

    var chart = twitterchart();
    d3.select("#chart-interface-container").call(chart);

    $(function() {
        var viewer = ImageViewer();

        $(".clickable img").click(function() {
            viewer.show(this.src);
        });

        $(".clickable[data-img-src]").click(function() {
            viewer.show($(this).data("img-src"));
        });

        var searchbox = $("input#chart-search-box");
        searchbox.on("change input", function() {
            chart.filter(this.value);
            var not_found = !$("#chart-interface-container .card").not(".hidden").size();

            $(this).toggleClass("not-found", not_found);
        });

        searchbox.on("focusin", function() {
            $("#chart-interface-container").toggleClass("show-captions", true);
        });

        searchbox.on("focusout", function() {
            if (this.value.length <= 0) $("#chart-interface-container").toggleClass("show-captions", false);
        });
        
        document.onkeydown = function(evt) {
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key == "Escape" || evt.key == "Esc");
            } else {
                isEscape = (evt.keyCode == 27);
            }
            if (isEscape) {
                viewer.hide();
            }
        };

    });
})();

