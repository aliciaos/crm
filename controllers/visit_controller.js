
var models = require('../models');
var Sequelize = require('sequelize');

var moment = require('moment');

var paginate = require('./paginate').paginate;

//-----------------------------------------------------------


// Autoload la visita asociada a :visitId
exports.load = function(req, res, next, visitId) {

    models.Visit.findById(visitId, 
                            { include: [ { model: models.Target,
                                           include: [ models.Company,
                                                      models.TargetType
                                                    ] 
                                         },
                                         models.Customer,
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
    options.where = {};

    // Nota Mas abajo (en searchcustomer) se hace un include de clientes.
    options.include = [
        models.Target
    ];

    //----------------

    // Query: En la query pueden pasarnos el campo forceSalesmanId para mostrar solo las
    // visitas de un vendedor.
    var forceSalesmanId = req.query.forceSalesmanId || 0;

    //----------------


    // Busquedas por fecha de planificacion: entre dos fechas
    var searchdateafter = req.query.searchdateafter || '';
    var searchdatebefore = req.query.searchdatebefore || '';

    var momentafter = moment(searchdateafter + " 08:00", "DD-MM-YYYY");
    if (searchdateafter && !momentafter.isValid()) {
        req.flash("error", "La fecha " + searchdateafter + " no es válida.");
        momentafter = moment("01-01-1900 08:00", "DD-MM-YYYY");
    }
    var searchmomentafter = momentafter.toDate();

    var momentbefore = moment(searchdatebefore + " 08:00", "DD-MM-YYYY");
    if (searchdatebefore && !momentbefore.isValid()) {
        req.flash("error", "La fecha " + searchdatebefore + " no es válida.");
        var momentbefore = moment("31-12-9999 08:00", "DD-MM-YYYY");
    }
    var searchmomentbefore = momentbefore.toDate();

    if (searchdateafter !== "") {
        if (searchdatebefore !== "") {
            options.where.plannedFor = { $between: [ searchmomentafter, searchmomentbefore] };
        } else {
            options.where.plannedFor = { $gte: searchmomentafter };
        }
    } else {
        if (searchdatebefore !== "") {
            options.where.plannedFor = { $lte: searchmomentbefore };
        }
    }


    if (!req.customer) {
        // Busquedas por cliente:
        var searchcustomer = req.query.searchcustomer || '';
        if (searchcustomer) {
            var search_like = "%" + searchcustomer.replace(/ +/g, "%") + "%";

            // CUIDADO: Estoy retocando el include existente.
            options.include.push({
                model: models.Customer,
                where: {
                    $or: [
                        {code: {$like: search_like}},
                        {name: {$like: search_like}}
                    ]
                }
            });
        } else {
            // CUIDADO: Estoy retocando el include existente.
            options.include.push(models.Customer);
        }
    } else {
        // CUIDADO: Estoy retocando el include existente.
        options.include.push({
            model: models.Customer,
            where: {id: req.customer.id}
        });
    }


    if (!forceSalesmanId) {
        // Busquedas por vendedor:
        var searchsalesman = req.query.searchsalesman || '';
        if (searchsalesman) {
            var search_like = "%" + searchsalesman.replace(/ +/g, "%") + "%";

            // CUIDADO: Estoy retocando el include existente.
            options.include.push({
                model: models.Salesman,
                as: "Salesman",
                where: {name: {$like: search_like}}
            });
        } else {
            // CUIDADO: Estoy retocando el include existente.
            options.include.push({model: models.Salesman, as: "Salesman"});
        }
    } else {
        // CUIDADO: Estoy retocando el include existente.
        options.include.push({
            model: models.Salesman,
            as: "Salesman",
            where: {id: forceSalesmanId}
        });
    }


    //----------------


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
        options.limit = pagination.limit;

        options.order = [['plannedFor', 'DESC']];

        return models.Visit.findAll(options)
    })
    .then(function (visits) {
        res.render('visits/index.ejs', {
            visits: visits,
            moment: moment,
            searchdateafter: searchdateafter,
            searchdatebefore: searchdatebefore,
            searchcustomer: searchcustomer,
            searchsalesman: searchsalesman,
            customer: req.customer,
            forceSalesmanId: forceSalesmanId
        });
    })
    .catch(function (error) {
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
// Devuelve una promesa que al cumplirse devuelve un array con la siguiente informacion:
//   - vendedores: id y nombre de todos los vendedores.
//   - clientes:  id, codigo y nombre de todos los clientes.
// Esta informacion se usa para construir formularios de seleccion, y seleccionar un valor
// en ellos.
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

    // En la query me pueden sugerir un cliente a usar.
    var customerId = Number(req.query.customerId) || 0;

    // Proponer al usuario logeado como vendedor.
    // No siempre puede hacerse esto.
    var salesmanId = 0;

    // Uso una promesa para buscar el vendedor asociado al usuario logeado.
    new Sequelize.Promise(function (resolve, reject) {

        // Nota que si estoy aqui, estoy logeado.

        return models.Salesman.findOne({where: {UserId: req.session.user.id}})
        .then(function (salesman) {
            salesmanId = salesman && salesman.id || 0;
            resolve();
        });
    })
    .then(function () {
        return infoOfSalesmenCustomers();
    })
    .spread(function (salesmen, customers) {

        var visit = models.Visit.build({
            plannedFor: moment(),
            fulfilledAt: null,
            notes: "",
            CustomerId: customerId,
            SalesmanId: salesmanId
        });

        res.render('visits/new', {
            visit: visit,
            customers: customers,
            salesmen: salesmen,
            moment: moment
        });
    })
    .catch(function (error) {
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

    var visit = {   plannedFor:     momentPlannedFor,
                    fulfilledAt:    momentFulfilledAt,
                    notes:          req.body.notes.trim(),
                    CustomerId:     Number(req.body.customerId) || 0,
                    SalesmanId:     Number(req.body.salesmanId) || 0
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
        });
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
    req.visit.CustomerId  = Number(req.body.customerId) || 0,
    req.visit.SalesmanId  = Number(req.body.salesmanId) || 0

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

