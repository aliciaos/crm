
var models = require('../models');
var Sequelize = require('sequelize');

//-----------------------------------------------------------


// Autoload el vendedor asociado a :salesmanId
exports.load = function(req, res, next, salesmanId) {

    models.Salesman.findById(salesmanId, 
                          { order: [[ 'name' ]]
                          })
    .then(function(salesman) {
        if (salesman) {
            req.salesman = salesman;
            next();
        } else { 
            throw new Error('No existe ningún vendedor con Id=' + salesmanId);
        }
    })
    .catch(function(error) { next(error); });
};


//-----------------------------------------------------------

// GET /salesmen
exports.index = function(req, res, next) {

    var options = {};
    options.order = [['name']];

    models.Salesman.findAll(options)
    .then(function(salesmen) {
        res.render('salesmen/index.ejs', {salesmen: salesmen});
    })
    .catch(function(error) {
        next(error);
    });
};



// GET /salesmen/:salesmanId
exports.show = function(req, res, next) {

    res.render('salesmen/show', {salesman: req.salesman});
};


// GET /salesmen/new
exports.new = function(req, res, next) {

    var salesman = models.Salesman.build({ name: "" });
    res.render('salesmen/new', { salesman: salesman });
};


// POST /salesmen/create
exports.create = function(req, res, next) {

    var salesman = { name:  req.body.name.trim() };

    // Guarda en la tabla Salesmen el nuevo vendedor.
    models.Salesman.create(salesman)
    .then(function(salesman) {
        req.flash('success', 'Vendedor creado con éxito.');   

        res.redirect("/goback");
    })
    .catch(Sequelize.ValidationError, function(error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };
  
        res.render('salesmen/new', { salesman: salesman });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear un vendedor: ' + error.message);
        next(error);
    }); 
};




// GET /salesmen/:salesmanId/edit
exports.edit = function(req, res, next) {

    var salesman = req.salesman;  // autoload

    res.render('salesmen/edit', { salesman: salesman });
};



// PUT /salesmen/:salesmanId
exports.update = function(req, res, next) {

    req.salesman.name  = req.body.name.trim();

    req.salesman.save({fields: ["name"]})
    .then(function(salesman) {

        req.flash('success', 'Vendedor editado con éxito.'); 

        res.redirect("/goback");
    })
    .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('salesmen/edit', { salesman: req.salesman });
    })
    .catch(function(error) {
      req.flash('error', 'Error al editar un vendedor: '+error.message);
      next(error);
    });
};


// DELETE /salesmen/:salesmanId
exports.destroy = function(req, res, next) {

    // Borrar el vendedor:
    req.salesman.destroy()
    .then(function() {
        req.flash('success', 'Vendedor borrado con éxito.');
        res.redirect("/reload");
    })
    .catch(function(error){
        req.flash('error', 'Error al borrar un vendedor: ' + error.message);
        next(error);
    });
};

