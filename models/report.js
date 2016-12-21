
// Definicion del modelo Patient:

module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        'Report', 
        {   doctor: { 
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "Falta el nombre del doctor."}}
            },
            receptionAt: { 
                type: DataTypes.DATE,
                validate: {
                    isDate: {
                        msg: "La fecha de recepción no es una fecha válida."
                    }
                }
            },
            lastMenstruationAt: { 
                type: DataTypes.STRING 
            },
            cycleDay: { 
                type: DataTypes.INTEGER 
            },
            printed: { 
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        });
};
