var models = require('../models');
var Sequelize = require('sequelize');

//-----------------------------------------------------------


// Autoload la fabrica asociado a :companyId
exports.load = function (req, res, next, companyId) {

    models.Company.findById(
        companyId,
        {
            include: [
                {
                    model: models.Customer,
                    as: "MainCustomers",
                    attributes: ['id', 'code', 'name']
                }
            ],
            order: [[ {model: models.Customer, as: "MainCustomers"}, 'name' ]]
        }
    )
    .then(function (company) {
        if (company) {
            req.company = company;
            next();
        } else {
            throw new Error('No existe ninguna fábrica con Id=' + companyId);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


//-----------------------------------------------------------

// GET /companies
exports.index = function (req, res, next) {

    var options = {};
    options.order = [['name']];

    models.Company.findAll(options)
    .then(function (companies) {
        res.render('companies/index.ejs', {companies: companies});
    })
    .catch(function (error) {
        next(error);
    });
};

//-----------------------------------------------------------


// GET /companies/:companyId
exports.show = function (req, res, next) {

    res.render('companies/show', {
        company: req.company,
        mainCustomers: req.company.MainCustomers
    });
};


//-----------------------------------------------------------

// Auxiliar
// Devuelve una promesa que al cumplirse devuelve un array con la informacion
// de todos los clientes existentes.
function getAllCustomers() {

    return models.Customer.findAll({order: [['name']]}) // Obtener info de clientes
    .then(function (customers) {
        return customers.map(function (customers) {
            return {
                id: customers.id,
                code: customers.code,
                name: customers.name
            };
        });
    });
}


//-----------------------------------------------------------


// GET /companies/new
exports.new = function (req, res, next) {

    var company = models.Company.build({name: ""});

    getAllCustomers()
    .then(function (allCustomers) {

        res.render('companies/new', {
            company: company,
            mainCustomerIds: [],
            allCustomers: allCustomers
        });
    })
    .catch(function (error) {
        next(error);
    });
};


// POST /companies/create
exports.create = function (req, res, next) {

    var company = {name: req.body.name.trim()};

    // Ids de los clientes habituales
    var mainCustomerIds = req.body.mainCustomerIds || [];

    // Guarda en la tabla Companies la nueva fabrica.
    models.Company.create(company)
    .then(function (company) {
        req.flash('success', 'Fábrica creada con éxito.');

        return company.setMainCustomers(mainCustomerIds)
        .then(function () {

            req.flash('success', 'Clientes habituales marcados con éxito.');

            res.redirect("/companies/" + company.id);
        });
    })
    .catch(Sequelize.ValidationError, function (error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }

        return getAllCustomers()
        .then(function (allCustomers) {

            res.render('companies/new', {
                company: company,
                mainCustomerIds: mainCustomerIds,
                allCustomers: allCustomers
            });
        });
    })
    .catch(function (error) {
        req.flash('error', 'Error al crear una fábrica: ' + error.message);
        next(error);
    });
};


// GET /companies/:companyId/edit
exports.edit = function (req, res, next) {

    getAllCustomers()
    .then(function (allCustomers) {

        var mainCustomerIds = req.company.MainCustomers.map(function (customer) {
            return customer.id;
        });

        res.render('companies/edit', {
            company: req.company,
            mainCustomerIds: mainCustomerIds,
            allCustomers: allCustomers
        });
    })
    .catch(function (error) {
        next(error);
    });
};


// PUT /companies/:companyId
exports.update = function (req, res, next) {

    req.company.name = req.body.name.trim();

    var mainCustomerIds = req.body.mainCustomerIds || [];

    req.company.save({fields: ["name"]})
    .then(function (company) {

        req.flash('success', 'Fábrica editada con éxito.');

        return company.setMainCustomers(mainCustomerIds)
        .then(function () {

            req.flash('success', 'Clientes habituales editados con éxito.');

            res.redirect("/companies/" + company.id);
        });
    })
    .catch(Sequelize.ValidationError, function (error) {

        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }

        return getAllCustomers()
        .then(function (allCustomers) {

            res.render('companies/edit', {
                company: req.company,
                mainCustomerIds: mainCustomerIds,
                allCustomers: allCustomers
            });
        });
    })
    .catch(function (error) {
        req.flash('error', 'Error al editar una fábrica: ' + error.message);
        next(error);
    });
};


// DELETE /companies/:companyId
exports.destroy = function (req, res, next) {

    // Borrar la fabricatipo:
    req.company.destroy()
    .then(function () {
        req.flash('success', 'Fábrica borrada con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al borrar una fábrica: ' + error.message);
        next(error);
    });
};


//-----------------------------------------------------------


// GET /companies/:companyId/statistics
exports.statistics = function (req, res, next) {

    var company = req.company;  // autoload

    Sequelize.Promise.all([

        models.Target.findAll({
            where: {CompanyId: company.id},
            include: [{
                model: models.Visit,
                include: [models.Target,
                    {model: models.Salesman, as: "Salesman"}]
            }]
        })
        .then(function (targets) {
            var counters = {};
            targets.forEach(function (target) {

                var salesmanId = target.Visit.SalesmanId || 0;
                var customerId = target.Visit.CustomerId || 0;

                counters[salesmanId] = counters[salesmanId] || {};
                counters[salesmanId][customerId] = counters[salesmanId][customerId] || {
                        total: 0,
                        pending: 0,
                        done: 0,
                        fail: 0
                    };

                if (target.success === null) {
                    counters[salesmanId][customerId].pending++;
                } else if (target.success === true) {
                    counters[salesmanId][customerId].done++;
                } else {
                    counters[salesmanId][customerId].fail++;
                }
                counters[salesmanId][customerId].total++;

            });
            return counters;
        }),

        models.Customer.findAll()
        .then(function (customers) {
            return customers.map(function (customer) {
                return {id: customer.id, name: customer.name};
            });
        }),

        models.Salesman.findAll()
        .then(function (salesmen) {
            return salesmen.map(function (salesman) {
                return {id: salesman.id, name: salesman.name};
            });
        })
    ])
    .spread(function (counters, customers, salesmen) {

        res.render('companies/statistics', {
            customers: customers,
            salesmen: salesmen,
            counters: counters,
            company: company
        });
    })
    .catch(function (error) {
        req.flash('error', 'Error al calcular las estadísticas de una fábrica: ' + error.message);

        next(error);
    });
};



