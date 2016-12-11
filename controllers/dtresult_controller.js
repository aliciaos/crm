
var models = require('../models');
var Sequelize = require('sequelize');

var dtypeController = require('./dtype_controller');


// Autoload el resultado de tipo de diagnostico asociado a :dtresultId
exports.load = function(req, res, next, dtresultId) {
    models.DTResult.findById(dtresultId)
        .then(function(dtresult) {
            if (dtresult) {
                req.dtresult = dtresult;
                next();
            } else { 
                throw new Error('No existe ningún resultado de tipo de diagnóstico con Id=' + dtresultId);
            }
        })
        .catch(function(error) { next(error); });
};


//-----------------------------------------------------------

// GET /dtypes/:dtypeId/dtresults
exports.index = function(req, res, next) {

    var options = {};
    options.order = [['code']];
    options.where = {DTypeId: req.dtype.id};

    models.DTResult.findAll(options)
    .then(function(dtresults) {
        res.render('dtresults/index.ejs', { dtresults: dtresults,
                                            dtype: req.dtype
                                          });
    })
    .catch(function(error) {
        next(error);
    });
};



// GET /dtypes/:dtypeId/dtresults/:dtresultId
exports.show = function(req, res, next) {

    res.render('dtresults/show', { dtresult: req.dtresult,
                                   dtype: req.dtype
                                 });
};


// GET /dtypes/:dtypeId/dtresults/new
exports.new = function(req, res, next) {

    var dtresult = models.DTResult.build({ code: "", 
                                           title: "",
                                           description: "" });

    res.render('dtresults/new', { dtresult: dtresult,
                                  dtype: req.dtype });
};


// POST /dtypes/:dtypeId/dtresults/create
exports.create = function(req, res, next) {

    var dtresult = { code:  req.body.code.trim().toUpperCase(), 
                     title: req.body.title.trim(),
                     description: req.body.description,
                     DTypeId: req.dtype.id };

    // Guarda en la tabla DTResults el nuevo resultado.
    models.DTResult.create(dtresult)
    .then(function(dtresult) {
        req.flash('success', 'Resultado de tipo de diagnóstico creado con éxito.');   

        res.redirect("/dtypes/" + req.dtype.id);
    })
    .catch(Sequelize.ValidationError, function(error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };
  
        res.render('dtresults/new', { dtresult: dtresult,
                                      dtype: req.dtype 
                                    });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear un resultado de tipo de diagnóstico: '+error.message);
        next(error);
    }); 
};




// GET /dtypes/:dtypeId/dtresults/:dtresultId/edit
exports.edit = function(req, res, next) {

    var dtype = req.dtype;       // autoload
    var dtresult = req.dtresult;

    res.render('dtresults/edit', { dtresult: dtresult,
                                   dtype: dtype 
                                  });
};



// PUT /dtypes/:dtypeId/dtresults/:dtresultId
exports.update = function(req, res, next) {

    req.dtresult.code  = req.body.code.trim().toUpperCase();
    req.dtresult.title = req.body.title.trim();
    req.dtresult.description = req.body.description;

    req.dtresult.save({fields: ["code", "title", "description"]})
    .then(function(dtresult) {

        req.flash('success', 'Resultado de tipo de diagnóstico editado con éxito.'); 

        res.redirect("/dtypes/" + req.dtype.id);
    })
    .catch(Sequelize.ValidationError, function(error) {

        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };

        res.render('dtresults/edit', {  dtresult: req.dtresult,
                                        dtype: req.dtype 
                                      });
    })
    .catch(function(error) {
        req.flash('error', 'Error al editar un resultado de tipo de diagnóstico: '+error.message);
        next(error);
    });
};


// DELETE /dtypes/:dtypeId/dtresults/:dtresultId
exports.destroy = function(req, res, next) {

    // Borrar las opciones del resultado:
    models.DTROption.destroy({where: {DTResultId: req.dtresult.id}})
    .then( function() {
        req.flash('success', 'Opciones del resultado borradas con éxito.');

        // Borrar el resultado
        return req.dtresult.destroy()
        .then( function() {
            req.flash('success', 'Resultado de tipo de diagnóstico borrado con éxito.');
            res.redirect("/dtypes/" + req.dtype.id);
        });
    })
    .catch(function(error){
        req.flash('error', 'Error al borrar un resultado de  tipo de diagnóstico: '+error.message);
        next(error);
    });
};
