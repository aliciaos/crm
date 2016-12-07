
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
                validate: { notEmpty: {msg: "Falta la fecha de recepción."}}
            },
            lastMenstruationAt: { type: DataTypes.DATE },
            cycleDay: { type: DataTypes.INTEGER }
        });
};
