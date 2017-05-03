
var models = require('../models');


// Si se supera el tiempo de inactividad indicado por esta variable,
// sin que el usuario solicite nuevas paginas, entonces se cerrara
// la sesion del usuario.
// El valor esta en milisegundos.
// 30 minutos
var maxIdleTime = 30*60*1000;



// Middleware: Se requiere hacer login.
//
// Si el usuario ya hizo login anteriormente entonces existira
// el objeto user en req.session, por lo que continuo con los demas
// middlewares o rutas.
// Si no existe req.session.user, entonces es que aun no he hecho
// login, por lo que respondemos con un error.
//
exports.loginRequired = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        // Se necesita autenticación.
        res.sendStatus(401);    }
};


/*
 * Autenticar un usuario: Comprueba si el usuario esta registrado en users
 *
 * Devuelve una Promesa que busca el usuario con el login dado y comprueba su password.
 * Si la autenticacion es correcta, la promesa se satisface devuelve un objeto con el User.
 * Si la autenticacion falla, la promesa se satisface pero devuelve null.
 */
var authenticate = function(login, password) {

    return models.User.findOne({where: {username: login}})
    .then(function(user) {
        if (user && user.verifyPassword(password)) {
            return user;
        } else {
            return null;
        }
    });
};

// POST /api/session   -- Crear la sesion si usuario se autentica
exports.create = function (req, res, next) {

    var login = req.body.login;
    var password = req.body.password;

    authenticate(login, password)
    .then(function (user) {
        if (user) {
            // Crear req.session.user y guardar campos id y username
            // La sesión se define por la existencia de: req.session.user
            // Tambien guardo la hora de expiracion de la sesion por no actividad.
            req.session.user = {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
                expires: Date.now() + maxIdleTime
            };

            res.sendStatus(200);
        } else {
            // La autenticación ha fallado.
            res.sendStatus(401);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


// DELETE /api/session   -- Destruir sesion
exports.destroy = function (req, res, next) {

    delete req.session.user;

    res.sendStatus(200);
};
