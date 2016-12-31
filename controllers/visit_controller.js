
var models = require('../models');
var Sequelize = require('sequelize');

var moment = require('moment');

var paginate = require('./paginate').paginate;

//-----------------------------------------------------------


// Autoload la visita asociada a :visitId
exports.load = function(req, res, next, visitId) {

    models.Visit.findById(visitId, 
                            { include: [ models.Customer,
                                         { model: models.Salesman, as: "Salesman" } ],
                              order: [[ 'plannedFor', 'DESC' ]]
                            })
    .then(function(visit) {
        if (visit) {
            req.visit = visit;
            next();
        } else { 
            throw new Error('No existe ninguna visita con Id=' + visitId);
        }
    })
    .catch(function(error) { next(error); });
};


//-----------------------------------------------------------

// GET /visits
exports.index = function(req, res, next) {

    var options = {};

    models.Visit.count(options)
    .then(function(count) {

        // Paginacion:

        var items_per_page = 25;

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

        options.include = [ models.Customer,
                            { model: models.Salesman, as: "Salesman" } ];
        options.order = [[ 'plannedFor', 'DESC' ]];

        return models.Visit.findAll(options)
    })
    .then(function(visits) {
        res.render('visits/index.ejs', { visits: visits,
                                         moment: moment });
    })
    .catch(function(error) {
        next(error);
    });
};



// GET /visits/:visitId
exports.show = function(req, res, next) {

    res.render('visits/show', { visit: req.visit,
                                moment: moment });
};

//-------------------------------------


// Auxiliar
// Devuelve una promesa que al cumplirse devuelve un array con la informacion 
// sobre vendedores y clientes necesaria para construir un formulario de seleccion.
function infoOfSalesmenCustomers() {

    return Sequelize.Promise.all([
        models.Salesman.findAll({order: [['name']]}) // Obtener info de vendedores
        .then(function(salesmen) {
            return salesmen.map(function(salesman) {
                                    return {id:   salesman.id,
                                            name: salesman.name };
            });
        }),
        models.Customer.findAll({order: [['name']]}) // Obtener info de clientes
        .then(function(customers) {
            return customers.map(function(customer) {
                                    return {id:   customer.id,
                                            code: customer.code,
                                            name: customer.name };
            });
        })    
    ]);
}


// GET /visits/new
exports.new = function(req, res, next) {

    var visit = models.Customer.build({ 
        plannedFor:     moment(),
        fulfilledAt:    null,
        notes:          "",
        CustomerId:     0,
        SalesmanId:     0 });

    infoOfSalesmenCustomers()
    .spread(function(salesmen, customers) {
        res.render('visits/new', {  visit:        visit,
                                    customers:    customers,
                                    salesmen:     salesmen,
                                    moment:       moment });
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear una visita: ' + error.message);
        next(error);
    });
};



// POST /visits/create
exports.create = function(req, res, next) {

    var momentPlannedFor = moment(req.body.plannedFor + " 08:00", "DD-MM-YYYY");

    // Poner null si no hay fecha
    var momentFulfilledAt = null;
    if (req.body.fulfilledAt && req.body.fulfilledAt.trim()) {
        momentFulfilledAt = moment(req.body.fulfilledAt + " 08:00", "DD-MM-YYYY");
    }

    var visit = { 
        plannedFor:     momentPlannedFor,
        fulfilledAt:    momentFulfilledAt,
        notes:          req.body.notes.trim(),
        CustomerId:     req.body.customerId,
        SalesmanId:     req.body.salesmanId
    };

    // Guarda en la tabla Visits la nueva visita.
    models.Visit.create(visit)
    .then(function(visit) {
        req.flash('success', 'Visita creada con éxito.');   

        res.redirect("/visits/" + visit.id);
    })
    .catch(Sequelize.ValidationError, function(error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };
  
        return infoOfSalesmenCustomers()
        .spread(function(salesmen, customers) {
            res.render('visits/new', {  visit:          visit,
                                        customers:      customers,
                                        salesmen:       salesmen,
                                        moment:         moment });
        })
    })
    .catch(function(error) {
        req.flash('error', 'Error al crear una visita: ' + error.message);
        next(error);
    }); 
};




// GET /visits/:visitId/edit
exports.edit = function(req, res, next) {

    infoOfSalesmenCustomers()
    .spread(function(salesmen, customers) {

        res.render('visits/edit', { visit:          req.visit,
                                    customers:      customers,
                                    salesmen:       salesmen,
                                    moment:         moment });
    })
    .catch(function(error) {
        req.flash('error', 'Error al editar una visita: ' + error.message);
        next(error);
    });
};



// PUT /visits/:visitId
exports.update = function(req, res, next) {

    var momentPlannedFor = moment(req.body.plannedFor + " 08:00", "DD-MM-YYYY");

    // Poner null si no hay fecha
    var momentFulfilledAt = null;
    if (req.body.fulfilledAt && req.body.fulfilledAt.trim()) {
        momentFulfilledAt = moment(req.body.fulfilledAt + " 08:00", "DD-MM-YYYY");
    }

    req.visit.plannedFor  = momentPlannedFor,
    req.visit.fulfilledAt = momentFulfilledAt,
    req.visit.notes       = req.body.notes.trim(),
    req.visit.CustomerId  = req.body.customerId,
    req.visit.SalesmanId  = req.body.salesmanId

    req.visit.save({fields: ["plannedFor", "fulfilledAt", "notes", "CustomerId", "SalesmanId"]})
    .then(function(visit) {

        req.flash('success', 'Visita editada con éxito.'); 

        res.redirect("/visits/" + visit.id);
    })
    .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

        return infoOfSalesmenCustomers()
        .spread(function(salesmen, customers) {

            res.render('visits/edit', { visit:          req.visit,
                                        customers:      customers,
                                        salesmen:       salesmen,
                                        moment:         moment });
        });
    })
    .catch(function(error) {
      req.flash('error', 'Error al editar una visita: '+error.message);
      next(error);
    });
};


// DELETE /visits/:visitId
exports.destroy = function(req, res, next) {

    // Borrar la visita:
    req.visit.destroy()
    .then(function() {
        req.flash('success', 'Visita borrada con éxito.');
        res.redirect("/reload");
    })
    .catch(function(error){
        req.flash('error', 'Error al borrar una visita: ' + error.message);
        next(error);
    });
};

