const db = require('../models');
const Medico = db.Medico;
const { Op } = require('sequelize');
const Usuario = db.Usuario; // Relación con usuarios

// Listar médicos con filtros compatibles con React Admin
// exports.getMedicos = async (req, res) => {
//     try {
//         const { page = 1, perPage = 10, filter = '{}', sort = '["id", "ASC"]' } = req.query;

//         const parsedFilter = JSON.parse(filter);
//         const parsedSort = JSON.parse(sort);

//         let where = {};

//         if (parsedFilter.q) {
//             where[Op.or] = [
//                 { especialidad: { [Op.like]: `%${parsedFilter.q}%` } },
//                 { numero_colegiatura: { [Op.like]: `%${parsedFilter.q}%` } },
//             ];
//         }

//         if (parsedFilter.especialidad) {
//             where.especialidad = { [Op.like]: `%${parsedFilter.especialidad}%` };
//         }

//         if (parsedFilter.numero_colegiatura) {
//             where.numero_colegiatura = { [Op.like]: `%${parsedFilter.numero_colegiatura}%` };
//         }

//         const limit = parseInt(perPage, 10);
//         const offset = (parseInt(page, 10) - 1) * limit;

//         const result = await Medico.findAndCountAll({
//             where,
//             limit,
//             offset,
//             order: [parsedSort]
//         });

//         res.set('Access-Control-Expose-Headers', 'Content-Range');
//         res.set('Content-Range', `medicos ${offset}-${offset + result.rows.length - 1}/${result.count}`);

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error al obtener médicos:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

// const db = require('../models');
// const Medico = db.Medico;
// const Usuario = db.Usuario; // Relación con usuarios
// const { Op } = require('sequelize');

// exports.getMedicos = async (req, res) => {
//     try {
//         const { filter = '{}', range = '[0,9]', sort = '["id","ASC"]' } = req.query;

//         const parsedFilter = JSON.parse(filter);
//         const parsedRange = JSON.parse(range);
//         const parsedSort = JSON.parse(sort);

//         const whereCondition = {};

//         // ✅ Filtrar por nombre o apellido en la tabla "usuarios"
//         if (parsedFilter.q) {
//             whereCondition[Op.or] = [
//                 { '$usuario.nombre$': { [Op.like]: `%${parsedFilter.q}%` } },
//                 { '$usuario.apellido$': { [Op.like]: `%${parsedFilter.q}%` } }
//             ];
//         }

//         const [start, end] = parsedRange;
//         const limit = end - start + 1;
//         const offset = start;

//         const { count, rows } = await Medico.findAndCountAll({
//             where: whereCondition,
//             include: [
//                 {
//                     model: Usuario,
//                     as: 'usuario', // Debe coincidir con la relación definida en `Medico`
//                     attributes: ['id', 'nombre', 'apellido'] // Solo traemos estos campos
//                 }
//             ],
//             order: [[parsedSort[0], parsedSort[1]]],
//             limit,
//             offset,
//         });

//         // ✅ Agregar `Content-Range` para evitar errores en React-Admin
//         res.set('Access-Control-Expose-Headers', 'Content-Range');
//         res.set('Content-Range', `medicos ${start}-${start + rows.length - 1}/${count}`);

//         res.json(rows);
//     } catch (error) {
//         console.error('Error al obtener médicos:', error);
//         res.status(500).json({ error: error.message });
//     }
// };


exports.getMedicos = async (req, res) => {
    try {
        const { filter = '{}', range = '[0,9]', sort = '["id","ASC"]' } = req.query;

        const parsedFilter = JSON.parse(filter);
        const parsedRange = JSON.parse(range);
        const parsedSort = JSON.parse(sort);

        const whereCondition = {};

        console.log('parsedFilter:', parsedFilter);

        if (parsedFilter.q) {
            const search = `%${parsedFilter.q}%`;

            whereCondition[Op.or] = [
                { '$usuario.nombre$': { [Op.like]: search } },
                { '$usuario.apellido$': { [Op.like]: search } },
                { especialidad: { [Op.like]: search } },
                { numero_colegiatura: { [Op.like]: search } }
            ];
        }

        if (parsedFilter.nombre) {
            whereCondition['$usuario.nombre$'] = { [Op.like]: `%${parsedFilter.nombre}%` };
        }

        if (parsedFilter.apellido) {
            whereCondition['$usuario.apellido$'] = { [Op.like]: `%${parsedFilter.apellido}%` };
        }

        // if (parsedFilter.especialidad) {
        //     whereCondition.especialidad = { [Op.like]: `%${parsedFilter.especialidad}%` };
        // }

        // if (parsedFilter.numero_colegiatura) {
        //     whereCondition.numero_colegiatura = { [Op.like]: `%${parsedFilter.numero_colegiatura}%` };
        // }

        const [start, end] = parsedRange;
        const limit = end - start + 1;
        const offset = start;

        const { count, rows } = await Medico.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Usuario,
                    as: 'usuario', 
                    attributes: ['id', 'nombre', 'apellido']
                }
            ],
            order: [[parsedSort[0], parsedSort[1]]],
            limit,
            offset,
        });

        // ✅ Agregar `Content-Range` para evitar errores en React-Admin
        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.set('Content-Range', `medicos ${start}-${start + rows.length - 1}/${count}`);

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener médicos:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un médico por ID
exports.getMedicoById = async (req, res) => {
    try {
        const { id } = req.params;
        const medico = await Medico.findByPk(id);
        if (!medico) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }
        res.json(medico);
    } catch (error) {
        console.error('Error al obtener médico:', error);
        res.status(500).json({ error: error.message });
    }
};

// Crear médico
exports.createMedico = async (req, res) => {
    try {
        const { usuario_id, especialidad, numero_colegiatura } = req.body;

        // Verificar si ya existe un médico con el mismo usuario_id
        const existingMedico = await Medico.findOne({ where: { usuario_id } });
        if (existingMedico) {
            return res.status(400).json({
                error: `El usuario con ID ${usuario_id} ya está asociado a un médico.`,
            });
        }

        // Crear el nuevo médico
        const medico = await Medico.create({
            usuario_id,
            especialidad,
            numero_colegiatura,
        });

        res.status(201).json(medico);
    } catch (error) {
        console.error('Error al crear médico:', error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar médico
exports.updateMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const medico = await Medico.findByPk(id);
        if (!medico) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }
        await medico.update(req.body);
        res.json(medico);
    } catch (error) {
        console.error('Error al actualizar médico:', error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar médico
exports.deleteMedico = async (req, res) => {
    try {
        const { id } = req.params;
        const medico = await Medico.findByPk(id);
        if (!medico) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }
        await medico.destroy();
        res.json({ message: 'Médico eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar médico:', error);
        res.status(500).json({ error: error.message });
    }
};