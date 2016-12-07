'use strict';


module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'DTROptions', 
            {   id: { 
                    type: Sequelize.INTEGER,  allowNull: false,
                    primaryKey: true,         autoIncrement: true,  
                    unique: true 
                },
                DTResultId: { type: Sequelize.INTEGER },
                code:  { 
                    type: Sequelize.STRING,
                    validate: { notEmpty: {msg: "Falta el código de la opción de diagnóstico."}}
                },
                title: { 
                    type: Sequelize.STRING,
                    validate: { notEmpty: {msg: "Falta el código de la opción de diagnóstico."}}
                },
                description: { 
                    type: Sequelize.TEXT,
                    validate: { notEmpty: {msg: "Falta la descripción de la opción de diagnóstico."}}
                },
                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false }
           },
           {    sync: {force: true}
           }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('DTROptions');
    }
};
