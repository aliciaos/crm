'use strict';


module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'Diagnoses', 
            {   id: { 
                    type: Sequelize.INTEGER,  
                    allowNull: false,
                    primaryKey: true,         
                    autoIncrement: true,  
                    unique: true 
                },
                ReportId: { type: Sequelize.INTEGER },
                dtypeCode: {
                    type: Sequelize.TEXT,
                    validate: { notEmpty: {msg: "Falta el código del tipo de diagnóstico."}}
                },
                dtresultCode: {
                    type: Sequelize.TEXT,
                    validate: { notEmpty: {msg: "Falta el código del resultado de diagnóstico."}}
                },
                resultNotes: {
                    type: Sequelize.TEXT
                },
                dtroptionCode: {
                    type: Sequelize.TEXT
                },
                optionNotes: {
                    type: Sequelize.TEXT
                },
                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false }
           },
           {    sync: {force: true}
           }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Diagnoses');
    }
};
