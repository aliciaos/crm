'use strict';


module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'DTResults', 
            {   id: { 
                    type: Sequelize.INTEGER,  allowNull: false,
                    primaryKey: true,         autoIncrement: true,  
                    unique: true 
                },
                DTypeId: { type: Sequelize.INTEGER },
                code:  { 
                    type: Sequelize.STRING,
                    validate: { notEmpty: {msg: "Falta el código del resultado de diagnóstico."}}
                },
                title: { 
                    type: Sequelize.STRING,
                    validate: { notEmpty: {msg: "Falta el título del resultado de diagnóstico."}}
                },
                description: { 
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
        return queryInterface.dropTable('DTResults');
    }
};
