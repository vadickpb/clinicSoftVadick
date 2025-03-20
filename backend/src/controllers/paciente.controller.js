// src/controllers/patient.controller.js
const db = require('../models');
const Paciente = db.Paciente;
const { Op } = require('sequelize'); // 🔹 Asegurar que Op está importado



exports.getPaciente = async (req, res) => {
    try {
        const { filter = '{}', range = '[0,9]', sort = '["id","ASC"]' } = req.query;

        const parsedFilter = JSON.parse(filter);
        const parsedRange = JSON.parse(range);
        const parsedSort = JSON.parse(sort);

        const whereCondition = {};

        // Procesar filtro dinámico
        Object.keys(parsedFilter).forEach((key) => {
            if (key === 'q') {
                // Búsqueda general
                whereCondition[Op.or] = [
                    { nombre: { [Op.like]: `%${parsedFilter.q}%` } },
                    { apellido: { [Op.like]: `%${parsedFilter.q}%` } },
                    { num_doc: { [Op.like]: `%${parsedFilter.q}%` } },
                ];
            } else {
                // Filtros específicos
                whereCondition[key] = { [Op.like]: `%${parsedFilter[key]}%` };
            }
        });

        const [start, end] = parsedRange;
        const limit = end - start + 1;
        const offset = start;

        const { count, rows } = await Paciente.findAndCountAll({
            where: whereCondition,
            order: [[parsedSort[0], parsedSort[1]]],
            limit,
            offset,
        });

        // Agregar Content-Range en la respuesta
        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.set('Content-Range', `pacientes ${start}-${start + rows.length - 1}/${count}`);
        
        res.json(rows);
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
exports.createPaciente = async (req, res) => {
    try {
        const {
            usuario_id,
            nombre, 
            apellido, 
            tipo_doc, 
            num_doc, 
            fecha_nacimiento, 
            sexo, 
            direccion, 
            ciudad, 
            estado, 
            pais 
        } = req.body;
        const newPatient = await Paciente.create({
            usuario_id,
            nombre, 
            apellido, 
            tipo_doc, 
            num_doc, 
            fecha_nacimiento, 
            sexo, 
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
exports.updatePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            usuario_id,
            nombre, 
            apellido, 
            tipo_doc, 
            num_doc, 
            fecha_nacimiento, 
            sexo, 
            direccion, 
            ciudad, 
            estado, 
            pais 
        } = req.body;
        const patient = await Paciente.findByPk(id);
        if (!patient) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        await patient.update({
            usuario_id,
            nombre, 
            apellido, 
            tipo_doc, 
            num_doc, 
            fecha_nacimiento, 
            sexo, 
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