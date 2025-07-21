const express = require('express');
const router = express.Router();
const notificacionesService = require('../services/notificacionesService');
// Middleware de autenticación (ajusta según tu proyecto)
const { authMiddleware } = require('../middlewares/authMiddleware');

// Endpoint exclusivo para solicitante: obtiene solo sus notificaciones
router.get('/solicitante', authMiddleware, async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    // Solo notificaciones del usuario autenticado (rol solicitante)
    if (req.user.rol !== 'solicitante') {
      return res.status(403).json({ error: 'Solo disponible para solicitantes' });
    }
    const notificaciones = await notificacionesService.obtenerNotificaciones(id_usuario);
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones del solicitante' });
  }
});

// Obtener todas las notificaciones del usuario autenticado (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const notificaciones = await notificacionesService.obtenerNotificaciones(id_usuario);
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

// Marcar notificación como leída
router.post('/:id/marcar-leida', authMiddleware, async (req, res) => {
  try {
    await notificacionesService.marcarComoLeida(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar notificación como leída' });
  }
});

module.exports = router;
