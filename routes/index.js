var express = require('express');
var router = express.Router();

var multer  = require('multer');
var upload = multer({ dest: './uploads/' });

var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');

var companyController = require('../controllers/company_controller');
var salesmanController = require('../controllers/salesman_controller');
var customerController = require('../controllers/customer_controller');
var targettypeController = require('../controllers/targettype_controller');
var visitController = require('../controllers/visit_controller');
var targetController = require('../controllers/target_controller');
var reportController = require('../controllers/report_controller');
var favouriteController = require('../controllers/favourite_controller');
var trashController = require('../controllers/trash_controller');

var hc = require('../controllers/history_controller');

//-----------------------------------------------------------

// autologout
router.all('*',sessionController.deleteExpiredUserSession);

//-----------------------------------------------------------

// Autoload de parametros
router.param('userId', userController.load);
router.param('companyId', companyController.load);  
router.param('salesmanId', salesmanController.load);  
router.param('customerId', customerController.load);    
router.param('targettypeId', targettypeController.load);    
router.param('visitId', visitController.load);    
router.param('targetId', targetController.load);    


//-----------------------------------------------------------

// History

router.get('/goback', hc.goBack);
router.get('/reload', hc.reload);

// Rutas que no acaban en /new, /edit, /import, /session
// Y tampoco es /
router.get(/(?!\/new$|\/edit$|\/import$|\/session$)\/[^\/]+$/, hc.push);

// Rutas que acaban en /new, /edit, /import o /session
router.get(/.*\/(new|edit|import|session)$/, hc.skip);

// Ruta Home
router.get('/', hc.reset);

// La saco de la historia porque hace una redireccion a otro sitio.
router.get('/users/:userId(\\d+)/visits', hc.pop);

//-----------------------------------------------------------



// GET home page.
router.get('/', function (req, res, next) {
        res.render('index');
    }
);


// Definición de rutas de sesion
router.get('/session',
	sessionController.new);     // formulario login
router.post('/session',
	sessionController.create);  // crear sesión
router.delete('/session',
	sessionController.destroy); // destruir sesión


// Definición de rutas de cuentas
router.get('/users',
    sessionController.loginRequired,
    userController.index);   // listado usuarios
router.get('/users/:userId(\\d+)',
    sessionController.loginRequired,
    userController.show);    // ver un usuario

router.get('/users/new',
    sessionController.loginRequired,
    userController.new);     // formulario crear usuario
router.post('/users',
    sessionController.loginRequired,
    userController.create);     // registrar usuario
router.get('/users/:userId(\\d+)/edit',
    sessionController.loginRequired,
    sessionController.adminOrMyselfRequired,
    userController.edit);     // editar información de cuenta
router.put('/users/:userId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminOrMyselfRequired,
    userController.update);   // actualizar información de cuenta
router.delete('/users/:userId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminAndNotMyselfRequired,
    userController.destroy);  // borrar cuenta


// Definicion de rutas para las fabricas
router.get('/companies',
    sessionController.loginRequired,
    companyController.index);
router.get('/companies/:companyId(\\d+)',
    sessionController.loginRequired,
    companyController.show);
router.get('/companies/new',
    sessionController.loginRequired,
    sessionController.adminRequired,
    companyController.new);
router.post('/companies',
    sessionController.loginRequired,
    sessionController.adminRequired,
    companyController.create);
router.get('/companies/:companyId(\\d+)/edit',
    sessionController.loginRequired,
    sessionController.adminRequired,
    companyController.edit);
router.put('/companies/:companyId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminRequired,
    companyController.update);
router.delete('/companies/:companyId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminRequired,
    companyController.destroy);

router.get('/companies/:companyId(\\d+)/statistics',
    sessionController.loginRequired,
    companyController.statistics);


router.get('/companies/:companyId(\\d+)/visits/new',
    sessionController.loginRequired,
    companyController.visitsNew);
