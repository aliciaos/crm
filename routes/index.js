var express = require('express');
var router = express.Router();

var patientController = require('../controllers/patient_controller');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


// Autoload de parametros
router.param('patientId', patientController.load);  // autoload :patientId


// Definición de rutas de /patients
router.get('/patients',                     	patientController.index);
router.get('/patients/:patientId(\\d+)',       	patientController.show);


router.get('/patients/new',                 	patientController.new);
router.post('/patients',                    	patientController.create);
router.get('/patients/:patientId(\\d+)/edit',  	patientController.edit);
router.put('/patients/:patientId(\\d+)',       	patientController.update);
router.delete('/patients/:patientId(\\d+)',    	patientController.destroy);

module.exports = router;
