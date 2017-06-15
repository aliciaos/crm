var models = require('../models');


//-----------------------------------------------------------


// Autoload el vendedor asociado a :salesmanId
exports.load = function (req, res, next, salesmanId) {

    models.Salesman.findById(salesmanId,
        {
            include: [
                models.User,
                {model: models.Attachment, as: 'Photo'}
            ],
            order: [['name']]
        }
    )
    .then(function (salesman) {
        if (salesman) {
            req.salesman = salesman;
            next();
        } else {
            throw new Error('No existe ningún vendedor con Id=' + salesmanId);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


//-----------------------------------------------------------


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
