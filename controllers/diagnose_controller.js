
var models = require('../models');
var Sequelize = require('sequelize');

var reportController = require('../controllers/report_controller');
var dtypeController = require('../controllers/dtype_controller');
var dtresultController = require('../controllers/dtresult_controller');
var dtroptionController = require('../controllers/dtroption_controller');


// Autoload el diagnostico asociado a :diagnoseId
exports.load = function(req, res, next, diagnoseId) {
    models.Diagnose.findById(diagnoseId)
        .then(function(diagnose) {
            if (diagnose) {
                req.diagnose = diagnose;
                next();
            } else { 
                throw new Error('No existe ningún diagnóstico con Id=' + diagnoseId);
            }
        })
        .catch(function(error) { next(error); });
};


//-----------------------------------------------------------


// GET /reports/:reportId/diagnoses
exports.index = function(req, res, next) {

    var options = {};
    options.order = [['code']];
    options.where = {ReportId: req.report.id};

    models.Diagnose.findAll(options)
    .then(function(diagnoses) {
        res.render('diagnoses/index.ejs', { diagnoses: diagnoses,
                                            report: req.report
                                          });
    })
    .catch(function(error) {
        next(error);
    });
};


// GET /reports/:reportId/diagnoses/:diagnoseId
exports.show = function(req, res, next) {

    res.render('diagnoses/show', { diagnose: req.diagnose,
                                   report: req.report
                                 });
};



// GET /reports/:reportId/diagnoses/new
exports.new = function(req, res, next) {

    var diagnose = models.Diagnose.build({  dtypeCode: "", 
                                            dtresultCode: "",
                                            resultNotes: "",
                                            dtroptionCode: "",
                                            optionNotes: "" });

    res.render('diagnoses/new', { diagnose: diagnose,
                                  report: req.report });
};


// POST /reports/:reportId/diagnoses/create
exports.create = function(req, res, next) {

    var diagnose = { dtypeCode:  req.body.dtypeCode.trim().toUpperCase(), 
                     dtresultCode: req.body.dtresultCode.trim().toUpperCase(),
                     resultNotes: req.body.resultNotes,
                     dtroptionCode: req.body.dtroptionCode.trim().toUpperCase(),
                     optionNotes: req.body.optionNotes,
                     ReportId: req.report.id };

    // Guarda en la tabla Diagnoses el nuevo diagnostico.
    models.Diagnose.create(diagnose)
    .then(function(diagnose) {
        req.flash('success', 'Diagnóstico creado con éxito.');   

        var patient = req.report.Patient;
        res.redirect("/patients/" + patient.id + "/reports/"+ req.report.id + "/edit");
    })
    .catch(Sequelize.ValidationError, function(error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };
  
        res.render('diagnoses/new', { diagnose: diagnose,
                                      report: req.report 
                                    });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear un diagnóstico: '+error.message);
        next(error);
    }); 
};




// GET /reports/:reportId/diagnoses/:diagnoseId/edit
exports.edit = function(req, res, next) {

    var report = req.report;       // autoload
    var diagnose = req.diagnose;

    res.render('diagnoses/edit', { diagnose: diagnose,
                                   report: report 
                                  });
};



// PUT /reports/:reportId/diagnoses/:diagnoseId
exports.update = function(req, res, next) {

    req.diagnose.dtypeCode      = req.body.dtypeCode.trim().toUpperCase();
    req.diagnose.dtresultCode   = req.body.dtresultCode.trim().toUpperCase();
    req.diagnose.resultNotes    = req.body.resultNotes;
    req.diagnose.dtroptionCode  = req.body.dtroptionCode.trim().toUpperCase();
    req.diagnose.optionNotes    = req.body.optionNotes;

    req.diagnose.save({fields: ["dtypeCode", "dtresultCode", "resultNotes", "dtroptionCode", "optionNotes"]})
    .then(function(diagnose) {

        req.flash('success', 'Diagnóstico editado con éxito.'); 

        var patient = req.report.Patient;
        res.redirect("/patients/" + patient.id + "/reports/"+ req.report.id + "/edit");
    })
    .catch(Sequelize.ValidationError, function(error) {

        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };

        res.render('diagnoses/edit', {  diagnose: req.diagnose,
                                        report: req.report 
                                      });
    })
    .catch(function(error) {
        req.flash('error', 'Error al editar un diagnóstico: '+error.message);
        next(error);
    });
};


// DELETE /reports/:reportId/diagnoses/:diagnoseId
exports.destroy = function(req, res, next) {

    req.diagnose.destroy()
    .then( function() {
        req.flash('success', 'Diagnóstico borrado con éxito.');

        var patient = req.report.Patient;
        res.redirect("/patients/" + patient.id + "/reports/"+ req.report.id + "/edit");
    })
    .catch(function(error){
        req.flash('error', 'Error al borrar un diagnóstico: '+error.message);
        next(error);
    });
};
