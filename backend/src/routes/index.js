const express = require('express');
const router = express.Router();

// Importar rutas individuales
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const patientRoutes = require('./patient.routes');
const clinicasRoutes = require('./clinica.routes');
const roleRoutes = require('./roles.routes');
const medicoRoutes = require('./medico.routes');
const citaRoutes = require('./cita.routes');

// Usar las rutas en el enrutador principal
router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/pacientes', patientRoutes);
router.use('/clinicas', clinicasRoutes);
router.use('/roles', roleRoutes);
router.use('/medicos', medicoRoutes);
router.use('/citas', citaRoutes);


module.exports = router;