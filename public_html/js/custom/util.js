"use strict";
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 

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
	

	for(var key in item.vertexIn){
	    var node = item.vertexIn[key];
	    var targetId = "n" + node.id;
	    var edge = {
		id: String(edgeIdx++), // concatenar los offsets con espacios de relleno
		source: sourceId,
		target: targetId
	    };
	    jsonStack.edges.push(edge);   
	};

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
;