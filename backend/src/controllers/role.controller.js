const db = require('../models');
const Role = db.Role;
const { Op, where } = require('sequelize');

exports.getRoles = async (req, res) => {
    try {
        const {page = 1, perPage = 10, filter = {}} = req.query;

        const limit = parseInt(perPage, 10);
        const offset = (parseInt(page, 10) - 1) * limit;
        const parsedFilter = JSON.parse(filter);

        const whereCondition = {};

        // Filtro general
        if (parsedFilter.q) {
            const search = `%${parsedFilter.q}%`;
            whereCondition[Op.or] = [
                {nombre: {[Op.like]: search}},
                {descripcion: {[Op.like]: search}}
            ];
        }

        // Filtros específicos
        if (parsedFilter.nombre) {
            whereCondition.nombre = { [Op.like]: `%${parsedFilter.nombre}%` };;
        }

        if (parsedFilter.descripcion) {
            whereCondition.descripcion = { [Op.like]: `%${parsedFilter.descripcion}%` };;
        }

        const result = await Role.findAndCountAll({
            where: whereCondition,
            offset, 
            limit
        });
        const total = result.count;
        const roles = result.rows;

        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.set('Content-Range', `roles ${offset}-${offset + roles.length - 1}/${total}`);

        res.json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ error: error.message });
    }
}

exports.getRoleById = async (req, res) => {
    try {
        const {id} = req.params;
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({error: 'Rol no encontrado'});
        }
        res.json(role);
    } catch (error) {
        console.error('Error al obtener rol:', error);
        res.status(500).json({error: error.message});
    }
}

exports.createRoles = async (req, res) => {
    try {
        const {nombre, descripcion} = req.body;
        const newRole = await Role.create({nombre, descripcion});
        res.status(201).json(newRole);
    } catch (error) {
        console.error('Error al crear rol:', error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateRoles = async (req, res) => {
    try {
        const {nombre, descripcion} = req.body;
        const {id} = req.params;
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({error: 'Rol no encontrado'});
        }
        await role.update({nombre, descripcion});
        res.json(role);
    } catch (error) {
        console.error('Error al editar rol:', error);
        res.status(500).json({error: error.message});
    }
}

exports.deleteRoles = async (req, res) => {
    try {
        const {id} = req.params;
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({error: 'Rol no encontrado'});
        }
        await role.destroy();
        res.json({message: 'Rol eliminado con éxito'});
    } catch (error) {
        console.error('Error al eliminar rol:', error);
        res.status(500).json({error: error.message});
    }
}