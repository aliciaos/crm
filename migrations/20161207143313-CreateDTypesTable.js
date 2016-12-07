'use strict';


module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'DTypes', 
            {   id: { 
                    type: Sequelize.INTEGER,  allowNull: false,
                    primaryKey: true,         autoIncrement: true,  
                    unique: true 
                },
                code:  { 
                    type: Sequelize.STRING,
                    validate: { notEmpty: {msg: "Falta el código del tipo de diagnóstico."}}
                },
                title: { 
                    type: Sequelize.STRING,
                    validate: { notEmpty: {msg: "Falta el título del tipo de diagnóstico."}}
                },
                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false }
           },
           {    sync: {force: true}
           }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('DTypes');
    }
};
