module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role',
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
            descripcion: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: 'roles',
            timestamps: false
        }
    );
    return Role;
};