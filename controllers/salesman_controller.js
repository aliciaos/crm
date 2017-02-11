var models = require('../models');
var Sequelize = require('sequelize');

//-----------------------------------------------------------


// Autoload el vendedor asociado a :salesmanId
exports.load = function (req, res, next, salesmanId) {

    models.Salesman.findById(salesmanId,
        {   include: [ models.User ],
            order: [['name']]
        }
    )
    .then(function (salesman) {
        if (salesman) {
            req.salesman = salesman;
            next();
        } else {
            throw new Error('No existe ningún vendedor con Id=' + salesmanId);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


//-----------------------------------------------------------

// GET /salesmen
exports.index = function (req, res, next) {

    var options = {};
    options.order = [['name']];
    options.include = [ models.User ];

    models.Salesman.findAll(options)
    .then(function (salesmen) {
        res.render('salesmen/index.ejs', {salesmen: salesmen});
    })
    .catch(function (error) {
        next(error);
    });
};


// GET /salesmen/:salesmanId
exports.show = function (req, res, next) {

    res.render('salesmen/show', {salesman: req.salesman});
};


//-------------------------------------


// Auxiliar
// Devuelve una promesa que al cumplirse devuelve un array con el username de todos los
// usuarios (User)) y que se usa para construir un formulario de seleccion.
function infoOfUsers() {

    return models.User.findAll({order: [['username']]})
        .then(function(users) {
            return users.map(function(user) {
                return {id:   user.id,
                        name: user.username };
            });
        });
}

// GET /salesmen/new
exports.new = function (req, res, next) {

    var salesman = models.Salesman.build({
        name: "",
        UserId: 0
    });

    infoOfUsers()
    .then(function(users) {

        res.render('salesmen/new', {
            salesman: salesman,
            users:    users });

    })
    .catch(function(error) {
        req.flash('error', 'Error al crear un vendedor: ' + error.message);
        next(error);
    });
};


// POST /salesmen/create
exports.create = function (req, res, next) {

    var salesman = { name:   req.body.name.trim(),
                     UserId: Number(req.body.userId) || 0 };

    // Guarda en la tabla Salesmen el nuevo vendedor.
    models.Salesman.create(salesman)
    .then(function (salesman) {
        req.flash('success', 'Vendedor creado con éxito.');

        res.redirect("/goback");
    })
    .catch(Sequelize.ValidationError, function (error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        };

        return infoOfUsers()
        .then(function(users) {
            res.render('salesmen/new', {
                salesman: salesman,
                users: users
            });
        });
    })
    .catch(function (error) {
        req.flash('error', 'Error al crear un vendedor: ' + error.message);
        next(error);
    });
};


// GET /salesmen/:salesmanId/edit
exports.edit = function (req, res, next) {

    var salesman = req.salesman;  // autoload

    infoOfUsers()
    .then(function(users) {
        res.render('salesmen/edit', {   salesman: salesman,
                                        users:    users});
    })
    .catch(function(error) {
        req.flash('error', 'Error al editar un vendedor: ' + error.message);
        next(error);
    });
};


// PUT /salesmen/:salesmanId
exports.update = function (req, res, next) {

    req.salesman.name   = req.body.name.trim();
    req.salesman.UserId = Number(req.body.userId) || 0;

    req.salesman.save({fields: ["name", "UserId"]})
    .then(function (salesman) {

        req.flash('success', 'Vendedor editado con éxito.');

        res.redirect("/goback");
    })
    .catch(Sequelize.ValidationError, function (error) {

        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }
        ;

        return infoOfUsers()
        .then(function(users) {
            res.render('salesmen/edit', {
                salesman: req.salesman,
                users: users
            });
        });
    })
    .catch(function (error) {
        req.flash('error', 'Error al editar un vendedor: ' + error.message);
        next(error);
    });
};


// DELETE /salesmen/:salesmanId
exports.destroy = function (req, res, next) {

    // Borrar el vendedor:
    req.salesman.destroy()
    .then(function () {
        req.flash('success', 'Vendedor borrado con éxito.');
        res.redirect("/reload");
    })
    .catch(function (error) {
        req.flash('error', 'Error al borrar un vendedor: ' + error.message);
        next(error);
    });
};

