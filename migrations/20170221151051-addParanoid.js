'use strict';


var tableNames = [
    'Users',
    'Companies',
    'Customers',
    'Salesmen',
    'Targets',
    'TargetTypes',
    'Visits',
    'Attachments'
];

module.exports = {
    up: function (queryInterface, Sequelize) {

        return Sequelize.Promise.all(
            tableNames
        )
        .each(function (tableName) {
            return queryInterface.addColumn(
                tableName,
                'deletedAt',
                {type: Sequelize.DATE}
            );
        });
    },

    down: function (queryInterface, Sequelize) {
        return Sequelize.Promise.all([
            tableNames
        ])
        .each(function (tableName) {
            return queryInterface.removeColumn(tableName, 'deletedAt');
        });
    }
};
