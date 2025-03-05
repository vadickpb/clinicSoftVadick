// src/controllers/patient.controller.js
const db = require('../models');
const Paciente = db.Paciente;

// Listar pacientes con paginación y Content-Range
exports.getPatients = async (req, res) => {
    try {
        const { page = 1, perPage = 10 } = req.query;
        const limit = parseInt(perPage, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        const result = await Paciente.findAndCountAll({ offset, limit });
        const total = result.count;
        const patients = result.rows;

        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.set('Content-Range', `pacientes ${offset}-${offset + patients.length - 1}/${total}`);

        res.json(patients);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un paciente por ID
exports.getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Paciente.findByPk(id);
        if (!patient) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        res.json(patient);
    } catch (error) {
        console.error('Error al obtener paciente:', error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo paciente
exports.createPatient = async (req, res) => {
    try {
        const { usuario_id, fecha_nacimiento, sexo, identificacion, direccion, ciudad, estado, pais } = req.body;
        const newPatient = await Paciente.create({
            usuario_id,
            fecha_nacimiento,
            sexo,
            identificacion,
            direccion,
            ciudad,
            estado,
            pais
        });
        res.status(201).json(newPatient);
    } catch (error) {
        console.error('Error al crear paciente:', error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un paciente
exports.updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario_id, fecha_nacimiento, sexo, identificacion, direccion, ciudad, estado, pais } = req.body;
        const patient = await Paciente.findByPk(id);
        if (!patient) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        await patient.update({
            usuario_id,
            fecha_nacimiento,
            sexo,
            identificacion,
            direccion,
            ciudad,
            estado,
            pais
        });
        res.json(patient);
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un paciente
exports.deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Paciente.findByPk(id);
        if (!patient) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        await patient.destroy();
        res.json({ message: 'Paciente eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        res.status(500).json({ error: error.message });
    }
};