var models = require('../models');


// GET /api/customers
exports.index = function (req, res, next) {

    var options = {
        where: {archived: false},
        order: [['name']]
    };

    models.Customer.findAll(options)
    .then(function (customers) {

        res.json(customers);

    })
    .catch(function (error) {
        next(error);
    });
};