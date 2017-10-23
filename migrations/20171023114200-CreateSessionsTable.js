'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Sessions',
            {
                sid: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    primaryKey: true,
                    unique: true
                },
                expires: {
                    type: Sequelize.DATE
                },
                data: {
                    type: Sequelize.STRING(50000)
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                }
            },
            {
                sync: {force: true}
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Sessions');
    }
};
