const db = require('../models');
const HistoriaClinica = db.HistoriaClinica;

exports.createHistoriaClinica = async (req, res) => {
    try {
        const historia = await HistoriaClinica.create(req.body);
        res.status(201).json(historia);
    } catch (error) {
        console.error('Error al crear historia clínica:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getHistoriasClinicas = async (req, res) => {
    try {
        const historias = await HistoriaClinica.findAll({
            include: [{ model: db.Paciente, as: 'paciente' }],
        });
        res.json(historias);
    } catch (error) {
        console.error('Error al obtener historias clínicas:', error);
        res.status(500).json({ error: error.message });
    }
};