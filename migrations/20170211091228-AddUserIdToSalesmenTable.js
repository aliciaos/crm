'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return  queryInterface.addColumn( 'Salesmen',
          'UserId',
          { type: Sequelize.INTEGER }
      );
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('Salesmen','UserId');
  }
};

