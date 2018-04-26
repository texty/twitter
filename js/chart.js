function twitterchart() {

    var img
        , card
        , followers_format = (function() {
            var proto = d3.format(",.0f");
            return function (v) { return proto(v).replace(/,/g, " ")}
        })()
        , viewer
        ;

    $(function() { viewer = ImageViewer() });

    function my(selection) {
        selection.each(function() {

            var container = d3.select(this);

            d3.csv("data/replacements.csv", function(err, data) {
                if (err) throw err;
                
                card = container
                    .selectAll("div.card")
                    .data(data)
                    .enter()
                    .append("div")
                    .attr("class", "card")
                    .classed("active", function(d,i){return i==0});

                card.append("img")
                    .attr("src", function(d){return "data/previews/" + d.login.toLowerCase() + ".jpg"});

                var tooltip = container.select(".fixed-tooltip");

                var activeCard;

                card
                    .on("mouseenter", mouseenter)
                    .on("touchstart", function(d) {
                        // dirty hack for touch devices:
                        //       do all the same as on mouseenter
                        //       but also count number of touchstart events.
                        //       And it's a good moment to reset counter for all other elements
                        var touchstart_counter = d.touchstart_counter;
                        card.each(function(d) {delete d.touchstart_counter});

                        if (!touchstart_counter) d.touchstart_counter = 1;
                        else d.touchstart_counter = touchstart_counter + 1;
                        // dirty hack end

                        container.classed("touch", true);

                        // now do the same as on mouseenter
                        mouseenter.call(this, d);
                    })
                        
                    .on("mouseleave", function(d) {
                        // dirty hack for touch devices:
                        //       do not trigger dummy mouseleave for touch devices
                        if (d.touchstart_counter) return;
                        // dirty hack end;

                        tooltip.classed("hidden", true);
                        d3.select(this).classed("bordered", false);
                    })

                    .on("click", function(d) {
                        // dirty hack for touch devices:
                        //       open full screen image only on second touch;
                        if (d.touchstart_counter && d.touchstart_counter < 2) return;
                        // dirty hack end;

                        viewer.hide();
                        viewer.show("data/charts/" + d.login.toLowerCase() + ".jpg");
                    });

                tooltip.on("click", function() {
                    d3.select(activeCard)
                        .each(function(d) {
                            viewer.hide();
                            viewer.show("data/charts/" + d.login.toLowerCase() + ".jpg");
                        })
                });

                function mouseenter(d) {
                    activeCard = this;
                    
                    card.classed("bordered", false);
                    d3.select(this).classed("bordered", true);

                    var rect = this.getBoundingClientRect();
                    var pr = this.parentNode.getBoundingClientRect();

                    var res = {left: rect.left - pr.left, top: rect.top - pr.top};

                    var tip_on_left = rect.left + 300 > (pr.width + pr.left);
                    var left = tip_on_left ? res.left - 200 : res.left + 100;
                    var top = res.top;

                    var bottom_shift = false;

                    if (left < 0) {
                        left = 0;
                        top += 100;
                        bottom_shift = true;
                    }

                    tooltip
                        .style("top", inpx(top))
                        .style("left", inpx(left))
                        .classed("tipleft", !bottom_shift && tip_on_left)
                        .classed("tipright", !bottom_shift && !tip_on_left)
                        .classed("hidden", false);

                    updateTooltip(d);
                }

                function updateTooltip(d) {
                    tooltip.select("span.name").text(d.chart_name);
                    tooltip.select("span.login").text("@" + d.login);
                    tooltip.select("span.followers").text(followers_format(d.followers));
                }
            });
        });
    }

    function inpx(value) {
        return value + "px";
    }

    return my;
}

