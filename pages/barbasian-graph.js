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
computeHistogram = function (BA, simple) {

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

    if (simple)
    {


	var histSimple =
		{
		    key: "Simple Histogram",
		    values: [
		    ]
		}
	;

	for (var key in histogram) {
	    var value = {};
	    value.label = (key).toString();
	    value.frequency = histogram[key];
	    histSimple.values.push(value);
	}
//	console.log(histogram);
//	console.log(histSimple);
	return histSimple;
    }
    else
    {
	console.log(histObj);
	return histObj;
    }
};

/*
 * Requires nvd3 
 */
plotSimpleBarChart = function (data) {
    // data is an array
    data = data.values;
    // console.log(data);

    document.getElementsByClassName('chart')[0].innerHTML = "";
    // preparing margins
    var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;


    var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);


    //    console.log(x);

    var y = d3.scale.linear()
	    .range([height, 0]);

    console.log(y);

    // Adding axes x
    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

    var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");


    var chart = d3.select(".chart")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    x.domain(data.map(function (d) {
	return d.label;
    }));

    y.domain([0, d3.max(data, function (d) {
	    return d.frequency;
	})]);

    var barWidth = width / data.length;

    var bar = chart.selectAll("g")
	    .data(data)
	    .enter().append("g")
	    .attr("transform", function (d, i) {
		return "translate(" + i * barWidth + ",0)";
	    });

    // append

    chart.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

    chart.append("g")
	    .attr("class", "y axis")
	    .call(yAxis);




    bar.append("rect")
	    .attr("y", function (d) {
		return y(d.frequency);
	    })
	    .attr("height", function (d) {
		return height - y(d.frequency);
	    })
	    .attr("width", barWidth - 1);

    bar.append("text")
	    .attr("x", barWidth / 2)
	    .attr("y", function (d) {
		return y(d.frequency) + 3;
	    })
	    .attr("dy", ".75em")
	    .text(function (d) {
		return d.frequency;
	    });

    function type(d) {
	d.frequency = +d.frequency; // coerce to number
	return d;
    }
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
/**
 * Probability Density Function
 * @param {barbasian} BA
 * @returns {undefined}
 */
drawPDF = function (BA) {
    var path;

    path = BA.getSetting();
    if (!path)
	return path;
    var url = "../js/json/graphJSON/S" + path.size + "-D" + path.degree + ".json";


    console.log("DrawPDF/init//" + path);
    loadJSON(url, draw);
    function draw(data) {
	console.info('drawPDF');
	// codigo:	 d3
	var histogram = computeHistogramFromJSONCache(data);
	console.log(histogram);
	// target div: graphDiv

	/*
	 <div id="sectionB" class="tab-pane fade"> 
	 <div id="graph"></div>  
	 <svg class="chart" id="chart" ></svg>
	 </div>
	 */

	var bin = {
	    histo: histogram,
	    histoSize: Object.keys(histogram).length,
	    histoProb: [],
	    histoDegree: Object.keys(histogram),
	    max: Math.max.apply(Math, Object.keys(histogram)),
	    min: Math.min.apply(Math, Object.keys(histogram)),
	    binSize: 10,
	    binOffset: 0
	};

	console.log(bin);
	if (bin.histoSize < bin.binSize)
	    return false; // no hi ha prou particions

	var totalNodes = histogram.reduce(function (x, y) {
	    return x + y;
	});
	console.log(totalNodes);
	var freqHistogram = histogram.map(function (item) {
	    return item / totalNodes;
	});
	console.log(freqHistogram);
	bin.histoProb = []
	freqHistogram.map(function (d, idx) {
	    // console.log(d, idx)
	    bin.histoProb[bin.histoProb.length] = {letter: idx, frequency: d};
	});


	// DRAW
	// var graphDiv = document.getElementById("graph");

	/*
	 var p = d3.select("#graph").selectAll("p")
	 .data(Object.keys(histogram))
	 .enter()
	 .append("p")
	 .text(function (d, i) {
	 return "i = " + i + " d = " + d;
	 });
	 */


	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	// axis
	// scaling to fit
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);
	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10, "%");

	document.getElementById("graph").innerHTML = "";

	var svg = d3.select("#graph").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	console.log(bin.histoProb);
	data = bin.histoProb;


	x.domain(data.map(function (d) {
	    return d.letter;
	}));
	y.domain([0, d3.max(data, function (d) {
		return d.frequency;
	    })]);

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
		.text("Frequency");

	svg.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function (d) {
		    return x(d.letter);
		})
		.attr("width", x.rangeBand())
		.attr("y", function (d) {
		    return y(d.frequency);
		})
		.attr("height", function (d) {
		    return height - y(d.frequency);
		});
    }
};

