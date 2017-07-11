var models = require('../models');
var Sequelize = require('sequelize');

var moment = require('moment');

//-----------------------------------------------------------


// Autoload la visita asociada a :visitId
exports.load = function (req, res, next, visitId) {

    models.Visit.findById(visitId)
    .then(function (visit) {
        if (visit) {
            req.visit = visit;
            next();
        } else {
            throw new Error('No existe ninguna visita con Id=' + visitId);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


//-----------------------------------------------------------


// MW que permite el paso solamente si el vendedor de la visita esta asociado al usuario logeado.
exports.salesmanIsLoggedUser_Required = function (req, res, next) {

    var loggedUserId = req.session.user.id;

    models.Salesman.findOne({
        where: {UserId: loggedUserId}
    })
    .then(function (salesman) {
        if (salesman) {
            next();
        } else {
            console.log('Ruta prohibida: el usuario logeado no es el vendedor.');
            res.send(403);
        }
    })
    .catch(function (error) {
        next(error);
    });
};

//-----------------------------------------------------------

// GET /users/:userId/visits
//
// Visitas de un User.
// Hay que buscar el vendedor asociado al user indicado,
// pero puede que no exista un vendedor.
exports.indexUser = function (req, res, next) {

    models.Salesman.findOne({
        where: {UserId: req.user.id}
    })
    .then(function (salesman) {
        if (salesman) {
            res.redirect("/api/salesmen/" + salesman.id + "/visits");
        } else {
            res.json([]);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


// GET /users/logged/visits
exports.indexLoggedUser = function (req, res, next) {

    var loggedUserId = req.session.user.id;

    models.Salesman.findOne({
        where: {UserId: loggedUserId}
    })
    .then(function (salesman) {
        if (salesman) {
            res.redirect("/api/salesmen/" + salesman.id + "/visits");
        } else {
            res.json([]);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


// GET /visits
// GET /customers/:customerId/visits
// GET /salesmen/:salesmanId/visits
// GET /salesmen/:salesmanId/customers/:customerId/visits
exports.index = function (req, res, next) {

    var options = {};
    options.where = {};
    options.include = [];
    options.order = [];

    //----------------

    var searchcustomer = req.query.searchcustomersits
        || '';
    var searchCompanyId = req.query.searchCompanyId || "";
    var searchsalesman = req.query.searchsalesman || '';
    var searchfavourites = req.query.searchfavourites || "";


    // Visitas de un cliente especificado en la URL:
    if (!req.customer) {

        // Incluir los clientes no archivados:
        var customeInclude = {
            model: models.Customer,
            where: {
                $and: [{
                    archived: false
                }]
            }
        };

        // Filtrar: Clientes de la fabrica especificada en la query:
        if (searchCompanyId) {
            customeInclude.include = [{
                model: models.Company,
                as: "MainCompanies",
                where: {id: searchCompanyId}
            }];
        }

        // Filtrar: Codigo y nombre del cliente.
        if (searchcustomer) {
            var search_like = "%" + searchcustomer.replace(/ +/g, "%") + "%";

            var likeCondition;
            if (!!process.env.DATABASE_URL && /^postgres:/.test(process.env.DATABASE_URL)) {
                // el operador $iLike solo funciona en pastgres
                likeCondition = {$iLike: search_like};
            } else {
                likeCondition = {$like: search_like};
            }

            customeInclude.where.$and.push({
                $or: [
                    {code: likeCondition},
                    {name: likeCondition}
                ]
            });
        }
        options.include.push(customeInclude);

    } else {
        options.include.push({
            model: models.Customer,
            where: {
                id: req.customer.id
            }
        });
    }


    // Visitas de un vendedor especificado en la URL:
    if (!req.salesman) {
        if (searchsalesman) {
            var search_like = "%" + searchsalesman.replace(/ +/g, "%") + "%";

            var likeCondition;
            if (!!process.env.DATABASE_URL && /^postgres:/.test(process.env.DATABASE_URL)) {
                // el operador $iLike solo funciona en pastgres
                likeCondition = {$iLike: search_like};
            } else {
                likeCondition = {$like: search_like};
            }

            // CUIDADO: Estoy retocando el include existente.
            options.include.push({
                model: models.Salesman,
                as: "Salesman",
                where: {name: likeCondition},
                include: [{model: models.Attachment, as: "Photo"}]
            });
        } else {
            // CUIDADO: Estoy retocando el include existente.
            options.include.push({
                model: models.Salesman,
                as: "Salesman",
                include: [{model: models.Attachment, as: "Photo"}]
            });
        }
    } else {
        // CUIDADO: Estoy retocando el include existente.
        options.include.push({
            model: models.Salesman,
            as: "Salesman",
            where: {id: req.salesman.id},
            include: [{model: models.Attachment, as: "Photo"}]
        });
    }


    // Filtrar por mis visitas favoritas
    if (searchfavourites) {

        // CUIDADO: Estoy retocando el include existente.
        options.include.push({
            model: models.User,
            as: "Fans",
            where: {id: req.session.user.id}
        });
    } else {

        // CUIDADO: Estoy retocando el include existente.
        options.include.push({
            model: models.User,
            as: "Fans"
        });
    }


    //----------------


    options.include.push({
        model: models.Target,
        include: [
            {
                model: models.Company
            },
            {
                model: models.TargetType
            }
        ]
    });

    options.order.push(['plannedFor', 'DESC']);

    models.Visit.findAll(options)
    .then(function (visits) {

        // Marcar las visitas que son favoritas
        visits.forEach(function (visit) {
            visit.favourite = visit.Fans.some(function (fan) {
                return fan.id == req.session.user.id;
            });
        });

        res.json(visits);
    })
    .catch(function (error) {
        next(error);
    });
};



// PUT /visits/:visitId
//
// Solo se actualizan los campos fulfilledAt y notes.
exports.update = function (req, res, next) {

    // Poner null si no hay fecha de realizacion
    var momentFulfilledAt = null;
    if (req.body.fulfilledAt && req.body.fulfilledAt.trim()) {
        momentFulfilledAt = moment(req.body.fulfilledAt + " 08:00", "DD-MM-YYYY");
    }
    req.visit.fulfilledAt = momentFulfilledAt;

    // Hay notas?
    if (req.body.notes) {
        req.visit.notes = req.body.notes.trim();
    }

    req.visit.save({fields: ["fulfilledAt", "notes"]})
    .then(function (visit) {

        console.log('API: Visita ' + visit.id + ' editada con éxito.');

        res.sendStatus(200);
    })
    .catch(Sequelize.ValidationError, function (error) {

        console.log('API: Errores en actualizacion:');
        for (var i in error.errors) {
            console.log('API error: ', error.errors[i].value);
        }

        res.sendStatus(409);
    })
    .catch(function (error) {
        console.log('API error: ' + error.message);
        next(error);
    });
};