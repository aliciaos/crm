
var express = require('express');
var router = express.Router();

var sessionApi = require('../api/session');
var salesmanApi = require('../api/salesman');
var customerApi = require('../api/customer');
var companyApi = require('../api/company');
var visitApi = require('../api/visit');
var targetApi = require('../api/target');
var targetTypeApi = require('../api/targetType');


//-----------------------------------------------------------

router.all('*', function(req, res, next) {

    console.log("=== API ===>", req.url);
    next();
});


// Definición de rutas de sesion
router.post('/session',
    sessionApi.create);  // crear sesión
router.delete('/session',
    sessionApi.destroy); // destruir sesión


// Definicion de rutas para los vendedores
router.get('/salesmen',
    sessionApi.loginRequired,
    salesmanApi.index);


// Definicion de rutas para los clientes
router.get('/customers',
    sessionApi.loginRequired,
    customerApi.index);


// Definicion de rutas para las fabricas
router.get('/companies',
    sessionApi.loginRequired,
    companyApi.index);


// Definicion de rutas para las visitas
router.get('/visits',
    sessionApi.loginRequired,
    visitApi.index);

// Definicion de rutas para los objetivos de todas las visitas
router.get(   '/targets',
    sessionApi.loginRequired,
    targetApi.index);


// Definicion de rutas para los tipos de objetivo
router.get(   '/targetTypes',
    sessionApi.loginRequired,
    targetTypeApi.index);

//-----------------------------------------------------------

// Si llego aqui, la ruta pedida no esta soportada.
router.all('*', function(req, res, next) {

    var err = new Error('Ruta API no encontrada');
    err.status = 404;
    next(err);
});

//----------------------------------------------------

module.exports = router;

//-----------------------------------------------------------