router.post('/companies/:companyId(\\d+)/visits',
    sessionController.loginRequired,
    companyController.visitsCreate);



// Definicion de rutas para los vendedores
router.get('/salesmen',
    sessionController.loginRequired,
    sessionController.adminRequired,
    salesmanController.index);
router.get('/salesmen/:salesmanId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminRequired,
    salesmanController.show);
router.get('/salesmen/new',
    sessionController.loginRequired,
    sessionController.adminRequired,
    salesmanController.new);
router.post('/salesmen',
	sessionController.loginRequired,
    sessionController.adminRequired,
    upload.single('photo'),
    salesmanController.create);
router.get('/salesmen/:salesmanId(\\d+)/edit',
    sessionController.loginRequired,
    sessionController.adminRequired,
    salesmanController.edit);
router.put('/salesmen/:salesmanId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminRequired,
    upload.single('photo'),
    salesmanController.update);
router.delete('/salesmen/:salesmanId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminRequired,
    salesmanController.destroy);


// Definicion de rutas para los clientes
router.get('/customers',
    sessionController.loginRequired,
    customerController.index);
router.get('/customers/:customerId(\\d+)',
    sessionController.loginRequired,
    customerController.show);
router.get('/customers/new',
    sessionController.loginRequired,
    sessionController.adminRequired,
    customerController.new);
router.post('/customers',
    sessionController.loginRequired,
    sessionController.adminRequired,
    customerController.create);
router.get('/customers/:customerId(\\d+)/edit',
    sessionController.loginRequired,
    sessionController.adminRequired,
    customerController.edit);
router.put('/customers/:customerId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminRequired,
    customerController.update);
router.delete('/customers/:customerId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminRequired,
    customerController.destroy);


router.get('/customers/import',
    sessionController.loginRequired,
    sessionController.adminRequired,
    customerController.importForm);
router.post('/customers/import',
    sessionController.loginRequired,
    sessionController.adminRequired,
    upload.single('csv'),
    customerController.importPost);


// Definicion de rutas para los tipos de objetivos
router.get('/targettypes',
    sessionController.loginRequired,
    sessionController.adminRequired,
    targettypeController.index);
router.get('/targettypes/:targettypeId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminRequired,
    targettypeController.show);
router.get('/targettypes/new',
    sessionController.loginRequired,
    sessionController.adminRequired,
    targettypeController.new);
router.post('/targettypes',
    sessionController.loginRequired,
    sessionController.adminRequired,
    targettypeController.create);
router.get('/targettypes/:targettypeId(\\d+)/edit',
    sessionController.loginRequired,
    sessionController.adminRequired,
    targettypeController.edit);
router.put('/targettypes/:targettypeId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminRequired,
    targettypeController.update);
router.delete('/targettypes/:targettypeId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminRequired,
    targettypeController.destroy);



// Definicion de rutas para los objetivos de las visitas
router.get(   '/visits/:visitId(\\d+)/targets',
    sessionController.loginRequired,
    visitController.admin_Or_NoSalesman_Or_SalesmanIsLoggedUser_Required,
    targetController.index);
router.get('/visits/:visitId(\\d+)/targets/:targetId(\\d+)',
    sessionController.loginRequired,
    visitController.admin_Or_NoSalesman_Or_SalesmanIsLoggedUser_Required,
    targetController.show);
router.get('/visits/:visitId(\\d+)/targets/new',
    sessionController.loginRequired,
    visitController.admin_Or_NoSalesman_Or_SalesmanIsLoggedUser_Required,
    targetController.new);
router.post('/visits/:visitId(\\d+)/targets',
    sessionController.loginRequired,
    visitController.admin_Or_NoSalesman_Or_SalesmanIsLoggedUser_Required,
    targetController.create);
router.get('/visits/:visitId(\\d+)/targets/:targetId(\\d+)/edit',
    sessionController.loginRequired,
    visitController.admin_Or_NoSalesman_Or_SalesmanIsLoggedUser_Required,
    targetController.edit);
