// Make a JSON object out of the data.d string receieved.
json_data = jQuery.parseJSON(data.d)

// width = 960 - 40 - 20 = 900
// height = 500 - 20 - 30 = 450
var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//  Information on ordinal scales can be found at: https://github.com/mbostock/d3/wiki/Ordinal-Scales
//  An ordinal scale that sets the output range from the specified continuous interval (that is, [0, width]).
//  The array interval contains two elements representing the min and max numeric values.
//  This interval is subdivided into n evenly-spaced bands, where n is the number of (unique) values in the domain.
//  The bands may be offset from the edge of the interval and other bands according to the specifided padding, 
//      which defaults to zero.
//  The padding is typically in the range [0,1] (0.1 in this example) and corrseponds to the amount of space
//      in the range interval to allocate to padding.
//  A value of 0.5 means that the band width will be equal to the padding width.
var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

//  Constructs a new ordinal scale with an empty domain and an empty range.
//  The ordinal scale is invalid (always returning undefined) until an output range is specified).
var x1 = d3.scale.ordinal();

//  Information on linear scales can be found at: https://github.com/mbostock/d3/wiki/Quantitative-Scales
//  Quantitative scales have a continuous domain, such as the set of real numbers, or dates.
//  Linear scales are a type of quantitative scale.
//  Linear scales are the most common scale, and a good default choice to map a continuous input domain to a
//      continous output range.
//  The mapping is linear in that the output range value y can be expressed as a linear function of the
//      input domain value x: y = mx + b.
//  The input domain is typically a dimension of the data that you want to visualize, such as the height of
//      students (measured in meters) in a sample population.
//  The output range is typically a dimension of the desired output visualization, such as the height of bars
//      (measured in pixels) in a histogram.

//  This will set up our y height scale.
var y = d3.scale.linear()
    .range([height, 0]);

// Colors of the graph.
//
// First    : Total flights #097054 (green)
// Second   : Completed flights #6599FF (blue)
// Third    : Cancelled flights #FFDE00 (yellow)
// Fourth   : Aborted flights #FF9900 (orange)
var color = d3.scale.ordinal()
    .range(["#097054", "#6599FF", "#FFDE00", "#FF9900"]);

//  Set up the xAxis to use our x0 scale and be oriented on the bottom.
var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");
    // We don't worry about tickFormat here, as the ticks will be determined by the data.

//  Set up the yAxis to use our y scale and be oriented on the left.
//      Additionally, set the tick format to display appropriate labels on the axis (taking out for now).
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
//    .tickFormat(d3.format(".2s"));

// Set up the svg canvas with the width and height we calculated earlier.
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// Move it to the right margin.left pixels, and move it down margin.top pixels


// Our JSON looks like:
//               [{ "YEAR": 2012, "MONTH": 1,  "MMM": "JAN", "Total": 36, "Completed": 21, "Canceled": 10,  "Aborted": 5 },
//                { "YEAR": 2012, "MONTH": 2,  "MMM": "FEB", "Total": 60, "Completed": 30, "Canceled": 21, "Aborted": 9 }]

//                data = d3.nest()
//                    .key(function (d) { return d.MMM + " " + d.YEAR; })
//                    .entries(json_data)
data = json_data


// seriesNames = "Total", "Completed", "Canceled" and "Aborted"               See, we're filtering out "YEAR", "MONTH" and "MMM"
var seriesNames = d3.keys(data[0]).filter(function (key) { return (key !== "YEAR") && (key !== "MONTH") && (key !== "MMM"); });
//                alert(JSON.stringify(seriesNames));
//                alert(seriesNames);

data.forEach(function (d) {
    d.Flights = seriesNames.map(function (name) { return { name: name, value: +d[name] }; });
    //alert("hi --- " + JSON.stringify(d.Flights));
});

//alert(JSON.stringify(data));

//x0.domain(data.map(function (d) { return d.State; }));
// Change State to be MMM, YEAR (for example: "Jan 2012") Could change this to Jan '12
x0.domain(data.map(function (d) { return d.MMM + " " + d.YEAR; }));
//alert(JSON.stringify(data.map(function (d) { return d.MMM + " " + d.YEAR; })));

//                //x1.domain(seriesNames).rangeRoundBands([0, x0.rangeBand()]);
x1.domain(seriesNames).rangeRoundBands([0, x0.rangeBand()]);

//                //y.domain([0, d3.max(data, function (d) { return d3.max(d.ages, function (d) { return d.value; }); })]);
//                // Make the y domain go from 0 up to the max of d.Total (Total flights)
//                y.domain([0, d3.max(data, function (d) { return d3.max(d.Total); })]);
y.domain([0, (10 + d3.max(data, function (d) { return d3.max(d.Flights, function (d) { return d.value; }); }))]);


// The axis business
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("# of Flights");


// From this point to...

//var state = svg.selectAll(".state")
//    .data(data)
//.enter().append("g")
//    .attr("class", "g")
//    .attr("transform", function (d) { return "translate(" + x0(d.State) + ",0)"; });

var state = svg.selectAll(".state")
    .data(data)
.enter().append("g")
    .attr("class", "g")
    .attr("transform", function (d) { return "translate(" + x0(d.MMM + " " + d.YEAR) + ",0)"; });

//alert(JSON.stringify(d.Flights[0]));
state.selectAll("rect")
    .data(function (d) { return d.Flights; })
.enter().append("rect")
    .attr("width", x1.rangeBand())
    .attr("x", function (d) { return x1(d.name); })
    .attr("y", function (d) { return y(d.value); })
    .attr("height", function (d) { return height - y(d.value); })
    .style("fill", function (d) { return color(d.name); });


var legend = svg.selectAll(".legend")
    .data(seriesNames.slice().reverse())
.enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) { return d; })
    .on("click", function (d) {
        alert(d);
        //state.selectAll("rect")
        //.update()

        //                        .exit().transition()
        //                            .attr("height", 0)
        //                            .remove();

        //state.selectAll("rect")
        //.update()


        //state.selectAll("rect").exit().transition().attr("height", 0).remove();
    });