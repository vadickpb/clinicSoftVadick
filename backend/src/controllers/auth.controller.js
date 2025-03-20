const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { QueryTypes } = require('sequelize');
const Usuario = db.Usuario;

exports.register = async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, password } = req.body;
        const password_hash = await bcrypt.hash(password, 10);
        const user = await Usuario.create({ nombre, apellido, email, telefono, password: password_hash });
        res.status(201).json({ message: 'Usuario registrado con éxito.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await Usuario.findOne({ where: { email } });
//         if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

//         const valid = await bcrypt.compare(password, user.password);
//         if (!valid) return res.status(401).json({ error: 'Credenciales inválidas.' });

//         const token = jwt.sign({ id: user.id, email: user.email, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Usuario.findOne({ where: { email } });

        if (!user) return res.status(404).json({ error: "Usuario no encontrado." });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: "Credenciales inválidas." });

        // Consultar roles del usuario
        const roles = await db.sequelize.query(
            `SELECT r.nombre FROM usuario_rol ur 
             JOIN roles r ON ur.rol_id = r.id 
             WHERE ur.usuario_id = ?`,
            { replacements: [user.id], type: QueryTypes.SELECT }
        );

        const roleNames = roles.map(r => r.nombre); // Extrae los nombres de los roles

        const token = jwt.sign(
            { id: user.id, email: user.email, roles: roleNames },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                roles: roleNames
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};