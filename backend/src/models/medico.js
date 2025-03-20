
module.exports = (sequelize, DataTypes) => {
    const Medico = sequelize.define('Medico', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        especialidad: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        numero_colegiatura: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'medicos',
        timestamps: false
    });

    return Medico;
};