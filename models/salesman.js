
// Definicion del modelo de vendedor: Salesman

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
        'Salesman', 
        {   name: {
                type: DataTypes.STRING,
                unique: true,
                validate: { notEmpty: {msg: "Falta el nombre del vendedor."}}
            }
        },
        {	name: {
        		singular: "Salesman",
        		plural: "Salesmen"
        	},
        	tableName: "Salesmen"
        });
};
