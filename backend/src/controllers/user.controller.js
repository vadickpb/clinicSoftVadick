const db = require('../models');
const Usuario = db.Usuario;
const { sequelize } = db;
const { Op } = require('sequelize');

const bcrypt = require('bcrypt');


exports.getUsers = async (req, res) => {
  try {
    const { page = 1, perPage = 10, filter = {} } = req.query;
    const limit = parseInt(perPage, 10);
    const offset = (parseInt(page, 10) - 1) * limit;
    const parsedFilter = JSON.parse(filter);

    const whereCondition = {};
    if (parsedFilter.q) {
      const search = `%${parsedFilter.q}%`;
      whereCondition[Op.or] = [
        { nombre: { [Op.like]: search } },
        { apellido: { [Op.like]: search } },
        { email: { [Op.like]: search } },
        { telefono: { [Op.like]: search } },
      ];
    }

    if (parsedFilter.nombre) {
      whereCondition.nombre = { [Op.like]: `%${parsedFilter.nombre}%` };
    }

    if (parsedFilter.apellido) {
      whereCondition.apellido = { [Op.like]: `%${parsedFilter.apellido}%` };
    }

    if (parsedFilter.email) {
      whereCondition.email = { [Op.like]: `%${parsedFilter.email}%` };
    }

    if (parsedFilter.telefono) {
      whereCondition.telefono = { [Op.like]: `%${parsedFilter.telefono}%` };
    }
    

    const result = await Usuario.findAndCountAll({ 
      where: whereCondition,
      include: [{
        model: db.Role,
        as: 'roles',
        attributes: ['id', 'nombre'],
      }],
      offset, 
      limit });
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



exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Usuario.findByPk(id, {
      include: [{
        model: db.Role,
        as: 'roles',
        attributes: ['id', 'nombre'],
        through: { attributes: [] } // importante para no traer datos extra
      }]
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Convertir roles a arreglo de IDs
    const userPlain = user.get({ plain: true });
    userPlain.roles = userPlain.roles.map(rol => rol.id);

    res.json(userPlain);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, password } = req.body;
    // Encriptar la contraseña con 10 salt rounds
    const password_hash = await bcrypt.hash(password, 10);
    // Crear el usuario usando la contraseña encriptada
    const newUser = await Usuario.create({ nombre, apellido, email, telefono, password: password_hash });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario
// exports.updateUser = async (req, res) => {
//   console.log(req.body);

//   try {
//     const { id } = req.params;
//     console.log(req.body);
//     const { nombre, apellido, email, telefono, password, roles } = req.body;

//     const user = await Usuario.findByPk(id);
//     if (!user) {
//       return res.status(404).json({ error: 'Usuario no encontrado' });
//     }
//     await user.update({ nombre, apellido, email, telefono, password });
//     res.json(user);
//   } catch (error) {
//     console.error('Error al actualizar usuario:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// backend/src/controllers/user.controller.js


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, password, roles } = req.body;

    // Buscar el usuario por su ID
    const user = await Usuario.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Preparar los datos básicos a actualizar
    const updateData = { nombre, apellido, email, telefono };
    if (password) {
      // Encriptar la nueva contraseña
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Actualizar los datos básicos del usuario
    await user.update(updateData);

    if (roles && Array.isArray(roles)) {
      const rolesIds = roles.map(r => (typeof r === 'object' ? r.id : r));
      await user.setRoles(rolesIds);
    }

    const updatedUser = await Usuario.findByPk(id, {
      include: [{
        model: db.Role,
        as: 'roles',
        attributes: ['id', 'nombre']
      }]
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: error.message });
  }
};

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
      return res.json({ success: true, data: result }); 
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

