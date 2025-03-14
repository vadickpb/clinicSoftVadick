// src/models/paciente.js
module.exports = (sequelize, DataTypes) => {
    const Clinica = sequelize.define('Clinica', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        ruc: {
            type: DataTypes.STRING(11),
            allowNull: false,
            unique: true
        },
        direccion: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        telefono: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: true,
            unique: true
        }
    }, {
        tableName: 'clinicas',
        timestamps: false
    });

    return Clinica;
};