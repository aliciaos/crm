
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
    storage = "citolo.sqlite";
} else {
    url = process.env.DATABASE_URL;
    storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize(url, 
	 						  { storage: storage,
				              	omitNull: true 
				              });


// Importar la definicion de Patient de patient.js
var Patient = sequelize.import(path.join(__dirname,'patient'));

// Importar la definicion de Report de report.js
var Report = sequelize.import(path.join(__dirname,'report'));

// Importar la definicion de DType de diagnose_type.js
var DType = sequelize.import(path.join(__dirname,'d_type'));

// Importar la definicion de DTResult de dt_result.js
var DTResult = sequelize.import(path.join(__dirname,'dt_result'));

// Importar la definicion de DTROption de dtr_option.js
var DTROption = sequelize.import(path.join(__dirname,'dtr_option'));

// Importar la definicion de Diagnose de diagnose.js
var Diagnose = sequelize.import(path.join(__dirname,'diagnose'));


// Relaciones entre modelos
Report.belongsTo(Patient);
Patient.hasMany(Report);

DTResult.belongsTo(DType);
DType.hasMany(DTResult);

DTROption.belongsTo(DTResult);
DTResult.hasMany(DTROption);

Diagnose.belongsTo(Report);
Report.hasMany(Diagnose);

// Exportar:

exports.Patient   = Patient;
exports.Report    = Report;
exports.DType     = DType;
exports.DTResult  = DTResult;
exports.DTROption = DTROption;
exports.Diagnose  = Diagnose;

