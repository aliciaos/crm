

var models = require('../models');
var Sequelize = require('sequelize');

var moment = require('moment');

var paginate = require('./paginate').paginate;

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
    options.where = {};


    if (req.patient) {
    	options.where.PatientId = req.patient.id;
    }

    
    // Busquedas por paciente:
    var searchpatient = req.query.searchpatient || '';
    if (searchpatient) {
        var search_like = "%" + searchpatient.replace(/ +/g,"%") + "%";

        // CUIDADO: Estoy retocando el include existente.
        options.include = [ {   model: models.Patient,
                                where: { name: { $like: search_like } } 
                            } 
                          ];
    }

    // Busquedas por doctor:
    var searchdoctor = req.query.searchdoctor || '';
    if (searchdoctor) {
        var search_like = "%" + searchdoctor.replace(/ +/g,"%") + "%";
        options.where.doctor = { $like: search_like };
    }

     // Busquedas por fecha:
    var searchdate1 = req.query.searchdate1 || '';
    var searchdate2 = req.query.searchdate2 || '';
    if (searchdate1 !== "" && searchdate2 !== "") {

        var searchmoment1 = moment(searchdate1 + " 08:00", "DD-MM-YYYY").toDate();
        var searchmoment2 = moment(searchdate2 + " 08:00", "DD-MM-YYYY").toDate();
        options.where.receptionAt = { $between: [ searchmoment1, searchmoment2] };
    }



    models.Report.count(options)
    .then(function(count) {

        // Paginacion:

        var items_per_page = 6;

        // La pagina a mostrar viene en la query
        var pageno = parseInt(req.query.pageno) || 1;

        // Datos para obtener el rango de datos a buscar en la BBDD.
        var pagination = {
            offset: items_per_page * (pageno - 1),
            limit: items_per_page
        };

        // Crear un string con el HTML que pinta la botonera de paginacion.
        // Lo añado como una variable local de res para que lo pinte el layout de la aplicacion.
        res.locals.paginate_control = paginate(count, items_per_page, pageno, req.url);

        return pagination;
    })
    .then(function(pagination) {

        options.offset = pagination.offset;
        options.limit  = pagination.limit;

        options.order = [['updatedAt','DESC']];

        return models.Report.findAll(options);

    })
    .then(function(reports) {

        res.render('reports/index.ejs', {   reports: reports,
        									moment: moment,
                                            searchpatient: searchpatient,
                                            searchdoctor: searchdoctor,
                                            searchdate1: searchdate1,
                                            searchdate2: searchdate2,
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
                                       	receptionAt: moment().format("DD-MM-YYYY"),
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

	var momentReceptionAt = moment(req.body.receptionAt + " 08:00", "DD-MM-YYYY");

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
  			report.receptionAt = moment().format("DD-MM-YYYY");
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
                    receptionAt:        moment().format("DD-MM-YYYY"),
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
    							 moment: moment, 
                                 redir: redir });
};



// PUT /patients/:patientId/reports/:reportId
exports.update = function(req, res, next) {

    var redir = req.body.redir || "/patients/" + req.patient.id + "/reports/" + req.report.id

	var momentReceptionAt = moment(req.body.receptionAt + " 08:00", "DD-MM-YYYY");

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
  			req.report.receptionAt = moment().format("DD-MM-YYYY");
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

    // Borrar los diagnosticos del informe:
    models.Diagnose.destroy({where: {ReportId: req.report.id}})
    .then( function() {
        req.flash('success', 'Diagnosticos borrados con éxito.');

        // Borrar el informe
        return req.report.destroy()
        .then( function() {
            req.flash('success', 'Informe borrado con éxito.');
            res.redirect(redir);
        });
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
                             resultNotes: diagnose.resultNotes,
                             dtroption: { title: "", description: "" },
                             optionNotes: diagnose.optionNotes
                           };

        return models.DType.findOne({where: {code: diagnose.dtypeCode}})
        .then(function(dtype) {

            if (!dtype) return;

            diagnoseInfo.dtype = { title: dtype.title };

            return models.DTResult.findOne({where: {DTypeId: dtype.id,
                                                    code: diagnose.dtresultCode}})
            .then(function(dtresult) {

                if (!dtresult) return;

                diagnoseInfo.dtresult = { title: dtresult.title,
                                           description: dtresult.description
                                        };

                return models.DTROption.findOne({where: {DTResultId: dtresult.id,
                                                         code: diagnose.dtroptionCode}})
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

        res.render('reports/print', {   layout:false,
                                        report: req.report,
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







