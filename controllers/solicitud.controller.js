/* ──────────────────────────────────────────────────────────────
   Controlador de Solicitudes – Con notificaciones persistentes
   ────────────────────────────────────────────────────────────── */

const SolicitudModel = require("../models/solicitud.model");
const NotificacionService = require("../services/notificacionesService");
const pool = require("../db/connection");

// ──────────────────────── Obtener listados ────────────────────────
exports.getSolicitudes = async (req, res) => {
  try {
    const { rol, id_usuario } = req.user;

    let solicitudes = [];
    if (rol === "solicitante") {
      solicitudes = await SolicitudModel.getPorUsuario(id_usuario);
    } else if (rol === "pagador_banca") {
      solicitudes = await SolicitudModel.getAutorizadas();
    } else {
      solicitudes = await SolicitudModel.getTodas();
    }

    res.json(solicitudes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener solicitudes" });
  }
};

// ─────────────────── Obtener solicitud por ID ──────────────────────
exports.getSolicitud = async (req, res) => {
  try {
    const { rol, id_usuario } = req.user;
    const { id } = req.params;

    const solicitud = await SolicitudModel.getPorId(id);

    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    if (rol === "solicitante" && solicitud.id_usuario !== id_usuario) {
      return res.status(403).json({ error: "No tienes permiso para ver esta solicitud" });
    }

    res.json(solicitud);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener la solicitud" });
  }
};


// ───────────────────── Crear nueva solicitud ──────────────────────
const Joi = require('joi');
const { registrarAccion } = require('../services/accionLogger');

exports.createSolicitud = async (req, res) => {
  try {
    // Validación robusta con Joi
    const schema = Joi.object({
      departamento: Joi.string().min(2).max(100).required(),
      monto: Joi.number().positive().required(),
      cuenta_destino: Joi.string().min(6).max(30).required(),
      concepto: Joi.string().min(3).max(255).required(),
      tipo_pago: Joi.string().min(2).max(50).optional(),
      fecha_limite_pago: Joi.date().iso().optional(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: 'Datos inválidos', details: error.details });
    }
    const { departamento, monto, cuenta_destino, concepto, tipo_pago, fecha_limite_pago } = value;

    const { id_usuario } = req.user;

    let factura_url = null;
    if (req.file) {
      factura_url = `/uploads/facturas/${req.file.filename}`;
    }

    await SolicitudModel.crear({
      id_usuario,
      departamento,
      monto,
      cuenta_destino,
      factura_url,
      concepto,
      tipo_pago,
      fecha_limite_pago,
    });

    /** 🔔 Notificar a TODOS los aprobadores */
    const [aprobadores] = await pool.query(
      "SELECT id_usuario, email FROM usuarios WHERE rol = 'aprobador'"
    );
    for (const ap of aprobadores) {
      await NotificacionService.crearNotificacion({
        id_usuario: ap.id_usuario,
        mensaje: "📥 Nueva solicitud pendiente de aprobación.",
        correo: ap.email,
      });
    }
    // Notificar al solicitante
    await NotificacionService.crearNotificacion({
      id_usuario,
      mensaje: "¡Tu solicitud fue registrada exitosamente!",
    });
    // Registrar acción y notificar admin (solo registro, sin correo)
    await registrarAccion({
      req,
      accion: 'creó',
      entidad: 'solicitud',
      entidadId: null,
      mensajeExtra: ''
    });
    res.status(201).json({ message: "Solicitud creada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la solicitud" });
  }
};

// ─────── Aprobar o rechazar (solo aprobadores) ────────────────
exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, comentario_aprobador } = req.body;
    const { id_usuario: id_aprobador } = req.user;

    if (!["autorizada", "rechazada"].includes(estado)) {
      return res.status(400).json({ error: "Estado no válido." });
    }

    // Validar que siempre se asigne un aprobador si se va a autorizar
    if (estado === 'autorizada' && !id_aprobador) {
      return res.status(400).json({ error: 'No se puede autorizar una solicitud sin aprobador asignado.' });
    }

    const filas = await SolicitudModel.actualizarEstado(
      id,
      estado,
      comentario_aprobador,
      id_aprobador
    );
    if (filas === 0) {
      return res.status(404).json({ error: "Solicitud no encontrada o ya actualizada." });
    }

    /** Datos del solicitante (y su email) */
    const [sol] = await pool.query(
      `SELECT s.id_usuario, u.email
       FROM solicitudes_pago s
       JOIN usuarios u ON u.id_usuario = s.id_usuario
       WHERE s.id_solicitud = ?`,
      [id]
    );
    const { id_usuario: idSolicitante, email } = sol[0];

    if (estado === "autorizada") {
      // 1) Solicitante
      await NotificacionService.crearNotificacion({
        id_usuario: idSolicitante,
        mensaje: "✅ Tu solicitud fue autorizada.",
        correo: email,
      });

      // 2) Pagadores
      const [pagadores] = await pool.query(
        "SELECT id_usuario, email FROM usuarios WHERE rol = 'pagador_banca'"
      );
      for (const pg of pagadores) {
        await NotificacionService.crearNotificacion({
          id_usuario: pg.id_usuario,
          mensaje: "📝 Nueva solicitud autorizada para pago.",
          correo: pg.email,
        });
      }

      // 3) Aprobador (su propia acción)
      await NotificacionService.crearNotificacion({
        id_usuario: id_aprobador,
        mensaje: `✅ Autorizaste la solicitud (ID: ${id}) correctamente.`,
      });
    } else {
      // Rechazada → solo solicitante
      await NotificacionService.crearNotificacion({
        id_usuario: idSolicitante,
        mensaje: "❌ Tu solicitud fue rechazada.",
        correo: email,
      });
      // Aprobador (su propia acción)
      await NotificacionService.crearNotificacion({
        id_usuario: id_aprobador,
        mensaje: `❌ Rechazaste la solicitud (ID: ${id}).`,
      });
    }

    // Registrar acción y notificar admin (solo registro, sin correo)
    await registrarAccion({
      req,
      accion: 'actualizó',
      entidad: 'solicitud',
      entidadId: id,
      mensajeExtra: `Nuevo estado: ${estado}`
    });

    res.json({ message: "Estado actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la solicitud" });
  }
};

