'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'Reports', 
            {   id: { 
                    type: Sequelize.INTEGER,  allowNull: false,
                    primaryKey: true,         autoIncrement: true,  
                    unique: true 
                },
                PatientId: { type: Sequelize.INTEGER },
                doctor:  { 
                    type: Sequelize.STRING,
                    validate: { notEmpty: {msg: "Falta el nombre del doctor."}}
                },
                receptionAt: { 
                    type: Sequelize.DATE,
                    validate: { notEmpty: {msg: "Falta la fecha de recepción."}}
                },
                lastMenstruationAt: { 
                    type: Sequelize.STRING 
                },
                cycleDay: { 
                    type: Sequelize.INTEGER 
                },
                printed: { 
                    type: Sequelize.BOOLEAN,
                    defaultValue: false 
                },
                createdAt: { type: Sequelize.DATE,     allowNull: false },
                updatedAt: { type: Sequelize.DATE,     allowNull: false }
           },
           {    sync: {force: true}
           }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Reports');
    }
};

