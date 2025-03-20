const db = require('../models');
const Atencion = db.Atencion;

exports.getAtenciones = async (req, res) => {
    try {
        const { page = 1, perPage = 10, filter = '{}' } = req.query;
        const parsedFilter = JSON.parse(filter);

        const whereCondition = {};

        if (parsedFilter.q){
            const search = `${parsedFilter.q}`;
            whereCondition[Op.or]
        }

        const atenciones = await Atencion.findAndCountAll({

        })
    } catch (error) {
        
    }
}

exports.createAtencion = async (req, res) => {
    try {
        const atencion = await Atencion.create(req.body);
        res.status(201).json(atencion);
    } catch (error) {
        console.error('Error al crear atención:', error);
        res.status(500).json({ error: error.message });
    }
};

// exports.getAtenciones = async (req, res) => {
//     try {
//         const atenciones = await Atencion.findAll({
//             include: [
//                 { model: db.HistoriaClinica, as: 'historia' },
//                 { model: db.Medico, as: 'medico' },
//             ],
//         });
//         res.json(atenciones);
//     } catch (error) {
//         console.error('Error al obtener atenciones:', error);
//         res.status(500).json({ error: error.message });
//     }
// };