// ──────────────── Marcar como pagada (pagador) ─────────────────
exports.marcarComoPagada = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id_usuario: id_pagador } = req.user;

    if (rol !== "pagador_banca") {
      return res.status(403).json({ error: "No tienes permisos para marcar la solicitud como pagada" });
    }

    console.log(`[LOG] Pagador intenta marcar como pagada la solicitud ${id}`);
    const filas = await SolicitudModel.marcarComoPagada(id, id_pagador);
    if (filas === 0) {
      // Verifica el estado actual en BD para debug
      const [rows] = await pool.query(
        `SELECT estado FROM solicitudes_pago WHERE id_solicitud = ?`,
        [id]
      );
      const estadoActual = rows[0]?.estado;
      console.error(`[ERROR] No se pudo marcar como pagada. Estado actual: ${estadoActual}`);
      return res.status(404).json({ error: `No se pudo marcar como pagada. Estado actual: ${estadoActual}` });
    }

    /** Solicitante + aprobador (si existe) con sus emails */
    const [rows] = await pool.query(
      `SELECT s.id_usuario                       AS idSolicitante,
              us.email                          AS emailSolic,
              s.id_aprobador,
              ua.email                          AS emailAprob
       FROM solicitudes_pago s
       JOIN usuarios us ON us.id_usuario = s.id_usuario
       LEFT JOIN usuarios ua ON ua.id_usuario = s.id_aprobador
       WHERE s.id_solicitud = ?`,
      [id]
    );

    if (rows.length) {
      const { idSolicitante, emailSolic, id_aprobador, emailAprob } = rows[0];

      // Solicitante
      await NotificacionService.crearNotificacion({
        id_usuario: idSolicitante,
        mensaje: "💸 Tu solicitud ha sido pagada.",
        correo: emailSolic,
      });

      // Aprobador (si existe)
      if (id_aprobador) {
        await NotificacionService.crearNotificacion({
          id_usuario: id_aprobador,
          mensaje: "💸 Se pagó la solicitud que aprobaste.",
          correo: emailAprob,
        });
      }

      // Pagador (su propio historial)
      await NotificacionService.crearNotificacion({
        id_usuario: id_pagador,
        mensaje: `✅ Marcaste como pagada la solicitud (ID: ${id}).`,
      });
    }

    res.json({ message: "Solicitud marcada como pagada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al marcar la solicitud como pagada" });
  }
};

