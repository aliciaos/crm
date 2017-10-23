'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {

        return Sequelize.Promise.all([

            queryInterface.addColumn(
                'Companies',
                'web1',
                {type: Sequelize.STRING}
            ),
            queryInterface.addColumn(
                'Companies',
                'web2',
                {type: Sequelize.STRING}
            ),
            queryInterface.addColumn(
                'Companies',
                'notes',
                {type: Sequelize.TEXT}
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Sequelize.Promise.all([

            queryInterface.removeColumn('Companies', 'web1'),
            queryInterface.removeColumn('Companies', 'web2'),
            queryInterface.removeColumn('Companies', 'notes')
        ]);
    }
};
