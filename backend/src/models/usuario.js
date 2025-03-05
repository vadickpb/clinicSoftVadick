module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            apellido: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true,
                validator: {
                    isEmail: true
                },
            },
            telefono: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            tipo: {
                type: DataTypes.ENUM('medico', 'paciente', 'admin'),
                allowNull: false
            },
            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            fecha_registro: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: 'usuarios',
            timestamps: false
        }
    );
    return Usuario;
};