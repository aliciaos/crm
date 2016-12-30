
var models = require('../models');
var Sequelize = require('sequelize');

//-----------------------------------------------------------


// Autoload la fabrica asociado a :companyId
exports.load = function(req, res, next, companyId) {

    models.Company.findById(companyId, 
                          { order: [[ 'name' ]]
                          })
    .then(function(company) {
        if (company) {
            req.company = company;
            next();
        } else { 
            throw new Error('No existe ninguna fábrica con Id=' + companyId);
        }
    })
    .catch(function(error) { next(error); });
};


//-----------------------------------------------------------

// GET /companies
exports.index = function(req, res, next) {

    var options = {};
    options.order = [['name']];

    models.Company.findAll(options)
    .then(function(companies) {
        res.render('companies/index.ejs', {companies: companies});
    })
    .catch(function(error) {
        next(error);
    });
};



// GET /companies/:companyId
exports.show = function(req, res, next) {

    res.render('companies/show', {company: req.company});
};


// GET /companies/new
exports.new = function(req, res, next) {

    var company = models.Company.build({ name: "" });
    res.render('companies/new', { company: company });
};


// POST /companies/create
exports.create = function(req, res, next) {

    var company = { name:  req.body.name.trim() };

    // Guarda en la tabla Companies la nueva fabrica.
    models.Company.create(company)
    .then(function(company) {
        req.flash('success', 'Fábrica creada con éxito.');   

        res.redirect("/goback");
    })
    .catch(Sequelize.ValidationError, function(error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };
  
        res.render('companies/new', { company: company });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear una fábrica: ' + error.message);
        next(error);
    }); 
};




// GET /companies/:companyId/edit
exports.edit = function(req, res, next) {

    var company = req.company;  // autoload

    res.render('companies/edit', { company: company });
};



// PUT /companies/:companyId
exports.update = function(req, res, next) {

    req.company.name  = req.body.name.trim();

    req.company.save({fields: ["name"]})
    .then(function(company) {

        req.flash('success', 'Fábrica editada con éxito.'); 

        res.redirect("/goback");
    })
    .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('companies/edit', { company: req.company });
    })
    .catch(function(error) {
      req.flash('error', 'Error al editar una fábrica: '+error.message);
      next(error);
    });
};


// DELETE /companies/:companyId
exports.destroy = function(req, res, next) {

    // Borrar la fabricatipo:
    req.company.destroy()
    .then(function() {
        req.flash('success', 'Fábrica borrada con éxito.');
        res.redirect("/reload");
    })
    .catch(function(error){
        req.flash('error', 'Error al borrar una fábrica: ' + error.message);
        next(error);
    });
};

