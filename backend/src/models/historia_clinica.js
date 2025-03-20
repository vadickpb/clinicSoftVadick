module.exports = (sequelize, DataTypes) => {
    const HistoriaClinica = sequelize.define('HistoriaClinica', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        paciente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        antecedentes_familiares: DataTypes.TEXT,
        antecedentes_personales: DataTypes.TEXT,
        alergias: DataTypes.TEXT,
        enfermedades_previas: DataTypes.TEXT,
        medicamentos_habituales: DataTypes.TEXT,
        observaciones: DataTypes.TEXT,
    }, {
        tableName: 'historia_clinica',
        timestamps: true,
    });

    HistoriaClinica.associate = (models) => {
        HistoriaClinica.belongsTo(models.Paciente, {
            foreignKey: 'paciente_id',
            as: 'paciente',
        });
    };

    return HistoriaClinica;
};