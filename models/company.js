// Definicion del modelo fabrica: Company

module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'Company',
        {
            name: {
                type: DataTypes.STRING,
                unique: true,
                validate: {notEmpty: {msg: "Falta el nombre de la fábrica."}}
            },
            web1: {
                type: DataTypes.STRING
            },
            web2: {
                type: DataTypes.STRING
            },
            notes: {
                type: DataTypes.TEXT
            }
        },
        {
            timestamps: true,
            paranoid: true
        });
};
