
// Definicion del modelo de la Opción de un resultado de un tipo de Diagnostico: Option

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
        'DTROption', 
        {   code: {
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "Falta el código de la opción del diagnóstico."}}
            },
            title: {
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "Falta el código de la opción del diagnóstico."}}
            },
            description: {
                type: DataTypes.TEXT,
                validate: { notEmpty: {msg: "Falta la descripción de la opción del diagnóstico."}}
            }
        });
};
