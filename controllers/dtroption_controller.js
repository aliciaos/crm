
var models = require('../models');
var Sequelize = require('sequelize');

var dtypeController = require('./dtype_controller');
var dtresultController = require('./dtresult_controller');


// Autoload la opcion del resultado de tipo de diagnostico asociado a :dtroptionId
exports.load = function(req, res, next, dtroptionId) {
    models.DTROption.findById(dtroptionId)
        .then(function(dtroption) {
            if (dtroption) {
                req.dtroption = dtroption;
                next();
            } else { 
                throw new Error('No existe ninguna opción de resultado de tipo de diagnóstico con Id=' + dtresultId);
            }
        })
        .catch(function(error) { next(error); });
};


//-----------------------------------------------------------

// GET /dtypes/:dtypeId/dtresults/:dtresultId/dtroptions
exports.index = function(req, res, next) {

    var options = {};
    options.order = [['code']];
    options.where = {DTResultId: req.dtresult.id};

    models.DTROption.findAll(options)
    .then(function(dtroptions) {
        res.render('dtroptions/index.ejs', { dtroptions: dtroptions,
                                             dtresult: req.dtresult,
                                             dtype: req.dtype
                                          });
    })
    .catch(function(error) {
        next(error);
    });
};



// GET /dtypes/:dtypeId/dtresults/:dtresultId/dtroptions/:dtroptionId
exports.show = function(req, res, next) {

    res.render('dtroptions/show', { dtroption: req.dtroption,
                                    dtresult: req.dtresult,
                                    dtype: req.dtype
                                 });
};


// GET /dtypes/:dtypeId/dtresults/:dtresultId/dtroptions/new
exports.new = function(req, res, next) {

    var dtroption = models.DTROption.build({ code: "", 
                                             title: "",
                                             description: "" });

    res.render('dtroptions/new', { dtroption: dtroption,
                                   dtresult: req.dtresult,
                                   dtype: req.dtype });
};


// POST /dtypes/:dtypeId/dtresults/:dtresultId/dtroptions/create
exports.create = function(req, res, next) {

    var dtroption = { code:  req.body.code.trim().toUpperCase(), 
                      title: req.body.title.trim(),
                      description: req.body.description,
                      DTResultId: req.dtresult.id };

    // Guarda en la tabla DTROptions la nueva opcioin.
    models.DTROption.create(dtroption)
    .then(function(dtroption) {
        req.flash('success', 'Opcion de resultado de tipo de diagnóstico creada con éxito.');   

        res.redirect("/dtypes/" + req.dtype.id);
    })
    .catch(Sequelize.ValidationError, function(error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };
  
        res.render('dtroptions/new', {  dtroption: dtroption,
                                        dtresult: req.dtresult,
                                        dtype: req.dtype 
                                    });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear una opción de resultado de tipo de diagnóstico: '+error.message);
        next(error);
    }); 
};




// GET /dtypes/:dtypeId/dtresults/:dtresultId/dtroptions/:dtroptionId/edit
exports.edit = function(req, res, next) {

    var dtype = req.dtype;       // autoload
    var dtresult = req.dtresult;
    var dtroption = req.dtroption;

    res.render('dtroptions/edit', { dtroption: dtroption,
                                    dtresult: dtresult,
                                    dtype: dtype 
                                  });
};



// PUT /dtypes/:dtypeId/dtresults/:dtresultId/dtroptions/:dtroptionId
exports.update = function(req, res, next) {

    req.dtroption.code        = req.body.code.trim().toUpperCase();
    req.dtroption.title       = req.body.title.trim();
    req.dtroption.description = req.body.description;

    req.dtroption.save({fields: ["code", "title", "description"]})
    .then(function(dtroption) {

        req.flash('success', 'Opción de resultado de tipo de diagnóstico editada con éxito.'); 

        res.redirect("/dtypes/" + req.dtype.id);
    })
    .catch(Sequelize.ValidationError, function(error) {

        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };

        res.render('dtroptions/edit', { dtroption: req.dtroption,
                                        dtresult: req.dtresult,
                                        dtype: req.dtype 
                                      });
    })
    .catch(function(error) {
        req.flash('error', 'Error al editar una opción de resultado de tipo de diagnóstico: '+error.message);
        next(error);
    });
};


// DELETE /dtypes/:dtypeId/dtresults/:dtresultId/dtroptions/:dtroptionId
exports.destroy = function(req, res, next) {

    req.dtroption.destroy()
    .then( function() {
        req.flash('success', 'Opción de resultado de tipo de diagnóstico borrada con éxito.');
        res.redirect("/dtypes/" + req.dtype.id);
    })
    .catch(function(error){
        req.flash('error', 'Error al borrar una opción de resultado de  tipo de diagnóstico: '+error.message);
        next(error);
    });
};
