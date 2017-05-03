var models = require('../models');

// GET /api/targets
exports.index = function (req, res, next) {

    var options = {
        order: [['CompanyId']]
    };

    //----------------

    models.Target.findAll(options)
    .then(function (targets) {
        res.json(targets);
    })
    .catch(function (error) {
        next(error);
    });
};