router.put('/visits/:visitId(\\d+)/targets/:targetId(\\d+)',
    sessionController.loginRequired,
    visitController.admin_Or_NoSalesman_Or_SalesmanIsLoggedUser_Required,
    targetController.update);
router.delete('/visits/:visitId(\\d+)/targets/:targetId(\\d+)',
    sessionController.loginRequired,
    visitController.admin_Or_NoSalesman_Or_SalesmanIsLoggedUser_Required,
    targetController.destroy);



// Definicion de rutas para las visitas
router.get('/visits',
    sessionController.loginRequired,
    visitController.index);
router.get('/visits/:visitId(\\d+)',
    sessionController.loginRequired,
    visitController.show);
router.get('/visits/new',
    sessionController.loginRequired,
    visitController.new);
router.post('/visits',
	sessionController.loginRequired,
    visitController.create);
router.get('/visits/:visitId(\\d+)/edit',
    sessionController.loginRequired,
    visitController.admin_Or_NoSalesman_Or_SalesmanIsLoggedUser_Required,
    visitController.edit);
router.put('/visits/:visitId(\\d+)',
	sessionController.loginRequired,
    visitController.admin_Or_NoSalesman_Or_SalesmanIsLoggedUser_Required,
    visitController.update);
router.delete('/visits/:visitId(\\d+)',
	sessionController.loginRequired,
    sessionController.adminRequired,
    visitController.destroy);


router.get('/customers/:customerId(\\d+)/visits',
    sessionController.loginRequired,
    visitController.index);

router.get('/salesmen/:salesmanId(\\d+)/visits',
    sessionController.loginRequired,
    visitController.index);

router.get('/salesmen/:salesmanId(\\d+)/customers/:customerId(\\d+)/visits',
    sessionController.loginRequired,
    visitController.index);

router.get('/users/:userId(\\d+)/visits',
    sessionController.loginRequired,
    visitController.indexUser);


// Definicion de rutas para los informes
router.get('/reports',
    reportController.index);


// Rutas de Favoritos
router.put('/users/:userId([0-9]+)/favourites/:visitId(\\d+)',
	sessionController.loginRequired,
    sessionController.adminOrMyselfRequired,
    favouriteController.add);

router.delete('/users/:userId([0-9]+)/favourites/:visitId(\\d+)',
	sessionController.loginRequired,
    sessionController.adminOrMyselfRequired,
    favouriteController.del);


//----------------------------------------------------
//  Papelera de Reciclaje
// ----------------------------------------------------

// Listar contenido de la Papelera de Reciclaje
router.get('/trash',
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.index);


router.get("/trash/customers",
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.customers);
router.delete('/trash/customers/:customerId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.customerDestroy);
router.post('/trash/customers/:customerId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.customerRestore);


router.get("/trash/visits",
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.visits);
router.delete('/trash/visits/:visitId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.visitDestroy);
router.post('/trash/visits/:visitId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.visitRestore);


router.get("/trash/companies",
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.companies);
router.delete('/trash/companies/:companyId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.companyDestroy);
router.post('/trash/companies/:companyId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.companyRestore);


router.get("/trash/salesmen",
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.salesmen);
router.delete('/trash/salesmen/:salesmanId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.salesmanDestroy);
router.post('/trash/salesmen/:salesmanId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.salesmanRestore);


router.get("/trash/targettypes",
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.targettypes);
router.delete('/trash/targettypes/:targettypeId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.targettypeDestroy);
router.post('/trash/targettypes/:targettypeId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.targettypeRestore);


router.get("/trash/users",
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.users);
router.delete('/trash/users/:userId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.userDestroy);
router.post('/trash/users/:userId_wal(\\d+)',   // wal = without auto loading
    sessionController.loginRequired,
    sessionController.adminRequired,
    trashController.userRestore);

//----------------------------------------------------


module.exports = router;
