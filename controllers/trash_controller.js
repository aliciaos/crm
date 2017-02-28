
var models = require('../models');
var Sequelize = require('sequelize');
var paginate = require('./paginate').paginate;
var cloudinary = require('cloudinary');

var moment = require('moment');

//-----------------------------------------------------------

// GET /trash
exports.index = function (req, res, next) {

    var options = {
        paranoid: false,
        where: {deletedAt: {$not: null}}
    };

    Sequelize.Promise.all([
        models.Customer.count(options),     // Contar clientes
        models.Visit.count(options),        // Contar visitas
        models.Company.count(options),      // Contar fabricas
        models.TargetType.count(options),   // Contar vendedores
        models.Salesman.count(options),     // Contar targettypes
        models.User.count(options)          // Contar usuarios
    ])
    .spread(function (customersCount,
                      visitsCount,
                      companiesCount,
                      targettypesCount,
                      salesmenCount,
                      usersCount) {

        res.render("trash/index", {
            customersCount: customersCount,
            visitsCount: visitsCount,
            companiesCount: companiesCount,
            targettypesCount: targettypesCount,
            salesmenCount: salesmenCount,
            usersCount: usersCount
        });
    })
    .catch(function (error) {
        next(error);
    });


};

//-----------------------------------------------------------

// GET /trash/companies
exports.companies = function (req, res, next) {

    var options = {
        paranoid: false,
        where: { deletedAt: {$not: null} }
    };

    options.order = [['deletedAt', 'DESC']];

    //----------------

    models.Company.findAll(options)
    .then(function (companies) {
        res.render('trash/companies.ejs', {
            companies: companies,
            moment: moment
        });
    })
    .catch(function (error) {
        next(error);
    });
};

//-----------------------------------------------------------

// POST /trash/companies/:companyId_wal
exports.companyRestore = function (req, res, next) {

    var companyId = req.params["companyId_wal"];

    var options = {where: {id: companyId} };

    // Restaurar (sacar de la papelera) la fabrica:
    models.Company.restore(options)
    .then(function () {
        req.flash('success', 'Fábrica restaurada con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al restaurar una fábrica: ' + error.message);
        next(error);
    });
};

//-----------------------------------------------------------

// DELETE /trash/companies/:companyId_wal
exports.companyDestroy = function (req, res, next) {

    var companyId = req.params["companyId_wal"];

    var options = {
        where: {id: companyId},
        force: true
    };

    // Destruir definitivamente (no se guarda en la papelera) la fabrica:
    models.Company.destroy(options)
    .then(function () {
        req.flash('success', 'Fábrica destruida con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al destruir una fábrica: ' + error.message);
        next(error);
    });
};


//-----------------------------------------------------------

