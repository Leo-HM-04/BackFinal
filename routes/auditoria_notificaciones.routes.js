
const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const Auditoria = require('../models/auditoria.model');
const Notificacion = require('../models/notificacion.model');

// Obtener auditoría (por usuario, rol, entidad)
router.get('/auditoria', async (req, res) => {
  try {
    const filtro = {
      usuario_id: req.query.usuario_id,
      rol: req.query.rol,
      entidad: req.query.entidad
    };
    const auditoria = await Auditoria.getAuditoria(filtro);
    res.json(auditoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener auditoría', error });
  }
});

// Obtener notificaciones por usuario
router.get('/notificaciones', async (req, res) => {
  try {
    const usuario_id = req.query.usuario_id;
    const notificaciones = await Notificacion.getNotificaciones(usuario_id);
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones', error });
  }
});

// Marcar notificación como leída
router.post('/notificaciones/:id/leida', async (req, res) => {
  try {
    await Notificacion.marcarLeida(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar notificación como leída', error });
  }
});

module.exports = router;

// Obtener auditoría (por usuario, rol, entidad)
router.get('/auditoria', async (req, res) => {
  try {
    const filtro = {
      usuario_id: req.query.usuario_id,
      rol: req.query.rol,
      entidad: req.query.entidad
    };
    const auditoria = await Auditoria.getAuditoria(filtro);
    res.json(auditoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener auditoría', error });
  }
});

// Obtener notificaciones por usuario
router.get('/notificaciones', async (req, res) => {
  try {
    const usuario_id = req.query.usuario_id;
    const notificaciones = await Notificacion.getNotificaciones(usuario_id);
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones', error });
  }
});

// Marcar notificación como leída
router.post('/notificaciones/:id/leida', async (req, res) => {
  try {
    await Notificacion.marcarLeida(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar notificación como leída', error });
  }
});

module.exports = router;
