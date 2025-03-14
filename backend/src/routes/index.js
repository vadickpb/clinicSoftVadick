const express = require('express');
const router = express.Router();

// Importar rutas individuales
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const patientRoutes = require('./patient.routes');
const clinicasRoutes = require('./clinica.routes');

// Usar las rutas en el enrutador principal
router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/pacientes', patientRoutes);
router.use('/clinicas', clinicasRoutes);

module.exports = router;