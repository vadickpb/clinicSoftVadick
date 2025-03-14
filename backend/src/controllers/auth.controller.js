const db = require('../models');
const Usuario = db.Usuario;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

// 🚀 Función para generar token JWT
const generarToken = (usuario) => {
    return jwt.sign(
        { id: usuario.id, email: usuario.email, tipo: usuario.tipo }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
};

exports.register = async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, password } = req.body;
        // Encriptar la contraseña
        const password_hash = await bcrypt.hash(password, 10);
        // Generar un token de verificación
        const verification_token = crypto.randomBytes(20).toString('hex');
        // Crear el usuario con email no verificado
        const user = await Usuario.create({
            nombre,
            apellido,
            email,
            telefono,
            password_hash,
            email_verified: false,
            verification_token
        });
        // Aquí se debe enviar un correo con el token de verificación
        // Ej: sendVerificationEmail(user.email, verification_token);
        res.status(201).json({ message: 'Usuario registrado. Revisa tu correo para verificar tu cuenta.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await Usuario.findOne({ where: { verification_token: token } });
        if (!user) return res.status(400).json({ error: 'Token inválido.' });
        user.email_verified = true;
        user.verification_token = null;
        await user.save();
        res.json({ message: 'Correo verificado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.login = async (req, res) => {
//     try {
//         console.log('req.body: ', req.body);
//         const { email, password } = req.body;
//         const user = await Usuario.findOne({ where: { email } });
//         if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
//         if (!user.email_verified) return res.status(401).json({ error: 'Correo no verificado.' });

//         const valid = await bcrypt.compare(password, user.password_hash);
//         if (!valid) return res.status(401).json({ error: 'Credenciales inválidas.' });

//         // Generar JWT (configura JWT_SECRET en el archivo .env)
//         const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
//             expiresIn: '1h'
//         });
//         res.json({ token });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.login = async (req, res) => {
//     console.log('Método:', req.method); 
//     console.log('Headers:', req.headers); 
//     console.log('Body recibido en backend:', req.body); // 🔍 Verifica qué se recibe

//     if (!req.body || typeof req.body.email === 'undefined') {
//         console.error('No se recibió el campo email en el body:', req.body);
//         return res.status(400).json({ error: 'El campo email es requerido.' });
//     }

//     try {
//         const { email, password } = req.body;
//         console.log('Email recibido:', email);

//         const user = await Usuario.findOne({ where: { email } });
//         if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
//         if (!user.email_verified) return res.status(401).json({ error: 'Correo no verificado.' });

//         const valid = await bcrypt.compare(password, user.password_hash);
//         if (!valid) return res.status(401).json({ error: 'Credenciales inválidas.' });

//         const token = jwt.sign(
//             { id: user.id, email: user.email, tipo: user.tipo },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );
//         res.json({ token });
//     } catch (error) {
//         console.error('Error en login:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

exports.login = async (req, res) => {
    try {
        // Validar errores
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const { email, password } = req.body;
        const user = await Usuario.findOne({ where: { email } });

        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
        if (!user.email_verified) return res.status(401).json({ error: 'Correo no verificado.' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Credenciales inválidas.' });

        const token = generarToken(user);
        res.json({ token });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};