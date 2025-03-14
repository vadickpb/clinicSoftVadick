// src/controllers/user.controller.js
const db = require('../models');
const Clinica = db.Clinica;
const { Op } = require('sequelize');

// Listar usuarios con paginación y Content-Range
// exports.getClinica = async (req, res) => {
//   try {
//     // Parámetros de paginación: page y perPage (React-Admin los enviará)
//     const { page = 1, perPage = 10 } = req.query;
//     const limit = parseInt(perPage, 10);
//     const offset = (parseInt(page, 10) - 1) * limit;

//     // findAndCountAll devuelve tanto filas como el total
//     const result = await Clinica.findAndCountAll({ offset, limit });
//     const total = result.count;
//     const clinicas = result.rows;

//     // Exponer la cabecera Content-Range para la paginación en CORS
//     res.set('Access-Control-Expose-Headers', 'Content-Range');
//     res.set('Content-Range', `usuarios ${offset}-${offset + clinicas.length - 1}/${total}`);

//     res.json(clinicas);
//   } catch (error) {
//     console.error('Error al obtener clinicas:', error);
//     res.status(500).json({ error: error.message });
//   }
// };


// exports.getClinica = async (req, res) => {
//   try {
//     // Parámetros de paginación: page y perPage (React-Admin los enviará)
//     const { page = 1, perPage = 10, filter } = req.query;
//     const limit = parseInt(perPage, 10);
//     const offset = (parseInt(page, 10) - 1) * limit;

//     // Construir condiciones "where" en base a los filtros
//     let where = {};
//     if (filter) {
//       const parsedFilter = JSON.parse(filter);
//       if (parsedFilter.nombre) {
//         where.nombre = { [Op.like]: `%${parsedFilter.nombre}%` };
//       }
//     }

//     // findAndCountAll devuelve tanto filas como el total
//     const result = await Clinica.findAndCountAll({ offset, limit, where });
//     const total = result.count;
//     const clinicas = result.rows;

//     // Exponer la cabecera Content-Range para la paginación en CORS
//     res.set('Access-Control-Expose-Headers', 'Content-Range');
//     res.set('Content-Range', `usuarios ${offset}-${offset + clinicas.length - 1}/${total}`);

//     res.json(clinicas);
//   } catch (error) {
//     console.error('Error al obtener clinicas:', error);
//     res.status(500).json({ error: error.message });
//   }
// };



// exports.getClinica = async (req, res) => {
//     console.log(req.query);
//     try {
//         const { page = 1, perPage = 10, filter } = req.query;
//         const limit = parseInt(perPage, 10);
//         const offset = (parseInt(page, 10) - 1) * limit;

//         let where = {};
//         if (filter) {
//             const parsedFilter = JSON.parse(filter);
//             // Filtro global
//             if (parsedFilter.q) {
//                 const q = parsedFilter.q;
//                 where = {
//                     [Op.or]: [
//                         { nombre: { [Op.like]: `%${q}%` } },
//                         { direccion: { [Op.like]: `%${q}%` } },
//                         { telefono: { [Op.like]: `%${q}%` } },
//                         { email: { [Op.like]: `%${q}%` } },
//                         { ruc: { [Op.like]: `%${q}%` } }
//                     ]
//                 };
//             }
//             // Filtro específico por "nombre" (si se envía)
//             // Filtro específico por "id" (usado en ReferenceInput)
//             if (parsedFilter.id) {
//                 if (Array.isArray(parsedFilter.id)) {
//                     // Si es un arreglo, usamos IN
//                     where.id = { [Op.in]: parsedFilter.id };
//                 } else {
//                     where.id = parsedFilter.id;
//                 }
//             }
//             // Filtro específico por "nombre" (si se envía)
//             if (parsedFilter.nombre) {
//                 // Convertir a cadena en caso de ser numérico
//                 const nombre = parsedFilter.nombre.toString();
//                 // Si ya existe un filtro global, puedes combinar condiciones (por ejemplo, AND)
//                 where.nombre = { [Op.like]: `%${nombre}%` };
//             }
//         }

//         const result = await Clinica.findAndCountAll({ where, limit, offset });
//         const total = result.count;
//         const clinicas = result.rows;

//         res.set('Access-Control-Expose-Headers', 'Content-Range');
//         res.set('Content-Range', `clinicas ${offset}-${offset + clinicas.length - 1}/${total}`);
//         res.json(clinicas);
//     } catch (error) {
//         console.error('Error al obtener clinicas:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getClinica = async (req, res) => {
//     try {
//         // Obtén paginación y sort
//         const { page = 1, perPage = 10, filter, sort } = req.query;
//         const limit = parseInt(perPage, 10);
//         const offset = (parseInt(page, 10) - 1) * limit;

