'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {

        return Sequelize.Promise.all([
            queryInterface.addColumn('Customers',
                'notes',
                {type: Sequelize.TEXT}
            ),
            queryInterface.addColumn('Customers',
                'archived',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {

        return Sequelize.Promise.all([
            queryInterface.removeColumn('Customers', 'notes'),
            queryInterface.removeColumn('Customers', 'archived')
        ]);
    }
};
