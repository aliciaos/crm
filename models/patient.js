
// Definicion del modelo Patient:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
        'Patient', 
        {   name: {
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "Falta el nombre de la paciente."}}
            },
            address: { 
                type: DataTypes.STRING
            },
            city: { 
                type: DataTypes.STRING
            },
            phone: { 
                type: DataTypes.STRING
            },
            doctor: { 
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "Falta el nombre del doctor."}}
            }
        });
};
