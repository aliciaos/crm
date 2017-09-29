'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('Users',
            'token',
            {
                type: Sequelize.STRING,
                validate: {notEmpty: {msg: "Falta token"}}

            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('Users', 'token');
    }
};

