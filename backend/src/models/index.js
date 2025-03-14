const { DataTypes } = require('sequelize');
const { sequelize, testConnection } = require('../config/db'); // Importa la conexión y la prueba

const db = {};

// Importar modelos manualmente
db.Usuario = require('./usuario')(sequelize, DataTypes);
db.Paciente = require('./paciente')(sequelize, DataTypes);
db.Clinica = require('./clinica')(sequelize, DataTypes);

// Definir asociaciones manualmente
db.Paciente.belongsTo(db.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
db.Usuario.hasOne(db.Paciente, { foreignKey: 'usuario_id', as: 'paciente' });
db.Clinica.hasMany(db.Paciente, { foreignKey: 'clinica_id', as: 'pacientes' });
db.Paciente.belongsTo(db.Clinica, { foreignKey: 'clinica_id', as: 'clinica' });

// Exportamos Sequelize y la conexión
db.sequelize = sequelize;
db.Sequelize = require('sequelize');

// Verificar la conexión a la base de datos
testConnection();

module.exports = db;