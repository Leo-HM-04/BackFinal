const express = require('express');
const router = express.Router();
const EstadisticasController = require('../controllers/estadisticas.controller');

// Endpoint para estadísticas de solicitudes
router.get('/solicitudes', EstadisticasController.getSolicitudesStats);
// Endpoint para estadísticas de usuarios
router.get('/usuarios', EstadisticasController.getUsuariosStats);
// Endpoint para estadísticas de recurrentes
router.get('/recurrentes', EstadisticasController.getRecurrentesStats);
router.get('/notificaciones', EstadisticasController.getNotificacionesStats);

// Endpoint para tendencia semanal
router.get('/tendencia-semanal', EstadisticasController.getTendenciaSemanal);

module.exports = router;
