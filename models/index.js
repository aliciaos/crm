
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
	 						  { storage: storage
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

// Importar la definicion de Attachments de attachment.js
var Attachment = sequelize.import(path.join(__dirname,'attachment'));

//-------------------------------------------------

// Relaciones entre modelos

Visit.belongsTo(Customer);
Customer.hasMany(Visit);

Visit.belongsTo(Salesman, {as: "Salesman", foreignKey: 'SalesmanId'});
Salesman.hasMany(Visit);

Target.belongsTo(Company);
Company.hasMany(Target);

Target.belongsTo(Visit);
Visit.hasMany(Target);

Target.belongsTo(TargetType);
TargetType.hasMany(Target);

Salesman.belongsTo(User);
User.hasOne(Salesman);

Salesman.belongsTo(Attachment, {as: "Photo", foreignKey: 'PhotoId'});
Attachment.hasOne(Salesman, {foreignKey: 'PhotoId'});

// Favoritos:
//   Un Usuario tiene muchas visitas favoritas.
//   Una visita tiene muchos fans (los usuarios que la han marcado como favorita)
User.belongsToMany(Visit, { as: 'Favourites', through: 'Favourites'});
Visit.belongsToMany(User, {as: 'Fans', through: 'Favourites'});

//-------------------------------------------------

// Exportar:

exports.Company		= Company;
exports.Customer    = Customer;
exports.Salesman	= Salesman;
exports.TargetType	= TargetType;
exports.Target 		= Target;
exports.Visit		= Visit;
exports.User 		= User;
exports.Attachment 	= Attachment;

