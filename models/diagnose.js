
// Definicion del modelo de Diagnostico de un Informe: Diagnose

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
        'Diagnose', 
        {   resultNotes: {
                type: DataTypes.TEXT
            },
            optionNotes: {
                type: DataTypes.TEXT
            }
        });
};