//         // Define un mapeo de sufijos a operadores
//         const operatorMap = {
//             '_gte': Op.gte,
//             '_lte': Op.lte,
//             '_neq': Op.ne,
//             '_gt': Op.gt,
//             '_lt': Op.lt,
//             '_like': Op.like,
//         };

//         let where = {};
//         if (filter) {
//             const parsedFilter = JSON.parse(filter);
//             // Recorrer cada clave del filtro
//             for (const key in parsedFilter) {
//                 if (parsedFilter.hasOwnProperty(key)) {
//                     // Si la clave es "q", se entiende como filtro global
//                     if (key === 'q') {
//                         const q = parsedFilter.q.toString();
//                         // Filtrado global en varios campos
//                         where = {
//                             [Op.or]: [
//                                 { nombre: { [Op.like]: `%${q}%` } },
//                                 { direccion: { [Op.like]: `%${q}%` } },
//                                 { telefono: { [Op.like]: `%${q}%` } },
//                                 { email: { [Op.like]: `%${q}%` } },
//                                 { ruc: { [Op.like]: `%${q}%` } }
//                             ]
//                         };
//                     } else {
//                         // Verifica si la clave termina con alguno de los sufijos definidos
//                         let matchedOperator = null;
//                         for (const suffix in operatorMap) {
//                             if (key.endsWith(suffix)) {
//                                 matchedOperator = operatorMap[suffix];
//                                 const field = key.slice(0, -suffix.length);
//                                 // Si ya hay condiciones para el campo, las combinamos (aquí se sobreescribe; en caso real podrías combinar con Op.and)
//                                 where[field] = { [matchedOperator]: parsedFilter[key] };
//                                 break;
//                             }
//                         }
//                         // Si no se encontró sufijo, se asume igualdad o, si el valor es un arreglo, se usa IN
//                         if (!matchedOperator) {
//                             if (Array.isArray(parsedFilter[key])) {
//                                 where[key] = { [Op.in]: parsedFilter[key] };
//                             } else {
//                                 where[key] = parsedFilter[key];
//                             }
//                         }
//                     }
//                 }
//             }
//         }

//         // Procesar ordenación si se envía (por ejemplo, sort=["id","ASC"])
//         let order = [];
//         if (sort) {
//             try {
//                 const parsedSort = JSON.parse(sort);
//                 if (Array.isArray(parsedSort) && parsedSort.length === 2) {
//                     order.push(parsedSort);
//                 }
//             } catch (err) {
//                 // ignora la ordenación si falla el parse
//             }
//         }

//         // Realiza la consulta con paginación, filtros y ordenación
//         const result = await Clinica.findAndCountAll({ where, limit, offset, order });
//         const total = result.count;
//         const clinicas = result.rows;

//         // Configura las cabeceras para que react‑admin pueda gestionar la paginación
//         res.set('Access-Control-Expose-Headers', 'Content-Range');
//         res.set('Content-Range', `clinicas ${offset}-${offset + clinicas.length - 1}/${total}`);
//         res.json(clinicas);
//     } catch (error) {
//         console.error('Error al obtener clinicas:', error);
//         res.status(500).json({ error: error.message });
//     }
// };


// exports.getClinica = async (req, res) => {
//     try {
//       const { page = 1, perPage = 10, filter } = req.query;
//       const limit = parseInt(perPage, 10);
//       const offset = (parseInt(page, 10) - 1) * limit;
  
//       let where = {};
//       if (filter) {
//         const parsedFilter = JSON.parse(filter);
//         if (parsedFilter.q) {
//           const q = parsedFilter.q.toString();
//           where = {
//             [Op.or]: [
//               { nombre: { [Op.like]: `%${q}%` } },
//               { direccion: { [Op.like]: `%${q}%` } },
//               { telefono: { [Op.like]: `%${q}%` } },
//               { email: { [Op.like]: `%${q}%` } },
//               { ruc: { [Op.like]: `%${q}%` } }
//             ]
//           };
//         }
//         if (parsedFilter.id) {
//           where.id = Array.isArray(parsedFilter.id)
//             ? { [Op.in]: parsedFilter.id }
//             : parsedFilter.id;
//         }
//         if (parsedFilter.idClinica) {
//           // Si se envía idClinica, mapeamos a id
//           where.id = Array.isArray(parsedFilter.idClinica)
//             ? { [Op.in]: parsedFilter.idClinica }
//             : parsedFilter.idClinica;
//         }
//         if (parsedFilter.nombre) {
//           where.nombre = { [Op.like]: `%${parsedFilter.nombre}%` };
//         }
//       }
  
//       const result = await Clinica.findAndCountAll({
//         where,
//         limit,
//         offset,
//         attributes: ['id', 'nombre', 'direccion', 'telefono', 'email', 'ruc']
//       });
//       const total = result.count;
//       const clinicas = result.rows;
  
