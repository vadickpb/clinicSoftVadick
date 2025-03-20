// src/routes/patient.routes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/paciente.controller');

router.get('/', patientController.getPaciente);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPaciente);
router.put('/:id', patientController.updatePaciente);
router.delete('/:id', patientController.deletePatient);

module.exports = router;