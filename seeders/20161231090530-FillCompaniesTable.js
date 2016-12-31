'use strict';


module.exports = {
  up: function (queryInterface, Sequelize) {

      return queryInterface.bulkInsert('Companies', [ 
         { name: 'Hüppe',
           createdAt: new Date(), updatedAt: new Date()  },
         { name: 'Maderó',
           createdAt: new Date(), updatedAt: new Date()  },
         { name: 'Irsan',
           createdAt: new Date(), updatedAt: new Date()  },
         { name: 'Grohe',
           createdAt: new Date(), updatedAt: new Date()  }
        ]);
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Companies', null, {});
  }
};


