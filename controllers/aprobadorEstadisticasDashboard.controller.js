const AprobadorEstadisticas = require('../models/aprobadorEstadisticasDashboard.model');

const aprobadorEstadisticasDashboardController = {
  async resumenPorEstado(req, res) {
    try {
      console.log('DEBUG req.user:', req.user);
      const rolAprobadorId = req.user.id_usuario;
      const data = await AprobadorEstadisticas.resumenPorEstado(rolAprobadorId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener resumen por estado' });
    }
  },
  async tendenciaMensual(req, res) {
    try {
      const rolAprobadorId = req.user.id_usuario;
      const data = await AprobadorEstadisticas.tendenciaMensual(rolAprobadorId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener tendencia mensual' });
    }
  },
  async comparativoOrigen(req, res) {
    try {
      const rolAprobadorId = req.user.id_usuario;
      const data = await AprobadorEstadisticas.comparativoOrigen(rolAprobadorId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener comparativo por origen' });
    }
  },
  async tiempoPromedioAprobacion(req, res) {
    try {
      const rolAprobadorId = req.user.id_usuario;
      const data = await AprobadorEstadisticas.tiempoPromedioAprobacion(rolAprobadorId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener tiempo promedio de aprobación' });
    }
  },
  async topUsuarios(req, res) {
    try {
      const rolAprobadorId = req.user.id_usuario;
      const data = await AprobadorEstadisticas.topUsuarios(rolAprobadorId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener top usuarios' });
    }
  }
};

module.exports = aprobadorEstadisticasDashboardController;
