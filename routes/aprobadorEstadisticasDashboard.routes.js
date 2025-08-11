const express = require('express');
const router = express.Router();
const controller = require('../controllers/aprobadorEstadisticasDashboard.controller');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const autorizarRol = require('../middlewares/autorizarRol');

router.use(authMiddleware);
router.use(autorizarRol('pagador_banca'));

router.get('/resumen-estado', controller.resumenPorEstado);
router.get('/tendencia-mensual', controller.tendenciaMensual);
router.get('/comparativo-origen', controller.comparativoOrigen);
router.get('/tiempo-promedio-aprobacion', controller.tiempoPromedioAprobacion);
router.get('/top-usuarios', controller.topUsuarios);

module.exports = router;
