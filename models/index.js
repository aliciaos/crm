
var path = require('path');

// Cargar ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
//    DATABASE_URL = sqlite:///
//    DATABASE_STORAGE = quiz.sqlite
// Usar BBDD Postgres:
//    DATABASE_URL = postgres://user:passwd@host:port/database

var url, storage;

if (!process.env.DATABASE_URL) {
    url = "sqlite:///";
    storage = "crm.sqlite";
} else {
    url = process.env.DATABASE_URL;
    storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize(url, 
	 						  { storage: storage,
				              	omitNull: true 
				              });



// Importar la definicion de Company de company.js
var Company = sequelize.import(path.join(__dirname,'company'));

// Importar la definicion de Customer de customer.js
var Customer = sequelize.import(path.join(__dirname,'customer'));

// Importar la definicion de Salesman de salesman.js
var Salesman = sequelize.import(path.join(__dirname,'salesman'));

// Importar la definicion de TargetType de target_type.js
var TargetType = sequelize.import(path.join(__dirname,'targettype'));

// Importar la definicion de Target de target.js
var Target = sequelize.import(path.join(__dirname,'target'));

// Importar la definicion de Visit de visit.js
var Visit = sequelize.import(path.join(__dirname,'visit'));

// Importar la definicion de User de user.js
var User = sequelize.import(path.join(__dirname,'user'));


// Relaciones entre modelos
Visit.belongsTo(Customer);
Customer.hasMany(Visit);

Visit.belongsTo(Salesman);
Salesman.hasMany(Visit);

Target.belongsTo(Company);
Company.hasMany(Target);

Target.belongsTo(Visit);
Visit.hasMany(Target);

Target.belongsTo(TargetType);
TargetType.hasMany(Target);

// Exportar:

exports.Company		= Company;
exports.Customer    = Customer;
exports.Salesman	= Salesman;
exports.TargetType	= TargetType;
exports.Target 		= Target;
exports.Visit		= Visit;
exports.User 		= User;

