const db = require('../models');
const Triaje = db.Triaje;

exports.createTriaje = async (req, res) => {
    try {
        const triaje = await Triaje.create(req.body);
        res.status(201).json(triaje);
    } catch (error) {
        console.error('Error al crear triaje:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getTriajes = async (req, res) => {
    try {
        const triajes = await Triaje.findAll({
            include: [
                { model: db.Atencion, as: 'atencion' },
                { model: db.Paciente, as: 'paciente' },
                { model: db.Usuario, as: 'personal_triaje' },
            ],
        });
        res.json(triajes);
    } catch (error) {
        console.error('Error al obtener triajes:', error);
        res.status(500).json({ error: error.message });
    }
};