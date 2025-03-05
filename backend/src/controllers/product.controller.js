// src/controllers/product.controller.js
const db = require('../models');
const Producto = db.Producto;

exports.createProduct = async (req, res) => {
    try {
        const { nombre, descripcion, precio, activo } = req.body;
        const producto = await Producto.create({ nombre, descripcion, precio, activo });
        res.status(201).json(producto);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        // Extraer parámetros de paginación de la query (puedes ajustar según lo que envíe React-Admin)
        const { page = 1, perPage = 10 } = req.query;
        const limit = parseInt(perPage, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        // findAndCountAll devuelve { count, rows }
        const result = await Producto.findAndCountAll({ offset, limit });
        const total = result.count;
        const products = result.rows;

        // Configura la cabecera para CORS: expone Content-Range
        res.set('Access-Control-Expose-Headers', 'Content-Range');
        // Establece la cabecera Content-Range con el total de elementos
        res.set('Content-Range', `productos ${offset}-${offset + products.length - 1}/${total}`);

        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, activo } = req.body;
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        await producto.update({ nombre, descripcion, precio, activo });
        res.json(producto);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        await producto.destroy();
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: error.message });
    }
};