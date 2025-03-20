module.exports = (sequelize, DataTypes) => {
    const Atencion = sequelize.define('Atencion', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        historia_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        atencion_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fecha_atencion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        medico_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        motivo: DataTypes.TEXT,
        exploracion: DataTypes.TEXT,
        diagnostico: DataTypes.TEXT,
        tratamiento: DataTypes.TEXT,
        observaciones: DataTypes.TEXT,
    }, {
        tableName: 'atenciones',
        timestamps: true,
    });

    Atencion.associate = (models) => {
        Atencion.belongsTo(models.HistoriaClinica, {
            foreignKey: 'historia_id',
            as: 'historia',
        });
        Atencion.belongsTo(models.Medico, {
            foreignKey: 'medico_id',
            as: 'medico',
        });
    };

    return Atencion;
};