function twitterchart() {

    var img
        , card
        , followers_format = (function() {
            var proto = d3.format(",.0f");
            return function (v) { return proto(v).replace(/,/g, " ")}
        })()
        , viewer
        ;

    $(function() {
        viewer = ImageViewer();

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

    function my(selection) {
        my.hide_popup = function() {};

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

                var captions = card.append("div")
                    .attr("class", "caption")
                    .text(function(d){return d.login});


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

                        if (d3.event.ctrlKey) {
                            return openTwitter(d.login);
                        }

                        viewer.hide();
                        viewer.show("data/charts/" + d.login.toLowerCase() + ".jpg");
                    });

                card.selectAll("span.login")
                    .on("click", function(d) {
                        if (container.classed("touch")) {
                            openTwitter(d.login);
                            d3.event.stopPropagation();
                        }
                    });

                tooltip.on("click", function() {
                    d3.select(activeCard)
                        .each(function(d) {
                            viewer.hide();
                            viewer.show("data/charts/" + d.login.toLowerCase() + ".jpg");
                        })
                });

                tooltip.select("span.login").on("click", function() {
                    if (container.classed("touch")) {
                        openTwitter(d3.select(activeCard).datum().login);
                        d3.event.stopPropagation();
                    }
                });

                my.filter = function (term) {
                    term = normalize(term);

                    function _filter (d) {
                        delete d.matched_part;

                        if (normalize(d.login).indexOf(term) >= 0) {
                            d.matched_part = d.login;
                            return true;
                        }

                        if (normalize(d.profile_name).indexOf(term) >= 0) {
                            d.matched_part = d.profile_name;
                            return true;
                        }

                        if (normalize(d.chart_name).indexOf(term) >= 0) {
                            d.matched_part = d.chart_name;
                            return true;
                        }

                        return false;
                    }
                    
                    card.classed("hidden", function(d){return !_filter(d)});
                };

                my.hide_popup = function() {
                    tooltip.classed("hidden", true);
                    card.classed("bordered", false);
                    card.each(function(d) {delete d.touchstart_counter});
                };

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
    
    function normalize(str) {
        if (!str) return "";
        return str.trim().toLowerCase().replace(/\s+/g, " ");
    }

    function openTwitter(login) {
        window.open("https://twitter.com/" + login, "_blank");
    }

    return my;
}

