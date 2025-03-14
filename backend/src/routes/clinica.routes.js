// src/routes/patient.routes.js
const express = require('express');
const router = express.Router();
const clinicaController = require('../controllers/clinica.controller');

router.get('/', clinicaController.getClinica);
router.get('/:id', clinicaController.getClinicaById);
router.post('/', clinicaController.createClinica);
router.put('/:id', clinicaController.updateClinica);
router.delete('/:id', clinicaController.deleteClinica);
// router.delete('/:id', patientController.deletePatient);

module.exports = router;