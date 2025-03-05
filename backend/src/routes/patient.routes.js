// src/routes/patient.routes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');

router.get('/', patientController.getPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

module.exports = router;