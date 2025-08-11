const Comprobante = require('../models/comprobante.model');
const path = require('path');
const notificacionesService = require('../services/notificacionesService');
const usuarioModel = require('../models/usuario.model');
const { registrarAccion } = require('../services/accionLogger');

exports.subirComprobante = async (req, res) => {
  try {
    // Solo pagador puede subir
    if (req.user.rol !== 'pagador_banca') {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const { id_solicitud, comentario } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Archivo requerido' });
    }
    // Validar que la solicitud esté pagada
    const Solicitud = require('../models/solicitud.model');
    const solicitud = await Solicitud.getPorId(id_solicitud);
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    if (solicitud.estado !== 'pagada') {
      return res.status(400).json({ error: 'Solo se puede subir comprobante cuando la solicitud está pagada' });
    }
    // Guarda la ruta relativa para servir el archivo correctamente
    const rutaRelativa = `/uploads/comprobantes/${req.file.filename}`;
    const comprobante = {
      id_solicitud,
      nombre_archivo: req.file.originalname,
      ruta_archivo: rutaRelativa,
      usuario_subio: req.user.id_usuario,
      comentario
    };
    const id = await Comprobante.create(comprobante);



    // Registrar acción
    await registrarAccion({
      req,
      accion: 'subió',
      entidad: 'comprobante',
      entidadId: id,
      mensajeExtra: `para la solicitud #${id_solicitud}`
    });

    // Notificar a usuarios relevantes
    try {
      const pool = require('../db/connection');
      
      // Obtener información del solicitante y pagador
      const [solicitudInfo] = await pool.query(`
        SELECT s.id_usuario as id_solicitante, s.monto, s.concepto, s.id_aprobador,
               u_solic.nombre as nombre_solicitante, u_solic.email as email_solicitante,
               u_aprob.nombre as nombre_aprobador, u_aprob.email as email_aprobador
        FROM solicitudes_pago s 
        LEFT JOIN usuarios u_solic ON s.id_usuario = u_solic.id_usuario
        LEFT JOIN usuarios u_aprob ON s.id_aprobador = u_aprob.id_usuario
        WHERE s.id_solicitud = ?
      `, [id_solicitud]);

      if (solicitudInfo.length > 0) {
        const info = solicitudInfo[0];
        const nombrePagador = req.user.nombre || 'Pagador';

        // Notificar al solicitante
        await notificacionesService.crearNotificacion({
          id_usuario: info.id_solicitante,
          mensaje: `📄 ${nombrePagador} subió el comprobante de pago de tu solicitud por $${info.monto} (${info.concepto}).`,
          correo: info.email_solicitante
        });

        // Notificar al aprobador si existe
        if (info.id_aprobador) {
          await notificacionesService.crearNotificacion({
            id_usuario: info.id_aprobador,
            mensaje: `📄 ${nombrePagador} subió el comprobante de pago de la solicitud de ${info.nombre_solicitante} por $${info.monto} que aprobaste.`,
            correo: info.email_aprobador
          });
        }

        // Notificar al admin
        const admin = await usuarioModel.getUsuarioByRol('admin_general');
        if (admin) {
          await notificacionesService.crearNotificacion({
            id_usuario: admin.id_usuario,
            mensaje: `📄 ${nombrePagador} subió un comprobante de pago para la solicitud de ${info.nombre_solicitante} por $${info.monto}.`,
            correo: admin.email
          });
        }
      }
    } catch (e) {
      // Si falla la notificación, solo loguea
      console.error('Error enviando notificaciones:', e);
    }

    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComprobantesPorSolicitud = async (req, res) => {
  try {
    const { id_solicitud } = req.params;
    const comprobantes = await Comprobante.findBySolicitud(id_solicitud);
    res.json(comprobantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarComprobante = async (req, res) => {
  try {
    const { id_comprobante } = req.params;
    const ok = await Comprobante.delete(id_comprobante);
    if (ok) {
      // Registrar acción y notificar admin
      await registrarAccion({
        req,
        accion: 'eliminó',
        entidad: 'comprobante',
        entidadId: id_comprobante
      });
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'No encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
