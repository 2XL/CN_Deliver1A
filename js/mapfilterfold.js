/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

var forEach = function (obj, iterator) {
    for (var i = 0, l = obj.length; i < l; i += 1) {
	iterator.call(this, obj[i]);  // el this no l'entenc i el call tampoc
	// call acepta un array o lista de argumentos mientras que aply solo 1
    }
};


var forEach = function (obj, iterator, thisArg) {

    // check to see if we're working with an array
    if (obj.length === +obj.length) {
	for (var i = 0, l = obj.length; i < l; i += 1) {
	    iterator.call(thisArg, obj[i]);
	}

	// otherwise iterate over an object
    } else {
	for (var key in obj) {
	    if (obj.hasOwnProperty(key)) {
		iterator.call(thisArg, obj[key]);
	    }
	}
    }
};


var forEach = function (obj, iterator, thisArg) {

    // test for native forEach support
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
	obj.forEach(iterator, thisArg);

	// arrays
    } else if (obj.length === +obj.length) {
	for (var i = 0, l = obj.length; i < l; i += 1) {
	    iterator.call(thisArg, obj[i]);
	}

	// objects
    } else {
	for (var key in obj) {
	    if (obj.hasOwnProperty(key)) {
		iterator.call(thisArg, obj[key]);
	    }
	}
    }
};




//--------------------------------------------------------------------------


var map = function (obj, iterator, thisArg) {

    // prepare the result variable
    var result = [];

    // pass control to native map if it's available
    if (Array.prototype.map && obj.map === Array.prototype.map) {
	return obj.map(iterator, thisArg);
    }

    // otherwise, use our version of map
    forEach(obj, function (value, index, list) {
	// push the value returned from the iterator onto result
	result[result.length] = iterator.call(thisArg, value, index, list);
    });

    // return the new updated array
    return result;
};

// make an array of dollar values
var someDollars = [2.5, 10, 50, 1];

// build a conversion function
var toCents = function (n) {
    return n * 100;
};

// output an array of value in cents
var someCents = map(someDollars, toCents); // nice and easy to read
// == [250, 1000, 5000, 100]


//-----------------------------------------------------------------

var filter = function (obj, iterator, thisArg) {

    // prepare the result variable
    var result = [];

    // pass control to the native filter if it's available
    if (Array.prototype.filter && obj.filter === Array.prototype.filter) {
	return obj.filter(iterator, thisArg);
    }

    // otherwise use our own filter
    forEach(obj, function (value, index, list) {

	// if the result of passing a value through the function
	// is true, then add that value you to the new list
	if (iterator.call(thisArg, value, index, list)) {
	    result[result.length] = value;
	}
    });

    // return the new list
    return result;
};



// make an array of values to filter
var someArray = ["Large", 20, "100", 4];

// make a function that returns true if its argument is a number
var isNumber = function (x) {
    return typeof x === 'number';
};

// output a filtered array
var filteredArray = filter(someArray, isNumber);
// == [20, 4]


//------------------------------------------------------------------

var foldl = function (obj, iterator, accu, thisArg) {

    // set a variable that tells us if an accumulator was set
    var hasAccu = arguments.length > 2;

    // pass control to the native foldl if it's available
    if ((Array.prototype.reduce && obj.reduce === (Array.prototype.reduce))) {
	// if accumulator present, pass it
	return hasAccu ? obj.reduce(iterator, accu) : obj.reduce(iterator);
    }

    // otherwise use our own definition of foldl
    forEach(obj, function (value, index, list) {

	// set the accu to the first value, if accu wasn't 
	// supplied as an argument
	if (!hasAccu) {
	    accu = value;
	    hasAccu = true;
	} else {
	    accu = iterator.call(thisArg, accu, value, index, list);
	}
    });

    // return the final value of our accumulator
    return accu;
};

// set an array of values to get the sum of
var someArray = [1, 10, 100];

// define an add function
var add = function (x, y) {
    return x + y;
};

// output the sum of someArray
var foldedArray = foldl(someArray, add); // 111
var foldedArray = foldl(someArray, add, 1000); //1111
// 1111