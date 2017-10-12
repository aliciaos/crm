'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {

        return queryInterface.addColumn('Users',
            'fullname',
            {
                type: Sequelize.STRING,
                validate: {notEmpty: {msg: "Falta el nombre y apellidos del usuario."}}

            }
        )
        .then(function () {
            return queryInterface.addColumn('Users',
                'isSalesman',
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                }
            );
        })
        .then(function () {
            return queryInterface.addColumn('Users',
                'PhotoId',
                {
                    type: Sequelize.INTEGER
                }
            );
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('Users', 'fullname')
        .then(function () {
            return queryInterface.removeColumn('Users', 'isSalesman');
        })
        .then(function () {
            return queryInterface.removeColumn('Users', 'PhotoId');
        });
    }
};

