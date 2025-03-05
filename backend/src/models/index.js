// src/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,       // Nombre de la base de datos
    process.env.DB_USER,       // Usuario de la base de datos
    process.env.DB_PASSWORD,   // Contraseña
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT, // Ej. 'mysql'
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false  // Deshabilitar logs en producción
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Cargar modelos
db.Producto = require('./producto')(sequelize, DataTypes);
db.Usuario = require('./usuario')(sequelize, DataTypes);
db.Paciente = require('./paciente')(sequelize, DataTypes);

// Ejemplo de asociación: cada Paciente pertenece a un Usuario
db.Paciente.belongsTo(db.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
// Opcional: si deseas que un Usuario tenga un Paciente asociado
db.Usuario.hasOne(db.Paciente, { foreignKey: 'usuario_id', as: 'paciente' });

module.exports = db;