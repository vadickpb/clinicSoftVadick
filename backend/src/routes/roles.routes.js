const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

router.get('/', roleController.getRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', roleController.createRoles);
router.put('/:id', roleController.updateRoles);
router.delete('/:id', roleController.deleteRoles);

module.exports = router;