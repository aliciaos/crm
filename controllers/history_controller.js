

var express = require('express');
var router = express.Router();

var URL = require('url');

const HISTORY_SIZE = 20;

// Middlewares

function push(req, res, next) {

	req.session.history = req.session.history || [];

	var url0 = req.session.history.slice(-1)[0] || "";
	var path0 = URL.parse(url0).pathname;

	var path1 = URL.parse(req.url).pathname;

	// Reset
	if (path1 === "/") {
        req.session.history = [];
	}

	// Eliminar duplicados seguidos
	if (path0 === path1) {
		req.session.history.pop()
	}

	req.session.history.push(req.url);

	// Limitar tamaño de la historia
    req.session.history = req.session.history.slice(-HISTORY_SIZE);

	dump(req.session.history);

	next();
};


function goBack(req, res, next) {

	req.session.history = req.session.history || [];

	req.session.history.pop();
	var url = req.session.history.pop() || "/";
	res.redirect(url);
};


function reload(req, res, next) {

	req.session.history = req.session.history || [];

	var url = req.session.history.pop() || "/";
	res.redirect(url);
};

function reset(req, res, next) {

    req.session.history = ["/"];
    dump(req.session.history);
    next();
};

function dump(history) {

	console.log("-->> HISTORY");

	history.forEach(function(url, i) {
		console.log("  -->> ",i,"=",url);
	});
};


router.get('/goback', goBack);
router.get('/reload', reload);

router.get('*', push);

module.exports = {
	router: router,
	reset: reset
};

