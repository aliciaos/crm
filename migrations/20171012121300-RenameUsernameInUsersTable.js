'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.renameColumn('Users', 'username', 'login'
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.renameColumn('Users', 'login','username');
    }
};

