
// Definicion del modelo de la Opción de un resultado de un tipo de Diagnostico: Option

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
        'DTROption', 
        {   code: {
                type: DataTypes.STRING
            },
            title: {
                type: DataTypes.STRING
            },
            description: {
                type: DataTypes.TEXT
            }
        });
};
