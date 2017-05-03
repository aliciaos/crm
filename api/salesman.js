var models = require('../models');



// GET /api/salesmen
exports.index = function (req, res, next) {

    var options = {};
    options.where = {};
    options.order = [['name']];
    options.include = [
        models.User,
        {model: models.Attachment, as: 'Photo'}
    ];

    models.Salesman.findAll(options)
    .then(function (salesmen) {
        res.json(salesmen);
    })
    .catch(function (error) {
        next(error);
    });
};
