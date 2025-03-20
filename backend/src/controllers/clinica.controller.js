const db = require('../models');
const Clinica = db.Clinica;
const { Op } = require('sequelize');

exports.getClinica = async (req, res) => {
    try {
        const { page = 1, perPage = 10, filter = '{}', sort = '["id","ASC"]' } = req.query;

        const parsedFilter = JSON.parse(decodeURIComponent(filter));
        const parsedSort = JSON.parse(sort);

        const whereCondition = {};

        // Búsqueda general por texto (q)
        if (parsedFilter.q) {
            const search = `%${parsedFilter.q}%`;
            console.log('Adding general search condition:', search);

            whereCondition[Op.or] = [
                { nombre: { [Op.like]: search } },
                { ruc: { [Op.like]: search } },
                { direccion: { [Op.like]: search } },
                { telefono: { [Op.like]: search } },
                { email: { [Op.like]: search } }
            ];
        }

        // Filtro específico para cada campo
        if (parsedFilter.id) {
            whereCondition.id = Array.isArray(parsedFilter.id) 
                ? { [Op.in]: parsedFilter.id } 
                : parsedFilter.id;
        }

        if (parsedFilter.nombre) {
            whereCondition.nombre = { [Op.like]: `%${parsedFilter.nombre}%` };
        }

        if (parsedFilter.direccion) {
            whereCondition.direccion = { [Op.like]: `%${parsedFilter.direccion}%` };
        }

        if (parsedFilter.telefono) {
            whereCondition.telefono = { [Op.like]: `%${parsedFilter.telefono}%` };
        }

        if (parsedFilter.ruc) {
            whereCondition.ruc = { [Op.like]: `%${parsedFilter.ruc}%` };
        }

        if (parsedFilter.email) {
            whereCondition.email = { [Op.like]: `%${parsedFilter.email}%` };
        }


        const limit = parseInt(perPage, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        const result = await Clinica.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [parsedSort]
        });

        const total = result.count;
        const clinicas = result.rows;

        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.set('Content-Range', `clinicas ${offset}-${offset + clinicas.length - 1}/${total}`);

        res.json(clinicas);
    } catch (error) {
        console.error('Error al obtener clínicas:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getClinicaById = async (req, res) => {
    try {
        const clinica = await Clinica.findByPk(req.params.id);
        if (!clinica) return res.status(404).json({ error: 'Clinica no encontrada' });
        res.status(200).json(clinica);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createClinica = async (req, res) => {
    try {
        const clinica = await Clinica.create(req.body);
        res.status(201).json(clinica);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateClinica = async (req, res) => {
    try {
        const clinica = await Clinica.findByPk(req.params.id);
        if (!clinica) return res.status(404).json({ error: 'Clinica no encontrada' });
        await clinica.update(req.body);
        res.status(200).json(clinica);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteClinica = async (req, res) => {
    try {
        const clinica = await Clinica.findByPk(req.params.id);
        if (!clinica) return res.status(404).json({ error: 'Clinica no encontrada' });
        await clinica.destroy();
        res.status(200).json({ message: 'Clinica eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};