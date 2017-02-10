'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.changeColumn(
          'Customers',
          'code',
          {
              type: Sequelize.STRING,
              unique: true,
              validate: { notEmpty: {msg: "Falta el código del vendedor."}}
          }
      );
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.changeColumn(
          'Customers',
          'code',
          {
              type: Sequelize.STRING,
              validate: { notEmpty: {msg: "Falta el código del vendedor."}}
          }
      );
  }
};
