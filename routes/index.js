var express = require('express');
var router = express.Router();

var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');

var companyController = require('../controllers/company_controller');
var salesmanController = require('../controllers/salesman_controller');

// var reportController = require('../controllers/report_controller');
// var diagnoseController = require('../controllers/diagnose_controller');
// var patientController = require('../controllers/patient_controller');
// var dtypeController = require('../controllers/dtype_controller');
// var dtresultController = require('../controllers/dtresult_controller');
// var dtroptionController = require('../controllers/dtroption_controller');

var hc = require('../controllers/history_controller');

// var dtypeSeeder = require('../seeders/dcodes');


// Autoload de parametros
router.param('userId', userController.load);
router.param('companyId', companyController.load);  
router.param('salesmanId', salesmanController.load);  


// router.param('reportId', 	reportController.load);  
// router.param('diagnoseId', 	diagnoseController.load);  
// router.param('patientId', 	patientController.load);  
// router.param('dtypeId',		dtypeController.load);  
// router.param('dtresultId',	dtresultController.load);  
// router.param('dtroptionId',	dtroptionController.load);  


router.get('/goback', hc.goBack);
router.get('/reload', hc.reload);


// GET home page.
router.get('/', hc.set,
				function(req, res, next) { 
					res.render('index');
				}
		  );



// Definición de rutas de sesion
router.get('/session',    sessionController.new);     // formulario login
router.post('/session',   sessionController.create);  // crear sesión
router.delete('/session', sessionController.destroy); // destruir sesión


// Definición de rutas de cuenta
router.get('/users',                    userController.index);   // listado usuarios
router.get('/users/:userId(\\d+)',      userController.show);    // ver un usuario
router.get('/users/new',                userController.new);     // formulario sign un
router.post('/users',                   userController.create);     // registrar usuario
router.get('/users/:userId(\\d+)/edit', sessionController.loginRequired, 
										sessionController.adminOrMyselfRequired, 
										userController.edit);     // editar información de cuenta
router.put('/users/:userId(\\d+)',      sessionController.loginRequired, 
										sessionController.adminOrMyselfRequired, 
										userController.update);   // actualizar información de cuenta
router.delete('/users/:userId(\\d+)',   sessionController.loginRequired, 
										sessionController.adminAndNotMyselfRequired, 
										userController.destroy);  // borrar cuenta


// Definicion de rutas para las fabricas
router.get(   '/companies',                     	hc.push, companyController.index);
router.get(   '/companies/:companyId(\\d+)',       	hc.push, companyController.show);
router.get(   '/companies/new',                 	hc.push, companyController.new);
router.post(  '/companies',                    		companyController.create);
router.get(   '/companies/:companyId(\\d+)/edit', 	hc.push, companyController.edit);
router.put(   '/companies/:companyId(\\d+)',      	companyController.update);
router.delete('/companies/:companyId(\\d+)',   		companyController.destroy);



// Definicion de rutas para los vendedores
router.get(   '/salesmen',                     		hc.push, salesmanController.index);
router.get(   '/salesmen/:salesmanId(\\d+)',       	hc.push, salesmanController.show);
router.get(   '/salesmen/new',                 		hc.push, salesmanController.new);
router.post(  '/salesmen',                    		salesmanController.create);
router.get(   '/salesmen/:salesmanId(\\d+)/edit', 	hc.push, salesmanController.edit);
router.put(   '/salesmen/:salesmanId(\\d+)',      	salesmanController.update);
router.delete('/salesmen/:salesmanId(\\d+)',   		salesmanController.destroy);



