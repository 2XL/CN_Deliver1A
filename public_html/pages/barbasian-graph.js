/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// representació grafica per mitja d'un div que es digui graph


var graphDiv = document.getElementById("graph");

// donar estil...



// d3.select("#graph");

/*
 * Compute:
 *  Degree distribution
 *  Complementary cumulative degree distribution
 *	histograms in log scale
 * 
 * 
 * 
 */

// loop through


computeHistogram = function (BA) {

    var stats = BA.getStats();
// fer el hitmiss histogram 
    var histogram = [];
    var histObj = [];
    stats.stack.forEach(function (item, idx, all) {
//	console.log(item.lenVertex());
	var size = item.lenVertex();
	if (histogram[size] === undefined)
	{
	    histogram[size] = 1;
	}
	else {
	    histogram[size]++;
	}
    });
    for (var idx = 0; idx < histogram.length; idx++)
    {
	// console.log(idx + " --> -> " + histogram[idx]);
	if (histogram[idx] === undefined) {
	    // console.log("fail");
	    histogram[idx] = 0;
	} else {
	    // console.log("ok");
	}

	histObj.push({
	    idx: idx,
	    frq: histogram[idx]
	});
    }
    console.log(histogram);
    console.log(histObj);
    return histObj;
};



plotHistogram = function (JSONData) {



    var targetDOM = "#graph";
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;
 

    var x = d3.scale.linear()
	    .range([0, width]);

    var y = d3.scale.linear()
	    .range([height, 0]);

    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

    var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

    var line = d3.svg.line()
	    .x(function (d) {
		return x(d.idx);
	    })
	    .y(function (d) {
		return y(d.frq);
	    });

    var svg = d3.select(targetDOM).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    console.log(data);
    var data = JSONData.slice();
    
    x.domain(d3.extent(data, function (d) {
	// return d.date;
	
	return d.idx;
    }));
    y.domain(d3.extent(data, function (d) {
	// return d.close;
	return d.frq;
    }));

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
	    .text("frequence");

    svg.append("path")
	    .datum(data)
	    .attr("class", "line")
	    .attr("d", line);
 
};


displayHistogram = function(BA){
    document.getElementById("graph").innerHTML = ""; 
    plotHistogram(computeHistogram(BA));
};