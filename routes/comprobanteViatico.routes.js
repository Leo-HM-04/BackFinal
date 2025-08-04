const express = require('express');
const router = express.Router();
const comprobanteViaticoController = require('../controllers/comprobanteViatico.controller');
const upload = require('../middlewares/upload');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Subir comprobante de viático
router.post('/subir', authMiddleware, upload.single('archivo'), comprobanteViaticoController.subirComprobanteViatico);

// Obtener comprobantes por viático
router.get('/:id_viatico', authMiddleware, comprobanteViaticoController.getComprobantesPorViatico);

// Eliminar comprobante
router.delete('/:id_comprobante', authMiddleware, comprobanteViaticoController.eliminarComprobanteViatico);

module.exports = router;
