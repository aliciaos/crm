'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return  queryInterface.addColumn( 'Salesmen',
            'PhotoId',
            { type: Sequelize.INTEGER }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('Salesmen','PhotoId');
    }
};
