// src/models/producto.js
module.exports = (sequelize, DataTypes) => {
    const Producto = sequelize.define('Producto', {
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
        type: DataTypes.TEXT,
        allowNull: true
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'productos',
      timestamps: false // Ajusta según si necesitas campos de creación/actualización
    });
  
    return Producto;
  };