var models = require('../models');

// GET /api/targetTypes
exports.index = function (req, res, next) {

    var options = {
        order: [['name']]
    };

    //----------------

    models.TargetType.findAll(options)
    .then(function (targetTypes) {
        res.json(targetTypes);
    })
    .catch(function (error) {
        next(error);
    });
};