drawPDFDomain = function (BA, domain) {
    var path;

    path = BA.getSetting();
    if (!path)
	return path;
    var url = "../js/json/graphJSON/S" + path.size + "-D" + path.degree + ".json";


    console.log("DrawPDF/init//" + path);
    loadJSON(url, draw);
    function draw(data) {
	console.info('drawPDF');
	// codigo:	 d3
	var histogram = computeHistogramFromJSONCache(data);
	console.log(histogram);
	// target div: graphDiv

	/*
	 <div id="sectionB" class="tab-pane fade"> 
	 <div id="graph"></div>  
	 <svg class="chart" id="chart" ></svg>
	 </div>
	 */

	var bin = {
	    histo: histogram,
	    histoSize: Object.keys(histogram).length,
	    histoProb: [],
	    histoDegree: Object.keys(histogram),
	    max: Math.max.apply(Math, Object.keys(histogram)),
	    min: Math.min.apply(Math, Object.keys(histogram)),
	    binSize: domain,
	    binOffset: 0

	};

	console.log(bin);
	if (bin.histoSize < bin.binSize)
	    return false; // no hi ha prou particions

	var totalNodes = histogram.reduce(function (x, y) {
	    return x + y;
	});
	console.log(totalNodes);
	var freqHistogram = histogram.map(function (item) {
	    return item / totalNodes;
	});
	console.log(freqHistogram);
	bin.histoProb = [];
	freqHistogram.map(function (d, idx) {
	    // console.log(d, idx)
	    bin.histoProb[bin.histoProb.length] = {letter: idx, frequency: d};
	});



	// rehandle data into domain
	bin.binOffset = (bin.max - bin.min) / bin.binSize;
	console.log(bin);

	bin.binLogOffset = (bin.max - bin.min);

	var offset = 0; // ferho log scale
	var base = getBaseLog(bin.binSize, bin.binLogOffset);


	var currOffset = bin.min; // letter
	var histoDomain = [];
	for (var idx in bin.histoProb) {
	    var d = bin.histoProb[idx]; // object {letter, frequency}
	    console.log(bin.histoProb[idx]);
	    console.log(histoDomain);
	    console.log(currOffset);
	    if (d.letter >= currOffset) {
		console.log(currOffset);
		// crear nova entrada
		currOffset += Math.pow(offset, base);
		offset++;
		histoDomain[histoDomain.length] = {letter: "+" + d.letter, frequency: d.frequency};
	    } else {
		histoDomain[histoDomain.length - 1].frequency += d.frequency;
	    }

	}

	console.log(histoDomain);

	// DRAW
	// var graphDiv = document.getElementById("graph");

	/*
	 var p = d3.select("#graph").selectAll("p")
	 .data(Object.keys(histogram))
	 .enter()
	 .append("p")
	 .text(function (d, i) {
	 return "i = " + i + " d = " + d;
	 });
	 */


	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	// axis
	// scaling to fit

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	// shift to log
	//var x = d3.scale.log().range([0, width]);


	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10, "%");

	document.getElementById("graph").innerHTML = "";

	var svg = d3.select("#graph").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	console.log(bin.histoProb);
	data = histoDomain;


	x.domain(data.map(function (d) {
	    return d.letter;
	}));


	y.domain([0, d3.max(data, function (d) {
		return d.frequency;
	    })]);

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
		.text("Frequency");

	svg.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function (d) {
		    return x(d.letter);
		})
		.attr("width", x.rangeBand())
		.attr("y", function (d) {
		    return y(d.frequency);
		})
		.attr("height", function (d) {
		    return height - y(d.frequency);
		});
    }
};


/**
 * Cumulative Distributive Function
 * @param {barbasian} BA
 * @returns {undefined}
 */
