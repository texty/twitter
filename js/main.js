(function() {
    
    var chart = twitterchart();
    d3.select("#chart-interface-container").call(chart);
})();

$(function() {
    var viewer = ImageViewer();

    $(".clickable img").click(function() {
        viewer.show(this.src);
    });
});

