const express = require('express');
const router = express.Router();
const controller = require('../controllers/departamento.controller');
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get('/', authMiddleware, controller.getDepartamentos);
router.post('/', authMiddleware, controller.createDepartamento);
router.put('/:id', authMiddleware, controller.updateDepartamento);
router.delete('/:id', authMiddleware, controller.deleteDepartamento);

module.exports = router;
