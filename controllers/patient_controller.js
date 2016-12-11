
var models = require('../models');
var Sequelize = require('sequelize');


//-----------------------------------------------------------


// Autoload el paciente asociado a :patientId
exports.load = function(req, res, next, patientId) {
    models.Patient.findById(patientId, 
                            { include: [ models.Report ] })
    .then(function(patient) {
        if (patient) {
            req.patient = patient;
            next();
        } else { 
            throw new Error('No existe ningún paciente con Id=' + patientId);
        }
    })
    .catch(function(error) { next(error); });
};


//-----------------------------------------------------------


// GET /patients
exports.index = function(req, res, next) {

    var options = {};
    options.order = [['updatedAt','DESC']];
    options.where = {};

    
    // Busquedas:
    var search = req.query.search || '';
    if (search) {
      var search_like = "%" + search.replace(/ +/g,"%") + "%";
      options.where.name = { $like: search_like };
    }


    models.Patient.findAll(options)
    .then(function(patients) {
        res.render('patients/index.ejs', {  patients: patients,
                                            search: search });
    })
    .catch(function(error) {
        next(error);
    });
};



// GET /patients/:patientId
exports.show = function(req, res, next) {

    res.render('patients/show', {patient: req.patient});
};


// GET /patients/new
exports.new = function(req, res, next) {

    var patient = models.Patient.build({ name: "", 
                                         address: "",
                                         city: "",
                                         phone: "",
                                         doctor: "" });
    res.render('patients/new', { patient: patient });
};


// POST /patients/create
exports.create = function(req, res, next) {

    var patient = { name:    req.body.name, 
                    address: req.body.address,
                    city:    req.body.city,
                    phone:   req.body.phone,
                    doctor:  req.body.doctor };

    // Guarda en la tabla Patients la nueva paciente.
    models.Patient.create(patient)
    .then(function(patient) {
        req.flash('success', 'Paciente creada con éxito.');   

        res.redirect("/patients");
    })
    .catch(Sequelize.ValidationError, function(error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };
  
        res.render('patients/new', { patient: patient });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear una paciente: '+error.message);
        next(error);
    }); 
};




// GET /patients/:patientId/edit
exports.edit = function(req, res, next) {

    var patient = req.patient;  // autoload

    res.render('patients/edit', { patient: patient });
};



// PUT /patients/:patientId
exports.update = function(req, res, next) {

    

    req.patient.name = req.body.name;
    req.patient.address   = req.body.address;
    req.patient.city   = req.body.city;
    req.patient.phone   = req.body.city;
    req.patient.doctor   = req.body.doctor;

    req.patient.save({fields: ["name", "address", "city", "phone", "doctor"]})
    .then(function(patient) {

        req.flash('success', 'Paciente editada con éxito.'); 

        res.redirect("/patients");
    })
    .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('patients/edit', { patient: req.patient });
    })
    .catch(function(error) {
      req.flash('error', 'Error al editar una paciente: '+error.message);
      next(error);
    });
};


// DELETE /patients/:patientId
exports.destroy = function(req, res, next) {

    Sequelize.Promise.all(req.patient.Reports)
    .each(function(report) {
        // Borrar los diagnosticos del informe:
        return models.Diagnose.destroy({where: {ReportId: report.id}})
        .then( function() {
            req.flash('success', 'Diagnosticos de un informe borrados con éxito.');
        })
        .then(function() {
            // Borrar el informe
            return report.destroy()
            .then( function() {
                req.flash('success', 'Informe borrado con éxito.');
            });
        });
    })
    .then(function() {
        // Borrar la paciente:
        return req.patient.destroy()
        .then(function() {
            req.flash('success', 'Paciente borrada con éxito.');
        });
    })
    .then(function() {
        res.redirect("/patients");
    })
    .catch(function(error){
        req.flash('error', 'Error al borrar una paciente: '+error.message);
        next(error);
     });
};
