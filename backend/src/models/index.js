const { DataTypes } = require('sequelize');
const { sequelize, testConnection } = require('../config/db'); // Importa la conexión y la prueba

const db = {};


// Importar modelos manualmente
db.Usuario = require('./usuario')(sequelize, DataTypes);
db.Paciente = require('./paciente')(sequelize, DataTypes);
db.Clinica = require('./clinica')(sequelize, DataTypes);
db.Role = require('./role')(sequelize, DataTypes);
db.Medico = require('./medico')(sequelize, DataTypes);
db.Cita = require('./cita')(sequelize, DataTypes);
db.HistoriaClinica = require('./historia_clinica')(sequelize, DataTypes);
db.Atencion = require('./atencion')(sequelize, DataTypes);
db.Triaje = require('./triaje')(sequelize, DataTypes);

const UsuarioRol = sequelize.define('usuario_rol', {}, {
    tableName: 'usuario_rol',
    timestamps: false // Desactiva la espera de createdAt/updatedAt
});
db.UsuarioRol = UsuarioRol; // (opcional, para tener referencia)


// Definir asociaciones manualmente
db.Paciente.belongsTo(db.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
db.Usuario.hasOne(db.Paciente, { foreignKey: 'usuario_id', as: 'paciente' });
db.Medico.belongsTo(db.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
db.Usuario.hasOne(db.Medico, { foreignKey: 'usuario_id', as: 'medico' });
db.Cita.belongsTo(db.Medico, { foreignKey: 'medico_id', as: 'medico' });
db.Cita.belongsTo(db.Paciente, { foreignKey: 'paciente_id', as: 'paciente' });


db.Usuario.belongsToMany(db.Role, {
    through: UsuarioRol,
    foreignKey: 'usuario_id',
    otherKey: 'rol_id',
    as: 'roles'
});
db.Role.belongsToMany(db.Usuario, {
    through: UsuarioRol,
    foreignKey: 'rol_id',
    otherKey: 'usuario_id',
    as: 'usuarios'
});
// Exportamos Sequelize y la conexión
db.sequelize = sequelize;
db.Sequelize = require('sequelize');

// Verificar la conexión a la base de datos
testConnection();

module.exports = db;