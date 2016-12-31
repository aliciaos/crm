'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

      return queryInterface.bulkInsert('Customers', [ 
         { code: 'hac', 
           name: 'Hoteles AC',
           createdAt: new Date(), updatedAt: new Date() 
         },
         { code: 'perea', 
           name: 'Saneamientos Perea',
           createdAt: new Date(), updatedAt: new Date() 
         },
         { code: 'nines', 
           name: 'María de los Ángeles Reyes Magdaleno',
           createdAt: new Date(), updatedAt: new Date()  
         },
         { code: 'nose', 
           name: 'Ni guarra',
           createdAt: new Date(), updatedAt: new Date() 
         }
        ]);
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Customers', null, {});
  }
};


