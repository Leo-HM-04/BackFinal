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
  const nombreUsuario = usuario.nombre || `Usuario ID: ${usuario.id_usuario}` || 'Usuario desconocido';
  const rolUsuario = usuario.rol || 'sin rol';
  
  // Crear mensaje más específico según la acción y entidad
  let mensaje = '';
  
  switch (entidad) {
    case 'solicitud':
      switch (accion) {
        case 'creó':
          mensaje = `📋 ${nombreUsuario} (${rolUsuario}) creó una nueva solicitud`;
          break;
        case 'actualizó':
          mensaje = `📝 ${nombreUsuario} (${rolUsuario}) actualizó una solicitud`;
          if (mensajeExtra.includes('Aprobada')) {
            mensaje = `✅ ${nombreUsuario} (${rolUsuario}) aprobó una solicitud`;
          } else if (mensajeExtra.includes('Rechazada')) {
            mensaje = `❌ ${nombreUsuario} (${rolUsuario}) rechazó una solicitud`;
          } else if (mensajeExtra.includes('Pagada')) {
            mensaje = `💰 ${nombreUsuario} (${rolUsuario}) marcó como pagada una solicitud`;
          }
          break;
        default:
          mensaje = `📋 ${nombreUsuario} (${rolUsuario}) realizó una acción (${accion}) sobre una solicitud`;
      }
      break;
    case 'usuario':
      switch (accion) {
        case 'creó':
          mensaje = `👤 ${nombreUsuario} (${rolUsuario}) creó un nuevo usuario`;
          break;
        case 'actualizó':
          mensaje = `👤 ${nombreUsuario} (${rolUsuario}) actualizó datos de un usuario`;
          break;
        case 'eliminó':
          mensaje = `🗑️ ${nombreUsuario} (${rolUsuario}) eliminó un usuario`;
          break;
        default:
          mensaje = `👤 ${nombreUsuario} (${rolUsuario}) realizó una acción (${accion}) sobre un usuario`;
      }
      break;
    case 'comprobante':
      switch (accion) {
        case 'subió':
          mensaje = `📄 ${nombreUsuario} (${rolUsuario}) subió un comprobante de pago`;
          break;
        default:
          mensaje = `📄 ${nombreUsuario} (${rolUsuario}) realizó una acción (${accion}) sobre un comprobante`;
      }
      break;
    default:
      mensaje = `🔧 ${nombreUsuario} (${rolUsuario}) ${accion} ${entidad}`;
  }
  
  if (entidadId) mensaje += ` (ID: ${entidadId})`;
  if (mensajeExtra && !mensaje.includes('aprobó') && !mensaje.includes('rechazó') && !mensaje.includes('pagada')) {
    mensaje += `. ${mensajeExtra}`;
  }

  await notificacionesService.crearNotificacion({
    id_usuario: admin.id_usuario,
    mensaje,
    enviarWebSocket: true,
    enviarCorreo: !!admin.email,
    correo: admin.email
  });
}

module.exports = { registrarAccion };
