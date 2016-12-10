

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

    var redir = req.query.redir || "/";

    var options = {};
    options.order = [['updatedAt','DESC']];
    options.include = [ models.Patient ];

    if (req.patient) {
    	options.where = { PatientId: req.patient.id};
    }

    models.Report.findAll(options)
    .then(function(reports) {
        res.render('reports/index.ejs', { reports: reports,
        									moment: moment,
                                            redir: redir });
    })
    .catch(function(error) {
        next(error);
    });
};


// GET /reports/:reportId
exports.show = function(req, res, next) {

    var redir = req.query.redir || "/reports";

    res.render('reports/show', { report: req.report,
    							 patient: req.patient,
    							 moment: moment,
                                 redir: redir });
};


// GET /patients/:patientId/reports/new
exports.new = function(req, res, next) {

    var redir = req.query.redir || "/patients/" + req.patient.id + "/reports/";

    var report = models.Report.build({ 	doctor: req.patient.doctor, 
                                       	receptionAt: moment().format("DD/MM/YYYY"),
                                        lastMenstruationAt: "",
                                        cycleDay: "" });

    res.render('reports/new', { report: report,
    							patient: req.patient,
    							moment: moment,
                                redir: redir });
};


// POST /patients/:patientId/reports/create
exports.create = function(req, res, next) {

    var redir = req.body.redir || "/patients/" + req.patient.id + "/reports/";

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

        res.redirect("/patients/" + req.patient.id + "/reports/" + report.id + "/edit?redir=" + redir);
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
    								moment: moment,
                                    redir: redir });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear un informe: ' + error.message);
        next(error);
    }); 
};


// POST /patients/:patientId/reports/auto
exports.autocreate = function(req, res, next) {

    req.body = {    redir: req.query.redir || "/patients/" + req.patient.id + "/reports/",
                    doctor:             req.patient.doctor, 
                    receptionAt:        moment().format("DD/MM/YYYY"),
                    lastMenstruationAt: "",
                    cycleDay:           "",
                    PatientId:          req.patient.id 
                };

    exports.create(req, res, next);
};



// GET /patients/:patientId/reports/:reportId/edit
exports.edit = function(req, res, next) {

    var report = req.report;  // autoload

    var redir = req.query.redir || "/patients/" + req.patient.id + "/reports/" + report.id;

    res.render('reports/edit', { report: report,
    							 patient: req.patient,
    							 moment: moment, redir });
};



// PUT /patients/:patientId/reports/:reportId
exports.update = function(req, res, next) {

    var redir = req.body.redir || "/patients/" + req.patient.id + "/reports/" + req.report.id

	var momentReceptionAt = moment(req.body.receptionAt + " 08:00", "DD/MM/YYYY");

    req.report.doctor 				= req.body.doctor;
    req.report.receptionAt   		= momentReceptionAt.toDate();
    req.report.lastMenstruationAt	= req.body.lastMenstruationAt;
    req.report.cycleDay   			= req.body.cycleDay;

    req.report.save({fields: ["doctor", "receptionAt", "lastMenstruationAt", "cycleDay"]})
    .then(function(report) {

        req.flash('success', 'Informe editado con éxito.'); 

        res.redirect(redir);
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
    								 moment: moment,
                                     redir: redir });
    })
    .catch(function(error) {
      req.flash('error', 'Error al editar un informe: ' + error.message);
      next(error);
    });
};


// DELETE /patients/:patientId/reports/:reportId
exports.destroy = function(req, res, next) {

    var redir = req.query.redir || "/patients/" + req.patient.id + "/reports";

    req.report.destroy()
	.then( function() {
		req.flash('success', 'Informe borrado con éxito.');
		res.redirect(redir);
	})
	.catch(function(error){
		req.flash('error', 'Error al borrar un informe: ' + error.message);
		next(error);
	});
};


//-----------------------------------------------------------


// GET /patients/:patientId/reports/:reportId
exports.print = function(req, res, next) {

    var redir = req.query.redir || "/";

    var diagnosesInfo = [];

    Sequelize.Promise.all(req.report.Diagnoses)
    .each(function(diagnose) {

        var diagnoseInfo = { dtype: { title: "" },
                             dtresult: { title: "", description: "" },
                             dtroption: { title: "", description: "" }
                           };

        return models.DType.findOne({where: {code: { $like: "%"+diagnose.dtypeCode+"%"}}})
        .then(function(dtype) {

            if (!dtype) return;

            diagnoseInfo.dtype = { title: dtype.title };

            return models.DTResult.findOne({where: {DTypeId: dtype.id,
                                                    code: { $like: "%"+diagnose.dtresultCode+"%"}}})
            .then(function(dtresult) {

                if (!dtresult) return;

                diagnoseInfo.dtresult = { title: dtresult.title,
                                           description: dtresult.description
                                        };

                return models.DTROption.findOne({where: {DTResultId: dtresult.id,
                                                         code: { $like: "%"+diagnose.dtroptionCode+"%"}}})
                .then(function(dtroption) {

                    if (!dtroption) return;

                    diagnoseInfo.dtroption = { title: dtroption.title,
                                               description: dtroption.description 
                                             };
                });
            });
        })
        .then(function() {
            diagnosesInfo.push(diagnoseInfo);
        });
    })
    .then(function() {

        req.flash('success', 'Generado informe para imprimir.');

        res.render('reports/print', {   report: req.report,
                                        patient: req.patient,
                                        diagnoses: diagnosesInfo,
                                        moment: moment,
                                        redir: redir });
    })
    .catch(function(error){
        req.flash('error', 'Error crear un informe para imprimir: ' + error.message);
        next(error);
    });

};







