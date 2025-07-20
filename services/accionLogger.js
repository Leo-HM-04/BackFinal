// Helper centralizado para registrar acciones y notificar al admin
const notificacionesService = require('./notificacionesService');
const usuarioModel = require('../models/usuario.model');

/**
 * Registra una acción relevante y notifica al admin
 * @param {Object} params
 * @param {Object} params.req - El request de Express (req)
 * @param {string} params.accion - Acción realizada (ej: 'crear', 'eliminar', 'subir', 'actualizar')
 * @param {string} params.entidad - Entidad afectada (ej: 'usuario', 'solicitud', 'comprobante')
 * @param {string|number} [params.entidadId] - ID de la entidad afectada
 * @param {string} [params.mensajeExtra] - Mensaje adicional personalizado
 */
async function registrarAccion({ req, accion, entidad, entidadId = null, mensajeExtra = '' }) {
  // Buscar admin
  const admin = await usuarioModel.getUsuarioByRol('admin_general');
  if (!admin) return;

  // Usuario que realiza la acción
  const usuario = req.user || {};
  let mensaje = `El usuario ${usuario.nombre || usuario.id_usuario || 'desconocido'} (${usuario.rol || ''}) ${accion} ${entidad}`;
  if (entidadId) mensaje += ` (ID: ${entidadId})`;
  if (mensajeExtra) mensaje += `. ${mensajeExtra}`;

  await notificacionesService.crearNotificacion({
    id_usuario: admin.id_usuario,
    mensaje,
    enviarWebSocket: true,
    enviarCorreo: !!admin.email,
    correo: admin.email
  });
}

module.exports = { registrarAccion };
