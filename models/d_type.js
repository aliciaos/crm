
// Definicion del modelo del Tipo de Diagnostico: DType

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
        'DType', 
        {   code: {
                type: DataTypes.STRING,
                unique: true,
                validate: { notEmpty: {msg: "Falta el código del tipo de diagnóstico."}}
            },
            title: {
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "Falta el título del tipo de diagnóstico."}}
            }
        });
};