// ─────────────────── Eliminar (solo admin) ──────────────────────
exports.deleteSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    await SolicitudModel.eliminar(id);
    // Registrar acción y notificar admin (solo registro, sin correo)
    await registrarAccion({
      req,
      accion: 'eliminó',
      entidad: 'solicitud',
      entidadId: id,
      mensajeExtra: ''
    });
    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la solicitud" });
  }
};

// ───────────── Eliminar (solicitante y en pendiente) ────────────────
exports.deleteSolicitudSolicitante = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, rol } = req.user;
    if (rol !== 'solicitante') {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta solicitud' });
    }
    const ok = await SolicitudModel.eliminarSiSolicitantePendiente(id, id_usuario);
    if (!ok) {
      return res.status(400).json({ error: 'Solo puedes eliminar solicitudes propias y en estado pendiente.' });
    }
    await NotificacionService.crearNotificacion({
      id_usuario,
      mensaje: "Has eliminado una solicitud correctamente.",
    });
    res.json({ message: 'Solicitud eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la solicitud' });
  }
};

// ───────────── Editar (solicitante y en pendiente) ────────────────
exports.editarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, rol } = req.user;

    const {
      departamento,
      monto,
      cuenta_destino,
      concepto,
      tipo_pago,
      fecha_limite_pago,
    } = req.body;

    let factura_url = null;
    if (req.file) {
      factura_url = `/uploads/facturas/${req.file.filename}`;
    }

    const esAdminGeneral = rol === "admin_general";
    const filas = await SolicitudModel.editarSolicitudSiPendiente(
      id,
      id_usuario,
      {
        departamento,
        monto,
        cuenta_destino,
        factura_url,
        concepto,
        tipo_pago,
        fecha_limite_pago,
      },
      esAdminGeneral
    );

    if (filas === 0) {
      return res.status(400).json({
        error: "No se puede editar: La solicitud no está pendiente o no tienes permiso.",
      });
    }

    await NotificacionService.crearNotificacion({
      id_usuario,
      mensaje: "✏️ Has editado tu solicitud correctamente.",
    });
    res.json({ message: "Solicitud actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar la solicitud" });
  }
};

// Subir comprobante de pago
exports.subirComprobante = async (req, res) => {
  try {
    const { id } = req.params;
    const archivo = req.file;
    if (!archivo) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }
    // Guardar la URL del comprobante en la solicitud
    const soporte_url = `/uploads/facturas/${archivo.filename}`;
    await pool.query(
      "UPDATE solicitudes_pago SET soporte_url = ? WHERE id_solicitud = ?",
      [soporte_url, id]
    );
    res.json({ message: "Comprobante subido correctamente", soporte_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al subir comprobante" });
  }
};

// ────────────────────── Obtener solicitudes pagadas ─────────────────────
exports.getPagadas = async (req, res) => {
  try {
    const { rol } = req.user;
    if (rol !== 'pagador_banca' && rol !== 'admin_general') {
      return res.status(403).json({ error: 'No tienes permisos para ver solicitudes pagadas' });
    }
    const solicitudes = await SolicitudModel.getPagadas();
    res.json(solicitudes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener solicitudes pagadas' });
  }
};

// ────────────────────── Obtener solicitudes autorizadas y pagadas ─────────────────────
exports.getAutorizadasYPagadas = async (req, res) => {
  try {
    const { rol } = req.user;
    if (rol !== 'pagador_banca' && rol !== 'admin_general') {
      return res.status(403).json({ error: 'No tienes permisos para ver estas solicitudes' });
    }
    const solicitudes = await SolicitudModel.getAutorizadasYPagadas();
    res.json(solicitudes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener solicitudes autorizadas y pagadas' });
  }
};