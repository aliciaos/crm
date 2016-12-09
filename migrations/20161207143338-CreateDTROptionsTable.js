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
                    type: Sequelize.STRING
                },
                title: { 
                    type: Sequelize.STRING
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
        return queryInterface.dropTable('DTROptions');
    }
};
