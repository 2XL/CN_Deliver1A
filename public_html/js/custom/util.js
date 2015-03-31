"use strict";
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// ADAPTER

var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;
var BrowserSupportedMimeTypes = {
    "image/jpeg": true,
    "image/png": true,
    "image/gif": true,
    "image/svg+xml": true,
    "image/bmp": true,
    "image/x-windows-bmp": true,
    "image/webp": true,
    "audio/wav": true,
    "audio/mpeg": true,
    "audio/webm": true,
    "audio/ogg": true,
    "video/mpeg": true,
    "video/webm": true,
    "video/ogg": true,
    "text/plain": true,
    "text/html": true,
    "text/xml": true,
    "application/xhtml+xml": true,
    "application/json": true
};

function functionName(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}

function createRadioElement(name, checked) {
    var radioHtml = '<input type="radio" name="' + name + '"';
    if (checked) {
	radioHtml += ' checked="checked"';
    }
    radioHtml += '/>';

    var radioFragment = document.createElement('div');
    radioFragment.innerHTML = radioHtml;

    return radioFragment.firstChild;
}

function cleanArray(arr) {
    return arr.filter(function (n) {
	return n !== undefined;
    });
}


function stackToJSON(stack) {
    var jsonStack;
    var size = stack.length;

    // declarar skeleton
    var jsonStack = {
	nodes: [],
	edges: []
    };
    var edgeIdx = 0;
    stack.forEach(function (item, idx, all) {

	var size = item.lenVertex();
	var node = {
	    id: "n" + item.id,
	    label: "l" + idx,
	    size: size  // 1 | vertex.length
	};

	jsonStack.nodes.push(node);
	var sourceId = "n" + item.id;

// por cada vertice del nodo añadir un edge en el json outputStack
//	console.log(item);


	for (var key in item.vertexIn) {
	    var node = item.vertexIn[key];
	    var targetId = "n" + node.id;
	    var edge = {
		id: String(edgeIdx++), // concatenar los offsets con espacios de relleno
		source: sourceId,
		target: targetId
	    };
	    jsonStack.edges.push(edge);
	}
	;

    });
    // omplir el stkeleton
    return jsonStack;
}

function indexOf(needle) {
    if (typeof Array.prototype.indexOf === 'function') {
	indexOf = Array.prototype.indexOf;
    } else {
	indexOf = function (needle) {
	    var i = -1, index = -1;

	    for (i = 0; i < this.length; i++) {
		if (this[i] === needle) {
		    index = i;
		    break;
		}
	    }
	    return index;
	};
    }

    return indexOf.call(this, needle);
}



/* saving json string to client pc using HTML5 API */

function downloadJSON(dataJSON, nameDownload) {
    var strJSON = JSON.stringify(dataJSON);

    var blob = new Blob([strJSON], {type: "application/json"});

    saveAs(blob, nameDownload);
    //var url = URL.createObjectURL(blob);
    //  window.open(url, "downloadJSON.json");

}

/* 
 * saving a file with FileSaver.js
 */