// GET /trash/customers
//
// Lista los clientes existentes en la papelera.
exports.customers = function (req, res, next) {

    var options = {
        paranoid: false,
        where: { deletedAt: {$not: null} }
    };

    models.Customer.count(options)
    .then(function (count) {

        // Paginacion:
        var items_per_page = 50;

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
    .then(function (pagination) {

            options.offset = pagination.offset;
            options.limit = pagination.limit;

            options.order = [['deletedAt', 'DESC']];

            return models.Customer.findAll(options);
        }
    )
    .then(function (customers) {

        res.render(
            'trash/customers', {
                customers: customers,
                moment: moment
            });
    })
    .catch(function (error) {
        next(error);
    });
};

//-----------------------------------------------------------

// POST /trash/customers/:customerId_wal
exports.customerRestore = function (req, res, next) {

    var customerId = req.params["customerId_wal"];

    var options = {where: {id: customerId} };

    // Restaurar (sacar de la papelera) el cliente:
    models.Customer.restore(options)
    .then(function () {
        req.flash('success', 'Cliente restaurado con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al restaurar un cliente: ' + error.message);
        next(error);
    });
};

//-----------------------------------------------------------

// DELETE /trash/customers/:customerId_wal
exports.customerDestroy = function (req, res, next) {

    var customerId = req.params["customerId_wal"];

    var options = {
        where: {id: customerId},
        force: true
    };

    // Destruir definitivamente (no se guarda en la papelera) el cliente:
    models.Customer.destroy(options)
    .then(function () {
        req.flash('success', 'Cliente destruido con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al destruir un cliente: ' + error.message);
        next(error);
    });
};

//-----------------------------------------------------------

// GET /trash/salesmen
exports.salesmen = function (req, res, next) {

    var options = {
        paranoid: false,
        where: { deletedAt: {$not: null} },
        include: [
            {model: models.Attachment, as: 'Photo'}
        ]
    };

    options.order = [['deletedAt', 'DESC']];

    //----------------

    models.Salesman.findAll(options)
    .then(function (salesmen) {
        res.render('trash/salesmen', {
            salesmen: salesmen,
            moment: moment
        });
    })
    .catch(function (error) {
        next(error);
    });
};


//-----------------------------------------------------------

// POST /trash/salesmen/:salesmanId_wal
exports.salesmanRestore = function (req, res, next) {

    var salesmanId = req.params["salesmanId_wal"];

    var options = {where: {id: salesmanId} };

    // Restaurar (sacar de la papelera) el vendedor:
    models.Salesman.restore(options)
    .then(function () {
        req.flash('success', 'Vendedor restaurado con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al restaurar un vendedor: ' + error.message);
        next(error);
    });
};

//-----------------------------------------------------------

// DELETE /trash/salesmen/:salesmanId_wal
exports.salesmanDestroy = function (req, res, next) {

    var salesmanId = req.params["salesmanId_wal"];

    // Buscar el vendedor borrado y cargar tambien su foto:
    models.Salesman.findById(salesmanId, {
        include: [
            {model: models.Attachment, as: 'Photo'}
        ],
        paranoid: false,
    })
    .then(function (salesman) {
        if (!salesman) {
            throw new Error('No existe ningún vendedor borrado con Id=' + salesmanId);
        }

        // ¿Hay foto?
        if (!salesman.Photo) {
            return salesman;
        }

        // Borrar la foto en Cloudinary.
        cloudinary.api.delete_resources(salesman.Photo.public_id);

        // Borrar el attachment.
        return salesman.Photo.destroy()
        .then(function () {
            return salesman;
        });
    })
    .then(function (salesman) {
        // borrar el vendedor:

        return salesman.destroy({force: true});
    })
    .then(function () {
        req.flash('success', 'Vendedor destruido con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al destruir un vendedor: ' + error.message);
        next(error);
    });
};

//-----------------------------------------------------------


// GET /trash/targettypes
exports.targettypes = function (req, res, next) {

    var options = {
        paranoid: false,
        where: { deletedAt: {$not: null} }
    };

    options.order = [['deletedAt', 'DESC']];

    //----------------


    models.TargetType.findAll(options)
    .then(function (targettypes) {
        res.render('trash/targettypes', {
            targettypes: targettypes,
            moment: moment
        });
    })
    .catch(function (error) {
        next(error);
    });
};


//-----------------------------------------------------------

// POST /trash/targettypes/:targettypeId_wal
exports.targettypeRestore = function (req, res, next) {

    var targettypeId = req.params["targettypeId_wal"];

    var options = {where: {id: targettypeId} };

    // Restaurar (sacar de la papelera) el tipo de objetivo:
    models.TargetType.restore(options)
    .then(function () {
        req.flash('success', 'Tipo de objetivo restaurado con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al restaurar un tipo de objetivo: ' + error.message);
        next(error);
    });
};

//-----------------------------------------------------------

// DELETE /trash/targettypes/:targettypeId_wal
exports.targettypeDestroy = function (req, res, next) {

    var targettypeId = req.params["targettypeId_wal"];

    var options = {
        where: {id: targettypeId},
        force: true
    };

    // Destruir definitivamente (no se guarda en la papelera) un tipo de objetivo:
    models.TargetType.destroy(options)
    .then(function () {
        req.flash('success', 'Tipo de objetivo destruido con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al destruir un tipo de objetivo: ' + error.message);
        next(error);
    });
};


//-----------------------------------------------------------


// GET /trash/users
exports.users = function (req, res, next) {

    var options = {
        paranoid: false,
        where: { deletedAt: {$not: null} }
    };

    options.order = [['deletedAt', 'DESC']];

    //----------------

    models.User.findAll(options)
    .then(function (users) {
        res.render('trash/users', {
            users: users,
            moment: moment
        });
    })
    .catch(function (error) {
        next(error);
    });
};


//-----------------------------------------------------------

// POST /trash/users/:userId_wal
exports.userRestore = function (req, res, next) {

    var userId = req.params["userId_wal"];

    var options = {where: {id: userId} };

    // Restaurar (sacar de la papelera) un usuario:
    models.User.restore(options)
    .then(function () {
        req.flash('success', 'Usuario restaurado con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al restaurar un usuario: ' + error.message);
        next(error);
    });
};

//-----------------------------------------------------------

// DELETE /trash/users/:userId_wal
exports.userDestroy = function (req, res, next) {

    var userId = req.params["userId_wal"];

    var options = {
        where: {id: userId},
        force: true
    };

    // Destruir definitivamente (no se guarda en la papelera) un usuario:
    models.User.destroy(options)
    .then(function () {
        req.flash('success', 'Usuario destruido con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al destruir un usuario: ' + error.message);
        next(error);
    });
};



//-----------------------------------------------------------


// GET /trash/visits
exports.visits = function (req, res, next) {

    var options = {
        paranoid: false,
        where: {deletedAt: {$not: null}}
    };

    //----------------

    models.Visit.count(options)
    .then(function (count) {

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
    .then(function (pagination) {

        options.offset = pagination.offset;
        options.limit = pagination.limit;

        options.include = [
            models.Target,
            models.Customer,
            {
                model: models.Salesman,
                as: "Salesman",
                include: [{model: models.Attachment, as: 'Photo'}]
            }
        ];

        options.order = [['deletedAt', 'DESC']];

        return models.Visit.findAll(options)
    })
    .then(function (visits) {

        res.render('trash/visits', {
            visits: visits,
            moment: moment
        });
    })
    .catch(function (error) {
        next(error);
    });
};


//-----------------------------------------------------------

// POST /trash/visits/:visitId_wal
exports.visitRestore = function (req, res, next) {

    var visitId = req.params["visitId_wal"];

    var options = {where: {id: visitId} };

    // Restaurar (sacar de la papelera) la visita:
    models.Visit.restore(options)
    .then(function () {
        req.flash('success', 'Visita restaurada con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al restaurar una visita: ' + error.message);
        next(error);
    });
};

//-----------------------------------------------------------

// DELETE /trash/visits/:visitId_wal
exports.visitDestroy = function (req, res, next) {

    var visitId = req.params["visitId_wal"];

    var targetsOptions = {
        where: {VisitId: visitId},
        force: true
    };

    var visitOptions = {
        where: {id: visitId},
        force: true
    };

    // Destruir definitivamente (no se guarda en la papelera) los objetivos de la
    // visita y la visita:
    Promise.all([
        models.Target.destroy(targetsOptions),
        models.Visit.destroy(visitOptions)
    ])
    .then(function () {
        req.flash('success', 'Visita y sus objetivos destruidos con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al destruir una visita y sus objetivos: ' + error.message);
        next(error);
    });
};


//-----------------------------------------------------------

