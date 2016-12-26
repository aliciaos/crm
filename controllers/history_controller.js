
var URL = require('url');

var history = [];

// Middlewares


/*
exports.clear = function(req, res, next) {
	history = [];
	dump();
	next();
};
*/

exports.set = function(req, res, next) {

	history = [req.url];
	dump();
	next();
};


/*
exports.pop = function() {

	return history.pop();
};
*/

/*
exports.skip = function(req, res, next) {
	next();
}
*/

exports.push = function(req, res, next) {

	var url0 = history.slice(-1)[0] || "";
	var path0 = URL.parse(url0).pathname;

	var path1 = URL.parse(req.url).pathname;

	if (path0 === path1) {
		history.pop()
	}

	history.push(req.url);

	dump();

	next();
};



exports.goBack = function(req, res, next) {

	history.pop();
	var url = history.pop() || "/";
	res.redirect(url);
};



exports.reload = function(req, res, next) {

	var url = history.pop() || "/";
	res.redirect(url);
};

/*
// Consultas:


exports.top = function() {

	return history.slice(-1);
};



exports.isThereBack = function() {

	return history.slice(-2)[0] || "";
};
*/

function dump() {

	console.log("-->> HISTORY");

	history.forEach(function(url, i) {
		console.log("  -->> ",i,"=",url);
	});
};



