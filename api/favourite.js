
var models = require('../models');

// PUT /users/tokenOwner/favourites/:visitId
exports.add = function(req, res, next) {

    const tokenUserId = req.token.userId;

    req.visit.addFan(tokenUserId)
    .then(function() {
        res.send(200);
    })
    .catch(function(error) {
        next(error);
    });
};


// DELETE /users/tokenOwner/favourites/:visitId
exports.del = function(req, res, next) {

    const tokenUserId = req.token.userId;

    req.visit.removeFan(tokenUserId)
    .then(function() {
            res.send(200);
    })
    .catch(function(error) {
        next(error);
    });
};
