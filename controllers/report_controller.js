

var models = require('../models');
var Sequelize = require('sequelize');

var moment = require('moment');

//-----------------------------------------------------------


// Autoload el informe asociado a :reportId
exports.load = function(req, res, next, reportId) {
    models.Report.findById(reportId,
    						{ include: [ models.Diagnose,
                                         models.Patient ] })
    .then(function(report) {
        if (report) {
            req.report = report;
            next();
        } else { 
            throw new Error('No existe ningún informe con Id=' + reportId);
        }
    })
    .catch(function(error) { next(error); });
};


//-----------------------------------------------------------


// GET /reports
// GET /patients/:patientId/reports
exports.index = function(req, res, next) {

    var options = {};
    options.order = [['updatedAt','DESC']];
    options.include = [ models.Patient ];


    if (req.patient) {
    	options.where = { PatientId: req.patient.id};
    }

    models.Report.findAll(options)
    .then(function(reports) {
        res.render('reports/index.ejs', { reports: reports,
        									moment: moment });
    })
    .catch(function(error) {
        next(error);
    });
};


// GET /reports/:reportId
exports.show = function(req, res, next) {

    res.render('reports/show', { report: req.report,
    							 patient: req.patient,
    							 moment: moment });
};


// GET /patients/:patientId/reports/new
exports.new = function(req, res, next) {

    var report = models.Report.build({ 	doctor: req.patient.doctor, 
                                       	receptionAt: moment().format("DD/MM/YYYY"),
                                        lastMenstruationAt: "",
                                        cycleDay: "" });

    res.render('reports/new', { report: report,
    							patient: req.patient,
    							moment: moment });
};


// POST /patients/:patientId/reports/create
exports.create = function(req, res, next) {

	var momentReceptionAt = moment(req.body.receptionAt + " 08:00", "DD/MM/YYYY");

    var report = { 	doctor:    			req.body.doctor, 
                    receptionAt:     	momentReceptionAt.toDate(),
                    lastMenstruationAt: req.body.lastMenstruationAt,
                    cycleDay:   		req.body.cycleDay,
                    PatientId:  		req.patient.id };

    // Guarda en la tabla Reports el nuevo informe.
    models.Report.create(report)
    .then(function(report) {
        req.flash('success', 'Informe creado con éxito.');   

        res.redirect("/patients/" + req.patient.id + "/reports/" + report.id + "/edit");
    })
    .catch(Sequelize.ValidationError, function(error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };
  
  		if ( ! momentReceptionAt.isValid() ) {
  			report.receptionAt = moment().format("DD/MM/YYYY");
  		}

        res.render('reports/new', { report: report,
    							    patient: req.patient,
    								moment: moment });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear un informe: ' + error.message);
        next(error);
    }); 
};


// POST /patients/:patientId/reports/auto
exports.autocreate = function(req, res, next) {

    req.body = {    doctor:             req.patient.doctor, 
                    receptionAt:        moment().format("DD/MM/YYYY"),
                    lastMenstruationAt: "",
                    cycleDay:           "",
                    PatientId:          req.patient.id 
                };

    exports.create(req, res, next);
};



// GET /reports/:reportId/edit
exports.edit = function(req, res, next) {

    var report = req.report;  // autoload

    res.render('reports/edit', { report: report,
    							 patient: req.patient,
    							 moment: moment });
};



// PUT /reports/:reportId
exports.update = function(req, res, next) {

	var momentReceptionAt = moment(req.body.receptionAt + " 08:00", "DD/MM/YYYY");

    req.report.doctor 				= req.body.doctor;
    req.report.receptionAt   		= momentReceptionAt.toDate();
    req.report.lastMenstruationAt	= req.body.lastMenstruationAt;
    req.report.cycleDay   			= req.body.cycleDay;

    req.report.save({fields: ["doctor", "receptionAt", "lastMenstruationAt", "cycleDay"]})
    .then(function(report) {

        req.flash('success', 'Informe editado con éxito.'); 

        res.redirect("/patients/" + req.patient.id + "/reports/" + report.id);
    })
    .catch(Sequelize.ValidationError, function(error) {

		req.flash('error', 'Errores en el formulario:');
		for (var i in error.errors) {
			req.flash('error', error.errors[i].value);
		};

		if ( ! momentReceptionAt.isValid() ) {
  			report.receptionAt = moment().format("DD/MM/YYYY");
  		}

		res.render('reports/edit', { report: req.report,
    							     patient: req.patient,
    								 moment: moment });
    })
    .catch(function(error) {
      req.flash('error', 'Error al editar un informe: ' + error.message);
      next(error);
    });
};


// DELETE /reports/:reportId
exports.destroy = function(req, res, next) {

    req.report.destroy()
	.then( function() {
		req.flash('success', 'Informe borrado con éxito.');
		res.redirect("/patients/" + req.patient.id);
	})
	.catch(function(error){
		req.flash('error', 'Error al borrar un informe: ' + error.message);
		next(error);
	});
};