/*
// Definicion de rutas para los diagnosticos de los informes
router.get(   '/reports/:reportId(\\d+)/diagnoses',                     	hc.push, diagnoseController.index);
router.get(   '/reports/:reportId(\\d+)/diagnoses/:diagnoseId(\\d+)',       hc.push, diagnoseController.show);
router.get(   '/reports/:reportId(\\d+)/diagnoses/new',                 	hc.push, diagnoseController.new);
router.post(  '/reports/:reportId(\\d+)/diagnoses',                    		diagnoseController.create);
router.get(   '/reports/:reportId(\\d+)/diagnoses/:diagnoseId(\\d+)/edit', 	hc.push, diagnoseController.edit);
router.put(   '/reports/:reportId(\\d+)/diagnoses/:diagnoseId(\\d+)',      	diagnoseController.update);
router.delete('/reports/:reportId(\\d+)/diagnoses/:diagnoseId(\\d+)',   	diagnoseController.destroy);



// Definicion de rutas para los informes
router.get('/reports',                     	        					hc.set, reportController.index);

router.get('/patients/:patientId(\\d+)/reports',    					hc.push, reportController.index);
router.get('/patients/:patientId(\\d+)/reports/:reportId(\\d+)', 		hc.push, reportController.show);

router.get('/patients/:patientId(\\d+)/reports/new',    				hc.push, reportController.new);
router.post('/patients/:patientId(\\d+)/reports/auto',      			reportController.autocreate);
router.post('/patients/:patientId(\\d+)/reports',    					reportController.create);

router.get('/patients/:patientId(\\d+)/reports/:reportId(\\d+)/edit',	hc.push, reportController.edit);
router.put('/patients/:patientId(\\d+)/reports/:reportId(\\d+)',		reportController.update);
router.delete('/patients/:patientId(\\d+)/reports/:reportId(\\d+)',		reportController.destroy);

// Impresion de informes
router.get('/reports/print',  											hc.push, reportController.printIndex);
router.get('/patients/:patientId(\\d+)/reports/print',  				hc.push, reportController.printIndex);
router.get('/patients/:patientId(\\d+)/reports/:reportId(\\d+)/print',  hc.push, reportController.printReport);
router.put('/patients/:patientId(\\d+)/reports/:reportId(\\d+)/printed',reportController.setAsPrinted);



// Definición de rutas de /patients
router.get('/patients',                     	hc.set, patientController.index);
router.get('/patients/:patientId(\\d+)',       	hc.push, patientController.show);
router.get('/patients/new',                 	hc.push, patientController.new);
router.post('/patients',                    	patientController.create);
router.get('/patients/:patientId(\\d+)/edit',  	hc.push, patientController.edit);
router.put('/patients/:patientId(\\d+)',       	patientController.update);
router.delete('/patients/:patientId(\\d+)',    	patientController.destroy);



// Definición de rutas de /dtypes/:dtypeId/dtresults/dtresultId/dtroptions
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions',                     		hc.push, dtroptionController.index);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions/:dtroptionId(\\d+)',       hc.push, dtroptionController.show);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions/new',                 		hc.push, dtroptionController.new);
router.post(  '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions',                    		dtroptionController.create);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions/:dtroptionId(\\d+)/edit', 	hc.push, dtroptionController.edit);
router.put(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions/:dtroptionId(\\d+)',      	dtroptionController.update);
router.delete('/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions/:dtroptionId(\\d+)',   	dtroptionController.destroy);



// Definición de rutas de /dtypes/:dtypeId/dtresults
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults',                     		hc.push, dtresultController.index);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)',       	hc.push, dtresultController.show);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/new',                 		hc.push, dtresultController.new);
router.post(  '/dtypes/:dtypeId(\\d+)/dtresults',                    		dtresultController.create);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/edit', 	hc.push, dtresultController.edit);
router.put(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)',      	dtresultController.update);
router.delete('/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)',   		dtresultController.destroy);



// Definición de rutas de /dtypes
router.get('/dtypes',                     	hc.set, dtypeController.index);
router.get('/dtypes/:dtypeId(\\d+)',       	hc.push, dtypeController.show);
router.get('/dtypes/new',                 	hc.push, dtypeController.new);
router.post('/dtypes',                    	dtypeController.create);
router.get('/dtypes/:dtypeId(\\d+)/edit',  	hc.push, dtypeController.edit);
router.put('/dtypes/:dtypeId(\\d+)',       	dtypeController.update);
router.delete('/dtypes/:dtypeId(\\d+)',    	dtypeController.destroy);



// Seed códigos de diagnosticos
router.post('/seed',                    	dtypeSeeder.seed);

*/

module.exports = router;
