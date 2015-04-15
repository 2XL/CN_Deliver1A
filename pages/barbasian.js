"use strict";
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * 
 
 * @returns {barbasian}
 */
function barbasian() {

    console.log("barbasian.js/loading...");

    /* start setting variables */
    /**************************************************************************/
    // stack of everything?
    var stats = {
	data: {},
	stack: []
    };

    var config = {
	size: 1000,
	degree: 6,
	seed: 10,
    };

    /* 
     * @param {type} size: number of nodes 
     * @param {type} degree: avg amount of edges = total(#edges)/total(#num)
     */
    // vincular aixo amb un onclick o listener per actualizar el valor 
    // de configuracio y posteriorment actualitzar el graf
    var degree = 6;
    var size = 5;
    // var m = degree / 2;	// 3

    /* start user interface */
    /**************************************************************************/

    var nwkSize = [50, 100, 1000, 10000, 100000];	// opcions per el selector
    var avgDegree = [2, 4, 6, 8];
    console.log("0.	Start the configuration selectors...");

    var radioSize = document.getElementById("radioSize");
    var radioDegree = document.getElementById("radioDegree");

// hack everything with Jquery
    var radioSizeLabel = $('');
    var radioSizeBtn = $('');
    nwkSize.forEach(function (value, idx) {
	radioSizeBtn = $('<input type="radio" name="nwkSize" id="radioSizeId' + idx + '" value=' + value + ' />');
	radioSizeBtn.appendTo('#radioSize');
	radioSizeLabel = $('<label for="radioSizeId' + idx + '">' + value + '</label><br>');
	radioSizeLabel.appendTo('#radioSize');
    });

// hack everything with Jquery
    var radioDegreeLabel = $('');
    var radioDegreeBtn = $('');
    avgDegree.forEach(function (value, idx) {
	radioDegreeBtn = $('<input type="radio" name="avgDegree" id="radioDegreeId' + idx + '" value=' + value + ' />');
	radioDegreeBtn.appendTo('#radioDegree');
	radioDegreeLabel = $('<label for="radioDegreeId' + idx + '">' + value + '</label><br>');
	radioDegreeLabel.appendTo('#radioDegree');
    });


// select dafault settings
    var defaultSize = 1;
    var defaultDegree = 1;

    document.getElementById('radioSizeId' + defaultSize).checked = true;
    document.getElementById('radioDegreeId' + defaultDegree).checked = true;
//    


    console.log("1. Inject the content in the content div...");

// propose an datastructure once the setting is done


    /* auxiliary functions */
    /**************************************************************************/

    function node(id) {
	this.id = id;
	// this.vertex = {};    // vertex are nodes
	// keyvalue search instead of an array
	this.vertexIn = {};
	this.vertexOut = {};


	this.putVertex = function (n, forceIn) {
	    //  console.log(this);
	    //  console.log(n);
	    if (forceIn === undefined) {
		if (this.id === n.id)
		    return false;
		if (this.vertexOut[n.id] === undefined) {
		    this.vertexOut[n.id] = n;
		    n.putVertex(this, true);
		    return true;
		} else {
		    return false;
		}
	    } else {
		this.vertexIn[n.id] = n;
	    }
	};


	// nodes are nodes and vertex are nodes...
	this.lenVertexIn = function () {
	    return Object.keys(this.vertexIn).length;
	};

	this.lenVertexOut = function () {
	    return Object.keys(this.vertexOut).length;
	};

	this.lenVertex = function () {
	    return Object.keys(this.vertexIn).length + Object.keys(this.vertexOut).length;
	};

	this.getId = function () {
	    return this.id;
	};

    }

    function addAxisToNodes(jsonObject) {
	jsonObject.nodes.forEach(function (node, i, a) {
	    node.x = Math.cos(Math.PI * 2 * i / a.length);
	    node.y = Math.sin(Math.PI * 2 * i / a.length);
	});
	return jsonObject;
    }

    function initSeeding(size) {
	var seed = [];
	var n;
	for (var i = 0; i < size; i++) {
	    n = new node(i);
	    seed.push(n);
	}
	console.log(seed);

	seed.map(function (next) {
	    console.log("This is the next: " + next);
	    seed.forEach(function (n) {
		//	console.log("Putted: " + next.getId() + " to " + n.getId());
		next.putVertex(n);
	    });

	});
	return seed;
    }
    ;

    /* class methods */
    /**************************************************************************/

    this.getStats = function () {
	return stats;
    };

// plot from jsonFile
    this.plotStackJsonPath = function (jsonPath) {
	console.log("plotStackPath");
	// signals : namespace
	// store loval reference for brevety

	sigma.parsers.json(jsonPath, {
	    container: 'container',
	    settings: {
		defaultNodeColor: '#ec5148'
	    }
	}
	);

    };


// plot from Object
    this.plotStackJsonObject = function (jsonObject) {
	document.getElementById("container").innerHTML = "";
	var s = new sigma({
	    graph: jsonObject,
	    container: 'container',
	    settings: {
		defaultNodeColor: '#ec5148'
	    }
	});

    };

    /* visualisation methods */
    /**************************************************************************/

    this.init = function (size, degree, plot) {
	console.log("init/ini");
	var stack = [];
	var m = degree / 2;
	// represent an array of size ( size ) of nodes and each node is of degree x


// initial seed of nodes
	var stackSeed = initSeeding(config.seed);


	//   console.log(stackSeed);
	stackSeed.forEach(function (elem) {
	    stack.push(elem);
	});
	// console.log(stack);
	// TODO - stack with seed now add the remaining nodes


	var steps;
	var n;
	var start = stack.length; // 1st id = 5
	var tableTest = [];
	var table = []; // ck
	var tableIdx = 0;
	var first = true;
	for (var i = start; i < size; i++) {

	    // invoke a node
	    n = new node(i);

	    // calculate the probability matrix
	    // fer un array amb 1000 posicions i ficar l'id del node de manera consecutiva 
	    // compensar espai per computacio... 

// this should be refactored instead of having to recalculate everything
// use dynamic append in the table...

	    if (first) {
		var nextInterval; // total amount of vertex
		stack.forEach(function (item, idx, all) {
		    nextInterval = item.lenVertexOut(); // NONE EFFICIENT
		    while (nextInterval > 0) {
			table[tableIdx] = item.id;
			tableIdx++;
			nextInterval--;
		    }
		});

		tableTest = table;
		first = false;
	    } else {

	    }

	    /*
	     console.log("INI... orig ->");
	     console.log(tableIdx);
	     console.log(table);
	     console.log(tableTest.length);
	     console.log(tableTest);
	     console.log("<- test ...FIN");
	     // push node as other node vertex
	     */
	    tableIdx = tableTest.length;
	    steps = degree;
	    var list = [];
	    var listCand = [];
	    while (steps > 0) {
		// generate random within interval
		// check if that node already has use
		var candIdx = Math.floor((Math.random() * tableIdx));
		var cand = table[candIdx];

		if (list.indexOf(cand) === -1)
		{
		    listCand.push(candIdx);
		    var targetNode = stack[cand];

		    list.push(cand);
		    n.putVertex(targetNode);
		    // targetNode.putVertex(n);
		    // vincular vertices
		    // add source vertex,
		    // add target vertex,
		    steps--;
		} else {
		    //  console.log("skip");
		}
	    }

	    // push node to stack
	    var candIdx;
	    //    console.log(listCand);
	    for (var key in listCand) {
		candIdx = tableTest[listCand[key]];
		//	console.log(candIdx);
		tableTest.splice(listCand[key], 0, candIdx);
		tableTest.push(n.id);
	    }

	    stack.push(n);
	}


	// console.log(stack);
	// draw the current stack with the library provided... etc...
	var data = stackToJSON(stack);
//	console.log(data);
	// if true plot it asking the axis
	if (plot) {
	    data = addAxisToNodes(data);
//	console.log(data);
	    this.plotStackJsonObject(data);

	    stats = {
		data: data,
		stack: stack
	    };
	    console.log("init/end");
	} else { // otherwise retrieve the data for a data handler
	    return data;
	}
    };

    this.replot = function () {

	// generate index and weights


	var setting = this.getSetting();

	if (setting === false) {
	    console.log("Setting incomplete...");
	} else {

	    this.init(setting.size, setting.degree, true);
	    // check them from the domElements , only call if both are defined

	}

    };

    this.getSetting = function () {

	var sizeRadio;
	var degreeRadio;
	// get the default constraints
	if ($('input[name=nwkSize]:checked').length > 0) {
	    // collect the value
	    sizeRadio = $('input[name=nwkSize]:checked').val();
	}
	;

	if ($('input[name=avgDegree]:checked').length > 0) {
	    // collect the value
	    degreeRadio = $('input[name=avgDegree]:checked').val();
	}
	;

	if (degreeRadio === undefined || sizeRadio === undefined) {
	    console.log("somehting went wrong...");
	    console.info("degr: " + degreeRadio);
	    console.info("size: " + sizeRadio);
	} else {
	    console.log("replotable!!!");
	    console.info("degr: " + degreeRadio);
	    console.info("size: " + sizeRadio);
	    console.log("refresh");
	    return {degree: degreeRadio, size: sizeRadio};
	}

	return false;
    };


    this.exportJSON = function () {
	console.info("Export JSON");
	var setting = this.getSetting();

	if (setting === false) {
	    console.log("Setting incomplete...");
	} else {

	    var data = this.init(setting.size, setting.degree);
	    // check them from the domElements , only call if both are defined
	    downloadJSON(data, "S" + setting.size + "-D" + setting.degree + ".json");
	}

    };

    this.exportPAJEK = function () {
	console.info("export PAJEK");
	var setting = this.getSetting();

	if (setting === false) {
	    console.log("Setting incomplete...");
	} else {

	    var data = this.init(setting.size, setting.degree);
	    // check them from the domElements , only call if both are defined
	    JSON2Pajek(data, "S" + setting.size + "-D" + setting.degree + ".net"); // .NET
	}
    };

    console.log("barbasian.js/loaded ¿!");

    this.init(config.seed, config.degree, true);

    this.showExponents = function () {
	var msg = "unknown";

	var path;

	path = this.getSetting();
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
		max: Math.max.apply(Math, Object.keys(histogram)), // 1 kmax
		min: Math.min.apply(Math, Object.keys(histogram)), // 1 kmin
		binSize: 10,
		binOffset: 0
	    };



	    // log of ki
	    // 1: find Kmin & Kmax
	    var output = {
		klen: bin.histoDegree,
		kmin: bin.min,
		kmax: bin.max,
		klog: [],
		knum: [],
		kinterv: [],
		kfreq: []
	    };

	    // 2: calculate the logarithm of Ki for all the data elements

	    var totalNodes = 0;
	    histogram.map(function (item) {
		totalNodes += item;
	    });

	    console.log(totalNodes);

	    var logPk;
	    var logk;
	    var logC;
	    for (var key in histogram) {
		logPk = Math.log(histogram[key] / totalNodes);
		logC = Math.log(histogram[key]) // població obtinguda
		logk = Math.log(key);

		output.klog[key] = (logC - logPk) / logk;
	    }
	    console.log(output.klog);

	    // 3, 4: converse the interval into 10 offset





	    document.getElementById("graph").innerHTML = "";
	    document.getElementById("graph")
		    .appendChild(document.createElement('pre'))
		    .innerHTML = syntaxHighlight({powexp: output.klog}); 

	}
    };

}
 

// plot the ****