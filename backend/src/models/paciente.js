// src/models/paciente.js
module.exports = (sequelize, DataTypes) => {
    const Paciente = sequelize.define('Paciente', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        tipo_doc: {
            type: DataTypes.ENUM('DNI', 'CE', 'Pasaporte'),
            allowNull: true
        },
        num_doc: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        fecha_nacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        sexo: {
            type: DataTypes.ENUM('masculino', 'femenino'),
            allowNull: true
        },
        direccion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ciudad: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        pais: {
            type: DataTypes.STRING(100),
            allowNull: true
        },  estado: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        tableName: 'pacientes',
        timestamps: false
    });

    return Paciente;
};