var express = require('express');
var router = express.Router();

var patientController = require('../controllers/patient_controller');
var dtypeController = require('../controllers/dtype_controller');
var dtresultController = require('../controllers/dtresult_controller');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


// Autoload de parametros
router.param('patientId', patientController.load);  
router.param('dtypeId',   dtypeController.load);  
router.param('dtresultId',   dtresultController.load);  


// Definición de rutas de /patients
router.get('/patients',                     	patientController.index);
router.get('/patients/:patientId(\\d+)',       	patientController.show);
router.get('/patients/new',                 	patientController.new);
router.post('/patients',                    	patientController.create);
router.get('/patients/:patientId(\\d+)/edit',  	patientController.edit);
router.put('/patients/:patientId(\\d+)',       	patientController.update);
router.delete('/patients/:patientId(\\d+)',    	patientController.destroy);


// Definición de rutas de /dtresults
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



module.exports = router;
