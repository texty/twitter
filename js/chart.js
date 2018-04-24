function twitterchart() {

    var width = 450
        , height = 300
        , chart_margin = {left: 0, top: 40, right: 0, bottom: 15}
        , img
        , item
        ;


    function my(selection) {
        selection.each(function() {

            var container = d3.select(this);

            var list = container.select(".list-container");
            var chart = container.select(".chart-container");

            d3.csv("data/replacements.csv", function(err, data) {
                if (err) throw err;
                
                item = list
                    .selectAll("div.list-item")
                    .data(data)
                    .enter()
                    .append("div")
                    .attr("class", "list-item")
                    .classed("active", function(d,i){return i==0});


                item.append("img")
                    .attr("src", function(d){return "data/userpics/" + d.login.toLowerCase() + ".jpg"});

                item.append("span")
                    .text(function(d) {return d.chart_name});

                const container = document.querySelector("#chart-interface-container .list-container");
                Ps.initialize(container, {
                    suppressScrollX: true
                });

                var active = data[0];

                img = chart.append("img")
                    .attr("src", "data/charts/" + active.login.toLowerCase() + ".jpg");

                item.on("click", activate);
                
            });


            function activate(d) {
                img.attr("src", "data/charts/" + d.login.toLowerCase() + ".jpg");
                item.classed("active", false);
                d3.select(this).classed("active", true);
            }


        });
    }

    my.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return my;
    };

    my.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return my;
    };

    function inpx(value) {
        return value + "px";
    }

    return my;
}

