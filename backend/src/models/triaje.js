module.exports = (sequelize, DataTypes) => {
    const Triaje = sequelize.define('Triaje', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        atencion_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        paciente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        personal_triaje_id: DataTypes.INTEGER,
        fecha_triaje: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        temperatura: DataTypes.DECIMAL(4, 2),
        presion_sistolica: DataTypes.INTEGER,
        presion_diastolica: DataTypes.INTEGER,
        frecuencia_cardiaca: DataTypes.INTEGER,
        frecuencia_respiratoria: DataTypes.INTEGER,
        saturacion_oxigeno: DataTypes.DECIMAL(4, 1),
        peso: DataTypes.DECIMAL(5, 2),
        talla: DataTypes.DECIMAL(5, 2),
        clasificacion_riesgo: {
            type: DataTypes.ENUM('verde', 'amarillo', 'rojo', 'negro'),
        },
        observaciones: DataTypes.TEXT,
    }, {
        tableName: 'triaje',
        timestamps: true,
    });

    Triaje.associate = (models) => {
        Triaje.belongsTo(models.Atencion, {
            foreignKey: 'atencion_id',
            as: 'atencion',
        });
        Triaje.belongsTo(models.Paciente, {
            foreignKey: 'paciente_id',
            as: 'paciente',
        });
        Triaje.belongsTo(models.Usuario, {
            foreignKey: 'personal_triaje_id',
            as: 'personal_triaje',
        });
    };

    return Triaje;
};