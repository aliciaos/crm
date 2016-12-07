
// Definicion del modelo del Resultado de un tipo de diagnostico: Result

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
        'DTResult', 
        {   code: {
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "Falta el código del resultado de un tipo de diagnóstico."}}
            },
            title: {
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "Falta el título del resultado de un tipo de diagnóstico."}}
            },
            description: {
                type: DataTypes.TEXT,
                validate: { notEmpty: {msg: "Falta la descripción del resultado de un tipo de diagnóstico."}}
            }
        });
};
