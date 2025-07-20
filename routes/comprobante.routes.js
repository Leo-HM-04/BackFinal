const express = require('express');
const router = express.Router();
const comprobanteController = require('../controllers/comprobante.controller');
const upload = require('../middlewares/upload');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/subir', authMiddleware, upload.single('archivo'), comprobanteController.subirComprobante);
router.get('/:id_solicitud', authMiddleware, comprobanteController.getComprobantesPorSolicitud);
router.delete('/:id_comprobante', authMiddleware, comprobanteController.eliminarComprobante);

module.exports = router;
