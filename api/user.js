
var models = require('../models');
var Sequelize = require('sequelize');

// Autoload el user asociado a :userId
exports.load = function(req, res, next, userId) {
    models.User.findById(userId)
    .then(function(user) {
        if (user) {
            req.user = user;
            next();
        } else {
            req.flash('error', 'No existe el usuario con id='+id+'.');
            throw new Error('No existe userId=' + userId);
        }
    })
    .catch(function(error) { next(error); });
};