//       res.set('Access-Control-Expose-Headers', 'Content-Range');
//       res.set('Content-Range', `clinicas ${offset}-${offset + clinicas.length - 1}/${total}`);
//       res.json(clinicas);
//     } catch (error) {
//       console.error('Error al obtener clinicas:', error);
//       res.status(500).json({ error: error.message });
//     }
//   };


const operatorMapping = {
    '_gte': Op.gte,
    '_lte': Op.lte,
    '_neq': Op.ne,
    '_gt': Op.gt,
    '_lt': Op.lt,
    '_like': Op.like, // para búsquedas "contiene"
};

exports.getClinica = async (req, res) => {
    try {
        const { page = 1, perPage = 10, filter } = req.query;
        const limit = parseInt(perPage, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        let where = {};
        if (filter) {
            const parsedFilter = JSON.parse(filter);
            // Recorremos cada clave del filtro
            Object.keys(parsedFilter).forEach(key => {
                let operatorFound = false;
                // Si la clave termina con alguno de los sufijos definidos, se extrae el campo y el operador
                Object.keys(operatorMapping).sort((a, b) => b.length - a.length).forEach(suffix => {
                    if (key.endsWith(suffix)) {
                        operatorFound = true;
                        const field = key.slice(0, -suffix.length);
                        const operator = operatorMapping[suffix];
                        let value = parsedFilter[key];
                        // Para búsquedas "like", envolvemos el valor con %
                        if (suffix === '_like') {
                            value = `%${value}%`;
                        }
                        // Si ya hay una condición para ese campo, la combinamos (aquí sobrescribimos, pero se puede combinar según necesidad)
                        where[field] = { [operator]: value };
                    }
                });
                // Si no se encontró un sufijo, se asume que se trata de igualdad o filtro global
                if (!operatorFound) {
                    if (key === 'q') {
                        // Filtro global: buscamos en varios campos
                        const q = parsedFilter.q.toString();
                        where = {
                            [Op.or]: [
                                { nombre: { [Op.like]: `%${q}%` } },
                                { direccion: { [Op.like]: `%${q}%` } },
                                { telefono: { [Op.like]: `%${q}%` } },
                                { email: { [Op.like]: `%${q}%` } },
                                { ruc: { [Op.like]: `%${q}%` } }
                            ]
                        };
                    } else {
                        // Para claves sin sufijo, si el valor es un arreglo usamos IN, de lo contrario igualdad
                        if (Array.isArray(parsedFilter[key])) {
                            where[key] = { [Op.in]: parsedFilter[key] };
                        } else {
                            where[key] = parsedFilter[key];
                        }
                    }
                }
            });
        }

        const result = await Clinica.findAndCountAll({
            where,
            limit,
            offset,
            attributes: ['id', 'nombre', 'direccion', 'telefono', 'email', 'ruc']
        });
        const total = result.count;
        const clinicas = result.rows;

        res.set('Access-Control-Expose-Headers', 'Content-Range');
        res.set('Content-Range', `clinicas ${offset}-${offset + clinicas.length - 1}/${total}`);
        res.json(clinicas);
    } catch (error) {
        console.error('Error al obtener clinicas:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
exports.getClinicaById = async (req, res) => {
    try {
        const { id } = req.params;
        const clinica = await Clinica.findByPk(id);
        if (!clinica) {
            return res.status(404).json({ error: 'Clinica no encontrada' });
        }
        res.json(clinica);
    } catch (error) {
        console.error('Error al obtener clinica:', error);
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario
exports.createClinica = async (req, res) => {
    try {
        const { nombre, ruc, direccion, telefono, email } = req.body;
        const newClinica = await Clinica.create({ nombre, ruc, direccion, telefono, email });
        res.status(201).json(newClinica);
    } catch (error) {
        console.error('Error al crear clinica:', error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un usuario
exports.updateClinica = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, ruc, email, telefono, direccion } = req.body;
        const clinica = await Clinica.findByPk(id);
        if (!clinica) {
            return res.status(404).json({ error: 'Clinica no encontrado' });
        }
        await clinica.update({ nombre, ruc, email, telefono, direccion });
        res.json(clinica);
    } catch (error) {
        console.error('Error al actualizar clinica:', error);
        res.status(500).json({ error: error.message });
    }
};




exports.deleteClinica = async (req, res) => {
    try {
        const { id } = req.params;
        const clinica = await Clinica.findByPk(id);

        if (!clinica) {
            return res.status(404).json({ error: 'Clinica no encontrada' });
        }
        await clinica.destroy();
        res.json({ message: 'Clinica eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la clínica:', error);
        res.status(500).json({ error: error.message });
    }
};