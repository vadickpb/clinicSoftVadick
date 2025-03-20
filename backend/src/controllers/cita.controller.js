// src/controllers/cita.controller.js
const db = require('../models');
const { Op } = require('sequelize');
const Cita = db.Cita;

exports.getCitas = async (req, res) => {
    try {

        const { page = 1, perPage = 10, filter = '{}' } = req.query;
        const parsedFilter = JSON.parse(filter);

        const whereCondition = {};
        if (parsedFilter.medico_id) {
            whereCondition.medico_id = parsedFilter.medico_id;
        }
        if (parsedFilter.paciente_id) {
            whereCondition.paciente_id = parsedFilter.paciente_id;
        }
        if (parsedFilter.estado) {
            whereCondition.estado = parsedFilter.estado;
        }

        const limit = parseInt(perPage, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        const result = await Cita.findAndCountAll({
            where: whereCondition,
            include: [{
                model: db.Medico,
                as: 'medico',
                attributes: ['id', 'especialidad'],
                include: [{
                    model: db.Usuario,
                    as: 'usuario',
                    attributes: ['nombre', 'apellido']
                }]
            }, {
                model: db.Paciente,
                as: 'paciente'
            }],
            limit,
            offset,
            order: [['fecha_inicio', 'ASC']]
        });

        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.set('Content-Range', `citas ${offset}-${offset + result.rows.length - 1}/${result.count}`);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCitaById = async (req, res) => {
    try {
        const cita = await Cita.findByPk(req.params.id, {
            include: ['medico', 'paciente']
        });
        if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
        res.json(cita);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCita = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, duracion_minutos, ...rest } = req.body;

        const nuevaCita = await Cita.create({
            fecha_inicio,
            duracion_minutos,
            ...rest
        });

        res.status(201).json(nuevaCita);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateCita = async (req, res) => {
    try {
        const cita = await Cita.findByPk(req.params.id);
        if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
        await cita.update(req.body);
        res.json(cita);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCita = async (req, res) => {
    try {
        const cita = await Cita.findByPk(req.params.id);
        if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
        await cita.destroy();
        res.json({ message: 'Cita eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// exports.getCitasForCalendar = async (req, res) => {
//     try {
//         const citas = await Cita.findAll({
//             attributes: ['id', ['motivo', 'title'], ['fecha_inicio', 'start'], ['fecha_fin', 'end']],
//         });
//         res.json(citas);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };