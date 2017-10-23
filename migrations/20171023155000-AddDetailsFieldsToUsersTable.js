'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {

        return Sequelize.Promise.all([

            queryInterface.addColumn(
                'Users',
                'phone1',
                {type: Sequelize.STRING}
            ),
            queryInterface.addColumn(
                'Users',
                'phone2',
                {type: Sequelize.STRING}
            ),
            queryInterface.addColumn(
                'Users',
                'email1',
                {type: Sequelize.STRING}
            ),
            queryInterface.addColumn(
                'Users',
                'email2',
                {type: Sequelize.STRING}
            ),
            queryInterface.addColumn(
                'Users',
                'notes',
                {type: Sequelize.TEXT}
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Sequelize.Promise.all([

            queryInterface.removeColumn('Users', 'phone1'),
            queryInterface.removeColumn('Users', 'phone2'),
            queryInterface.removeColumn('Users', 'email1'),
            queryInterface.removeColumn('Users', 'email2'),
            queryInterface.removeColumn('Users', 'notes')
        ]);
    }
};
