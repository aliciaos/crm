
// Definicion del modelo de Diagnostico de un Informe: Diagnose

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
        'Diagnose', 
        {   dtypeCode: {
                type: DataTypes.TEXT,
                validate: { notEmpty: {msg: "Falta el código del tipo de diagnóstico."}}
            },
            dtresultCode: {
                type: DataTypes.TEXT,
                validate: { notEmpty: {msg: "Falta el código del resultado de diagnóstico."}}
            },
        	resultNotes: {
                type: DataTypes.TEXT
            },
            dtroptionCode: {
                type: DataTypes.TEXT
            },
            optionNotes: {
                type: DataTypes.TEXT
            }
        });
};
