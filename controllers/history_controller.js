
var URL = require('url');

// Middlewares

exports.set = function(req, res, next) {

	req.session.history = [req.url];
	dump(req.session.history);
	next();
};


exports.skip = function(req, res, next) {
	next();
}


exports.push = function(req, res, next) {

	req.session.history = req.session.history || [];

	var url0 = req.session.history.slice(-1)[0] || "";
	var path0 = URL.parse(url0).pathname;

	var path1 = URL.parse(req.url).pathname;

	if (path0 === path1) {
		req.session.history.pop()
	}

	req.session.history.push(req.url);

	dump(req.session.history);

	next();
};



exports.goBack = function(req, res, next) {

	req.session.history = req.session.history || [];

	req.session.history.pop();
	var url = req.session.history.pop() || "/";
	res.redirect(url);
};



exports.reload = function(req, res, next) {

	req.session.history = req.session.history || [];

	var url = req.session.history.pop() || "/";
	res.redirect(url);
};


function dump(history) {

	console.log("-->> HISTORY");

	history.forEach(function(url, i) {
		console.log("  -->> ",i,"=",url);
	});
};



