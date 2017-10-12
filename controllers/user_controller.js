
var models = require('../models');
var Sequelize = require('sequelize');
var paginate = require('./paginate').paginate;
var authentication = require('../helpers/authentication');

var moment = require('moment');

// Autoload el user asociado a :userId
exports.load = function(req, res, next, userId) {
    models.User.findById(userId)
        .then(function(user) {
            if (user) {
                req.user = user;
                next();
            } else {
                req.flash('error', 'No existe el usuario con id='+userId+'.');
                throw new Error('No existe userId=' + userId);
            }
        })
        .catch(function(error) { next(error); });
};


// GET /users
exports.index = function(req, res, next) {

    var options = {};
    options.where = {};
    options.include = [];
    options.order = [];

    //----------------

    models.User.count(options)
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

        options.order.push( ['login'] );

        return models.User.findAll(options);
    })
    .then(function(users) {
        res.render('users/index', { users: users });
    })
    .catch(function(error) { next(error); });
};


// GET /users/:id
exports.show = function(req, res, next) {
    res.render('users/show', {user: req.user});
};


// GET /users/new
exports.new = function(req, res, next) {
    var user = { login: "",
                 password: "" };

    res.render('users/new', { user: user });
};


// POST /users
exports.create = function(req, res, next) {
    var user = models.User.build({ login: req.body.user.login,
                                   password: req.body.user.password
                                });

    // El login debe ser unico:
    models.User.find({where: {login: req.body.user.login}})
    .then(function(existing_user) {
        if (existing_user) {
            var emsg = "El usuario \""+ req.body.user.login +"\" ya existe."
            req.flash('error', emsg);
            res.render('users/new', { user: user });
        } else {

            // Crear el valor de Token:
            user.token = authentication.createToken();

            // Guardar en la BBDD
            return user.save({fields: ["login", "token", "password", "salt"]})
                .then(function(user) { // Renderizar pagina de usuarios
                    req.flash('success', 'Usuario creado con éxito.');
                    res.redirect("/users/" + user.id);
                })
                .catch(Sequelize.ValidationError, function(error) {
                    req.flash('error', 'Errores en el formulario:');
                    for (var i in error.errors) {
                        req.flash('error', error.errors[i].value);
                    };
                    res.render('users/new', { user: user });
                });
        }
    })
    .catch(function(error) {
        next(error);
    });
};


// GET /users/:id/edit
exports.edit = function(req, res, next) {
    res.render('users/edit', { user: req.user });  // req.user: instancia de user cargada con autoload
};            


// PUT /users/:id
exports.update = function(req, res, next) {

    // req.user.login  = req.body.user.login; // No se permite su edicion

    var fields_to_update = [];

    // ¿Cambio el password?
    if (req.body.user.password) {
        console.log('Hay que actualizar el password');
        req.user.password = req.body.user.password;
        fields_to_update.push('salt');
        fields_to_update.push('password');
    }

    req.user.save({fields: fields_to_update})
    .then(function (user) {
        req.flash('success', 'Usuario actualizado con éxito.');
        res.redirect('/users/' + user.id);
    })
    .catch(Sequelize.ValidationError, function (error) {
        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }

        res.render('users/edit', {user: req.user});
    })
    .catch(function (error) {
        next(error);
    });
};

//-----------------------------------------------------------


// DELETE /users/:id
exports.destroy = function(req, res, next) {
    req.user.destroy()
        .then(function() {

            // Borrando usuario logeado.
            if (req.session.user && req.session.user.id === req.user.id) {
                // borra la sesión
                delete req.session.user;
            }

            req.flash('success', 'Usuario eliminado con éxito.');
            res.redirect('/reload');
        })
        .catch(function(error){ 
            next(error); 
        });
};


//-----------------------------------------------------------


// PUT /users/:id/token
// Genera y guarda un nuevo token
exports.createToken = function(req, res, next) {

    req.user.token = authentication.createToken();

    req.user.save({fields: ["token"]})
    .then(function(user) {
        req.flash('success', 'Token de Usuario generado con éxito.');
        res.redirect('/reload');
    })
    .catch(function(error) {
        next(error);
    });
};

//-----------------------------------------------------------

