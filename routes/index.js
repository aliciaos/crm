var express = require('express');
var router = express.Router();

var reportController = require('../controllers/report_controller');
var diagnoseController = require('../controllers/diagnose_controller');
var patientController = require('../controllers/patient_controller');
var dtypeController = require('../controllers/dtype_controller');
var dtresultController = require('../controllers/dtresult_controller');
var dtroptionController = require('../controllers/dtroption_controller');

var dtypeSeeder = require('../seeders/dcodes');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


// Autoload de parametros
router.param('reportId', 	reportController.load);  
router.param('diagnoseId', 	diagnoseController.load);  
router.param('patientId', 	patientController.load);  
router.param('dtypeId',		dtypeController.load);  
router.param('dtresultId',	dtresultController.load);  
router.param('dtroptionId',	dtroptionController.load);  



// Definicion de rutas para los diagnosticos de los informes
router.get(   '/reports/:reportId(\\d+)/diagnoses',                     	diagnoseController.index);
router.get(   '/reports/:reportId(\\d+)/diagnoses/:diagnoseId(\\d+)',       diagnoseController.show);
router.get(   '/reports/:reportId(\\d+)/diagnoses/new',                 	diagnoseController.new);
router.post(  '/reports/:reportId(\\d+)/diagnoses',                    		diagnoseController.create);
router.get(   '/reports/:reportId(\\d+)/diagnoses/:diagnoseId(\\d+)/edit', 	diagnoseController.edit);
router.put(   '/reports/:reportId(\\d+)/diagnoses/:diagnoseId(\\d+)',      	diagnoseController.update);
router.delete('/reports/:reportId(\\d+)/diagnoses/:diagnoseId(\\d+)',   	diagnoseController.destroy);



// Definicion de rutas para los informes
router.get('/reports',                     	        					reportController.index);

router.get('/patients/:patientId(\\d+)/reports',    					reportController.index);
router.get('/patients/:patientId(\\d+)/reports/:reportId(\\d+)', 		reportController.show);

router.get('/patients/:patientId(\\d+)/reports/new',    				reportController.new);
router.post('/patients/:patientId(\\d+)/reports/auto',      			reportController.autocreate);
router.post('/patients/:patientId(\\d+)/reports',    					reportController.create);

router.get('/patients/:patientId(\\d+)/reports/:reportId(\\d+)/edit',	reportController.edit);
router.put('/patients/:patientId(\\d+)/reports/:reportId(\\d+)',		reportController.update);
router.delete('/patients/:patientId(\\d+)/reports/:reportId(\\d+)',		reportController.destroy);

// Impresion de informes
router.get('/reports/print',  											reportController.printIndex);
router.get('/patients/:patientId(\\d+)/reports/print',  				reportController.printIndex);
router.get('/patients/:patientId(\\d+)/reports/:reportId(\\d+)/print',  reportController.printReport);
router.put('/patients/:patientId(\\d+)/reports/:reportId(\\d+)/printed',reportController.setAsPrinted);



// Definición de rutas de /patients
router.get('/patients',                     	patientController.index);
router.get('/patients/:patientId(\\d+)',       	patientController.show);
router.get('/patients/new',                 	patientController.new);
router.post('/patients',                    	patientController.create);
router.get('/patients/:patientId(\\d+)/edit',  	patientController.edit);
router.put('/patients/:patientId(\\d+)',       	patientController.update);
router.delete('/patients/:patientId(\\d+)',    	patientController.destroy);



// Definición de rutas de /dtypes/:dtypeId/dtresults/dtresultId/dtroptions
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions',                     		dtroptionController.index);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions/:dtroptionId(\\d+)',       dtroptionController.show);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions/new',                 		dtroptionController.new);
router.post(  '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions',                    		dtroptionController.create);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions/:dtroptionId(\\d+)/edit', 	dtroptionController.edit);
router.put(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions/:dtroptionId(\\d+)',      	dtroptionController.update);
router.delete('/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/dtroptions/:dtroptionId(\\d+)',   	dtroptionController.destroy);



// Definición de rutas de /dtypes/:dtypeId/dtresults
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults',                     		dtresultController.index);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)',       	dtresultController.show);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/new',                 		dtresultController.new);
router.post(  '/dtypes/:dtypeId(\\d+)/dtresults',                    		dtresultController.create);
router.get(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)/edit', 	dtresultController.edit);
router.put(   '/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)',      	dtresultController.update);
router.delete('/dtypes/:dtypeId(\\d+)/dtresults/:dtresultId(\\d+)',   		dtresultController.destroy);



// Definición de rutas de /dtypes
router.get('/dtypes',                     	dtypeController.index);
router.get('/dtypes/:dtypeId(\\d+)',       	dtypeController.show);
router.get('/dtypes/new',                 	dtypeController.new);
router.post('/dtypes',                    	dtypeController.create);
router.get('/dtypes/:dtypeId(\\d+)/edit',  	dtypeController.edit);
router.put('/dtypes/:dtypeId(\\d+)',       	dtypeController.update);
router.delete('/dtypes/:dtypeId(\\d+)',    	dtypeController.destroy);



// Seed códigos de diagnosticos
router.post('/dtypes/seed',                    	dtypeSeeder.seed);



module.exports = router;
