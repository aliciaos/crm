
var express = require('express');
var router = express.Router();

var tokenApi = require('../api/token');
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

// El token de acceso es necesario para todas las llamadas.
router.all('*', tokenApi.tokenRequired);

//-----------------------------------------------------------

// Autoload de parametros
router.param('userId',     userApi.load);
router.param('salesmanId', salesmanApi.load);
router.param('customerId', customerApi.load);
router.param('visitId',    visitApi.load);
router.param('targetId',   targetApi.load);

//-----------------------------------------------------------

// Definicion de rutas para los vendedores
router.get('/salesmen',
    salesmanApi.index);


// Definicion de rutas para los clientes
router.get('/customers',
    customerApi.index);


// Definicion de rutas para las fabricas
router.get('/companies',
    companyApi.index);


// Definicion de rutas para las visitas
router.get('/visits',
    visitApi.index);

router.get('/customers/:customerId(\\d+)/visits',
    visitApi.index);

router.get('/salesmen/:salesmanId(\\d+)/visits',
    visitApi.index);

router.get('/salesmen/:salesmanId(\\d+)/customers/:customerId(\\d+)/visits',
    visitApi.index);

router.get('/users/:userId(\\d+)/visits',
    visitApi.indexUser);

router.get('/users/logged/visits',
    visitApi.indexLoggedUser);


router.put('/visits/:visitId(\\d+)',
    visitApi.salesmanIsLoggedUser_Required,
    visitApi.update);


router.put('/visits/:visitId(\\d+)/targets/:targetId(\\d+)',
    visitApi.salesmanIsLoggedUser_Required,
    targetApi.update);


// Definicion de rutas para los objetivos de todas las visitas
router.get('/targets',
    targetApi.index);


// Definicion de rutas para los tipos de objetivo
router.get('/targetTypes',
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

