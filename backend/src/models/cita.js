// src/models/cita.js
module.exports = (sequelize, DataTypes) => {
    const Cita = sequelize.define('Cita', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        paciente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        medico_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha_inicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        duracion_minutos: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30
        },
        fecha_fin: {
            type: DataTypes.VIRTUAL,
            get() {
                return new Date(new Date(this.fecha_inicio).getTime() + this.duracion_minutos * 60000);
            }
        },
        tipo: {
            type: DataTypes.ENUM('presencial', 'teleconsulta'),
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
            defaultValue: 'pendiente'
        },
        motivo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'citas',
        timestamps: false
    });

    Cita.associate = (models) => {
        Cita.belongsTo(models.Paciente, { foreignKey: 'paciente_id', as: 'paciente' });
        Cita.belongsTo(models.Medico, { foreignKey: 'medico_id', as: 'medico' });
    };

    return Cita;
};