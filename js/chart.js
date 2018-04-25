function twitterchart() {

    var img
        , card
        , followers_format = (function() {
            var proto = d3.format(",.0f");
            return function (v) { return proto(v).replace(/,/g, " ")}
        })()
        ;


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

                card.on("mouseenter touchstart", function(d) {
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
                })
                .on("mouseleave", function(d) {
                    tooltip.classed("hidden", true);
                    d3.select(this).classed("bordered", false);

                });

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

