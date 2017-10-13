
return;

var models = require('../models');
var Sequelize = require('sequelize');

//-----------------------------------------------------------


// Devuelve una promesa que al cumplirse devuelve un array con informacion
// de todos los vendedores.
// Devuelve su id y nombre.
exports.getAllSalesmenInfo = function () {

    return models.Salesman.findAll({
        order: [['name']]
    })
    .then(function (salesmen) {
        return salesmen.map(function (salesman) {
            return {
                id: salesman.id,
                name: salesman.name
            };
        });
    });
};
