
var models = require('../models');
var Sequelize = require('sequelize');


//-----------------------------------------------------------


// Autoload el tipo de diagnostico asociado a :dtypeId
exports.load = function(req, res, next, dtypeId) {
    models.DType.findById(dtypeId, 
                          { include: [ { model: models.DTResult,
                                         include: [ models.DTROption ] 
                                       } 
                                     ] 
                          })
    .then(function(dtype) {
        if (dtype) {
            req.dtype = dtype;
            next();
        } else { 
            throw new Error('No existe ningún tipo de diagnóstico con Id=' + dtypeId);
        }
    })
    .catch(function(error) { next(error); });
};


//-----------------------------------------------------------

// GET /dtypes
exports.index = function(req, res, next) {

    var options = {};
    options.order = [['code']];

    models.DType.findAll(options)
    .then(function(dtypes) {
        res.render('dtypes/index.ejs', {dtypes: dtypes});
    })
    .catch(function(error) {
        next(error);
    });
};



// GET /dtypes/:dtypeId
exports.show = function(req, res, next) {

    res.render('dtypes/show', {dtype: req.dtype});
};


// GET /dtypes/new
exports.new = function(req, res, next) {

    var dtype = models.DType.build({ code: "", 
                                     title: "" });
    res.render('dtypes/new', { dtype: dtype });
};


// POST /dtypes/create
exports.create = function(req, res, next) {

    var dtype = { code:  req.body.code, 
                  title: req.body.title };

    // Guarda en la tabla DTypes el nuevo tipo.
    models.DType.create(dtype)
    .then(function(dtype) {
        req.flash('success', 'Tipo de diagnóstico creado con éxito.');   

        res.redirect("/dtypes");
    })
    .catch(Sequelize.ValidationError, function(error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };
  
        res.render('dtypes/new', { dtype: dtype });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear un tipo de diagnóstico: '+error.message);
        next(error);
    }); 
};




// GET /dtypes/:dtypeId/edit
exports.edit = function(req, res, next) {

    var dtype = req.dtype;  // autoload

    res.render('dtypes/edit', { dtype: dtype });
};



// PUT /dtypes/:dtypeId
exports.update = function(req, res, next) {

    req.dtype.code  = req.body.code;
    req.dtype.title = req.body.title;

    req.dtype.save({fields: ["code", "title"]})
    .then(function(dtype) {

        req.flash('success', 'Tipo de diagnóstico editado con éxito.'); 

        res.redirect("/dtypes");
    })
    .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('dtypes/edit', { dtype: req.dtype });
    })
    .catch(function(error) {
      req.flash('error', 'Error al editar un tipo de diagnóstico: '+error.message);
      next(error);
    });
};


// DELETE /dtypes/:dtypeId
exports.destroy = function(req, res, next) {

    Sequelize.Promise.all(req.dtype.DTResults)
    .each(function(dtresult) {

        // Borrar las opciones del resultado:
        return models.DTROption.destroy({where: {DTResultId: dtresult.id}})
        .then( function() {
            req.flash('success', 'Opciones del resultado ' + dtresult.code + ' borradas con éxito.');

            // Borrar el resultado
            return dtresult.destroy()
            .then( function() {
                req.flash('success', 'Resultado ' + dtresult.code + ' borrado con éxito.');

                // Borrar el tipo:
                return req.dtype.destroy()
                .then(function() {
                    req.flash('success', 'Tipo de diagnóstico borrado con éxito.');
                });
            });
        });
    })
    .then(function() {
        res.redirect("/dtypes");
    })
    .catch(function(error){
        req.flash('error', 'Error al borrar un tipo de diagnóstico: '+error.message);
        next(error);
    });
};




