
var models = require('../models');

// PUT /users/:userId/favourites/:visitId
exports.add = function(req, res, next) {

    req.user.addFavourite(req.visit)
    .then(function() {
        if (req.xhr) {
            res.send(200);
        } else {
            var redir = req.body.redir || '/users/' + req.user.id + '/favourites';
            res.redirect("/reload");
        }
    })
    .catch(function(error) {
        next(error);
    });
};


// DELETE /users/:userId/favourites/:visitId
exports.del = function(req, res, next) {

    req.user.removeFavourite(req.visit)
    .then(function() {
        if (req.xhr) {
            res.send(200);
        } else {
            var redir = req.body.redir || '/users/' + req.user.id + '/favourites';
            res.redirect("/reload");
        }
    })
    .catch(function(error) {
        next(error);
    });
};
