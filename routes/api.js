
var express = require('express');
var router = express.Router();

var sessionApi = require('../api/session');
var salesmanApi = require('../api/salesman');
var customerApi = require('../api/customer');
var companyApi = require('../api/company');
var visitApi = require('../api/visit');
var targetApi = require('../api/target');
var targetTypeApi = require('../api/targetType');
var userApi = require('../api/user');

//-----------------------------------------------------------

router.all('*', function(req, res, next) {

    console.log("=== API ===>", req.url);
    next();
});


//-----------------------------------------------------------

// Autoload de parametros
router.param('userId',     userApi.load);
router.param('salesmanId', salesmanApi.load);
router.param('customerId', customerApi.load);
router.param('visitId',    visitApi.load);

//-----------------------------------------------------------


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

router.get('/customers/:customerId(\\d+)/visits',
    sessionApi.loginRequired,
    visitApi.index);

router.get('/salesmen/:salesmanId(\\d+)/visits',
    sessionApi.loginRequired,
    visitApi.index);

router.get('/salesmen/:salesmanId(\\d+)/customers/:customerId(\\d+)/visits',
    sessionApi.loginRequired,
    visitApi.index);

router.get('/users/:userId(\\d+)/visits',
    sessionApi.loginRequired,
    visitApi.indexUser);

router.get('/users/logged/visits',
    sessionApi.loginRequired,
    visitApi.indexLoggedUser);


router.put('/visits/:visitId(\\d+)',
    sessionApi.loginRequired,
    visitApi.salesmanIsLoggedUser_Required,
    visitApi.update);


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

