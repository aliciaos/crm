var models = require('../models');


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
            attributes: ['id'],
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
                attributes: ['id'],
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
            attributes: ['id'],
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
                attributes: ['id'],
                where: {name: likeCondition}
            });
        } else {
            // CUIDADO: Estoy retocando el include existente.
            options.include.push({
                model: models.Salesman,
                as: "Salesman",
                attributes: ['id']
            });
        }
    } else {
        // CUIDADO: Estoy retocando el include existente.
        options.include.push({
            model: models.Salesman,
            as: "Salesman",
            attributes: ['id'],
            where: {id: req.salesman.id}
        });
    }


    // Filtrar por mis visitas favoritas
    if (searchfavourites) {

        // CUIDADO: Estoy retocando el include existente.
        options.include.push({
            model: models.User,
            as: "Fans",
            attributes: ['id', 'username'],
            where: {id: req.session.user.id}
        });
    } else {

        // CUIDADO: Estoy retocando el include existente.
        options.include.push({
            model: models.User,
            as: "Fans",
            attributes: ['id', 'username']
        });
    }


    //----------------


    options.include.push({
        model: models.Target,
        include: [
            {
                model: models.Company,
                attributes: ['id']
            },
            {
                model: models.TargetType,
                attributes: ['id']
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