drawCDFDomain = function (BA, domain) {
    var path;

    path = BA.getSetting();
    if (!path)
	return path;
    var url = "../js/json/graphJSON/S" + path.size + "-D" + path.degree + ".json";
    console.log("DrawCDF/init//" + path);
    loadJSON(url, draw);
    function draw(data) {
	console.info('drawCDF');
	var histogram = computeHistogramFromJSONCache(data);
	console.log(histogram);
	/*
	 <div id="sectionB" class="tab-pane fade"> 
	 <div id="graph"></div>  
	 <svg class="chart" id="chart" ></svg>
	 </div>
	 */

	var bin = {
	    histo: histogram,
	    histoSize: Object.keys(histogram).length,
	    histoProb: [],
	    histoDegree: Object.keys(histogram),
	    max: Math.max.apply(Math, Object.keys(histogram)),
	    min: Math.min.apply(Math, Object.keys(histogram)),
	    binSize: domain,
	    binOffset: 0

	};

	console.log(bin);
	if (bin.histoSize < bin.binSize)
	    return false; // no hi ha prou particions

	var totalNodes = histogram.reduce(function (x, y) {
	    return x + y;
	});
	console.log(totalNodes);
	var freqHistogram = histogram.map(function (item) {
	    return item / totalNodes;
	});
	console.log(freqHistogram);
	bin.histoProb = [];
	freqHistogram.map(function (d, idx) {
	    // console.log(d, idx)
	    bin.histoProb[bin.histoProb.length] = {letter: idx, frequency: d};
	});



	// rehandle data into domain
	bin.binOffset = (bin.max - bin.min) / bin.binSize;
	console.log(bin);

	bin.binLogOffset = (bin.max - bin.min);

	var offset = 0; // ferho log scale
	var base = getBaseLog(bin.binSize, bin.binLogOffset);


	var currOffset = bin.min; // letter
	var histoDomain = [];
	var frequency = 0;
	for (var idx in bin.histoProb) {
	    var d = bin.histoProb[idx]; // object {letter, frequency}
	    console.log(bin.histoProb[idx]);
	    console.log(histoDomain);
	    console.log(currOffset);
	    frequency += d.frequency;
	    if (d.letter >= currOffset) {
		console.log(currOffset);
		// crear nova entrada
		currOffset += Math.pow(offset, base);
		offset++;
		histoDomain[histoDomain.length] = {letter: "-" + d.letter, frequency: frequency};
	    } else {
		// use absolute frequency instead of relative
		histoDomain[histoDomain.length - 1].frequency = frequency;
	    }


	}



	// tenir un filter or reduce enlloc de map

	console.log(histoDomain);

	// DRAW
	// var graphDiv = document.getElementById("graph");

	/*
	 var p = d3.select("#graph").selectAll("p")
	 .data(Object.keys(histogram))
	 .enter()
	 .append("p")
	 .text(function (d, i) {
	 return "i = " + i + " d = " + d;
	 });
	 */


	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	// axis
	// scaling to fit

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	// shift to log
	//var x = d3.scale.log().range([0, width]);


	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10, "%");

	document.getElementById("graph").innerHTML = "";

	var svg = d3.select("#graph").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	console.log(bin.histoProb);
	data = histoDomain;


	x.domain(data.map(function (d) {
	    return d.letter;
	}));


	y.domain([0, d3.max(data, function (d) {
		return d.frequency;
	    })]);

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
		.text("Frequency");

	svg.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function (d) {
		    return x(d.letter);
		})
		.attr("width", x.rangeBand())
		.attr("y", function (d) {
		    return y(d.frequency);
		})
		.attr("height", function (d) {
		    return height - y(d.frequency);
		});



    }
};

// enlloc de tenir-ho aixi buscar algun 
// patro de disseny o framework que organitzi les coses

function loadJSON(url, callback) {


    $.ajax({
	dataType: "json",
	url: url, // tiene que ser un path absoluto (www.asdf), o relativo
	// data: data, // request parameters to the server...
	success: successLoad
    });

    function successLoad(data) {
	return callback(data);
    }
}




function computeHistogramFromJSONCache(data) {
    console.info('computeHistogramFromJSONCache');
    // compute frequency distribution

    var histogram = [];

    // generar una matriu, o list-linkedlist

    var tmpDegreeDist = {};
    var edgeDist = data.edges.map(function (item, idx, all) {
	//    console.log(item.target); 
	if (item.source in tmpDegreeDist) {
	    tmpDegreeDist[item.source]++;
	} else {
	    tmpDegreeDist[item.source] = 1;
	}

	if (item.target in tmpDegreeDist) {
	    tmpDegreeDist[item.target]++;
	} else {
	    tmpDegreeDist[item.target] = 1;
	}

	return item.source;
    });
    console.log(tmpDegreeDist);
    console.log(edgeDist);

    // to histogram

    var result = Object.keys(tmpDegreeDist).forEach(function (item, idx, all) {
//	console.log(item);
	if (tmpDegreeDist[item] in histogram)
	{
	    histogram[tmpDegreeDist[item]]++;
	} else {

	    histogram[tmpDegreeDist[item]] = 1;
	}
    });

    return histogram;
}








displayHistogram = function (BA) {
    document.getElementById("graph").innerHTML = "";
    plotHistogram(computeHistogram(BA));
};

displayHistogramSimple = function (BA) {
    document.getElementById("graph").innerHTML = "";
    plotSimpleBarChart(computeHistogram(BA, true));
};

/**
 * logxY
 * @param {type} x base
 * @param {type} y numero
 * @returns {Number}
 */
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}
