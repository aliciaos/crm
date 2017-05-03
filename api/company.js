var models = require('../models');

// GET /api/companies
exports.index = function (req, res, next) {

    var options = {
        order: [['name']]
    };

    //----------------

    models.Company.findAll(options)
    .then(function (companies) {
        res.json(companies);
    })
    .catch(function (error) {
        next(error);
    });
};