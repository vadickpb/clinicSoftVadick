// src/controllers/user.controller.js
const db = require('../models');
const Usuario = db.Usuario;
const { sequelize } = db;

// Listar usuarios con paginación y Content-Range
exports.getUsers = async (req, res) => {
  try {
    // Parámetros de paginación: page y perPage (React-Admin los enviará)
    const { page = 1, perPage = 10 } = req.query;
    const limit = parseInt(perPage, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    // findAndCountAll devuelve tanto filas como el total
    const result = await Usuario.findAndCountAll({ offset, limit });
    const total = result.count;
    const users = result.rows;

    // Exponer la cabecera Content-Range para la paginación en CORS
    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.set('Content-Range', `usuarios ${offset}-${offset + users.length - 1}/${total}`);

    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, password } = req.body;
    const newUser = await Usuario.create({ nombre, apellido, email, telefono, password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, tipo, password } = req.body;
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await user.update({ nombre, apellido, email, telefono, password });
    res.json(user);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: error.message });
  };
};

exports.mantenimientoUsuario = async (req, res) => {
  try {
    const { accion, usuario_id, nombre, apellido, email, password } = req.body;

    if (!accion) {
      return res.status(400).json({ success: false, message: "El campo 'accion' es obligatorio" });
    }

    const result = await sequelize.query(
      "CALL sp_usuarioMantenimiento(?, ?, ?, ?, ?, ?)",
      { replacements: [accion, usuario_id || null, nombre || null, apellido || null, email || null, password || null] }
    );

    if (accion === 'L') {
      return res.json({ success: true, data: result }); // Devolver la lista completa sin modificaciones
    }

    if (['A', 'U', 'R'].includes(accion)) {
      return res.json({ success: true, usuario: result.length > 0 ? result[0] : null });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Error en mantenimiento de usuario:", error);
    res.status(500).json({ success: false, message: "Error en la base de datos" });
  }
};

