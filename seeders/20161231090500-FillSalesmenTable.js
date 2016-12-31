'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

      return queryInterface.bulkInsert('Salesmen', [
         { name: 'Andres',
           createdAt: new Date(), updatedAt: new Date()  },
         { name: 'Angel',
           createdAt: new Date(), updatedAt: new Date()  }
        ]);
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Salesmen', null, {});
  }
};


