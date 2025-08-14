/* ──────────────────────────────────────────────────────────────
   Controlador de Solicitudes – Con notificaciones persistentes
   ────────────────────────────────────────────────────────────── */

const SolicitudModel = require("../models/solicitud.model");
const NotificacionService = require("../services/notificacionesService");
const usuarioModel = require("../models/usuario.model");
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
    // DEBUG: Verificar los campos recibidos
    console.log('[SOLICITUD] req.body:', req.body);
    console.log('[SOLICITUD] req.file:', req.file);
    // Validación robusta con Joi
    const schema = Joi.object({
      departamento: Joi.string().min(2).max(100).required(),
      monto: Joi.number().positive().required(),
      cuenta_destino: Joi.string().min(6).max(100).required(),
      concepto: Joi.string().min(3).max(255).required(),
      tipo_pago: Joi.string().min(2).max(50).optional(),
      tipo_pago_descripcion: Joi.string().allow(null, ''),
      empresa_a_pagar: Joi.string().allow(null, ''),
      nombre_persona: Joi.string().min(2).max(255).required(),
      fecha_limite_pago: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional(),
      tipo_cuenta_destino: Joi.string().valid('CLABE', 'Tarjeta', 'Cuenta').required(),
      tipo_tarjeta: Joi.string().valid('Débito', 'Crédito', 'Cuenta').allow(null, ''),
      banco_destino: Joi.string().max(100).allow(null, '')
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: 'Datos inválidos', details: error.details });
    }
    const { departamento, monto, cuenta_destino, concepto, tipo_pago, tipo_pago_descripcion, empresa_a_pagar, nombre_persona, fecha_limite_pago, tipo_cuenta_destino, tipo_tarjeta, banco_destino } = value;

    // Procesar fecha_limite_pago para evitar problemas de zona horaria
    let fechaLimiteProcesada = fecha_limite_pago;
    if (fecha_limite_pago) {
      // Asegurar que la fecha se trate como fecha local, no UTC
      const [year, month, day] = fecha_limite_pago.split('-').map(Number);
      const fechaLocal = new Date(year, month - 1, day);
      fechaLimiteProcesada = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    const { id_usuario } = req.user;

    let factura_url = null;
    if (req.file) {
      factura_url = `/uploads/facturas/${req.file.filename}`;
    }

    // Validación adicional según tipo_cuenta_destino
    if (tipo_cuenta_destino === 'CLABE') {
      // CLABE: 18 dígitos numéricos
      if (!/^[0-9]+$/.test(cuenta_destino)) {
        return res.status(400).json({ error: 'La cuenta CLABE debe tener exactamente 18 dígitos numéricos.' });
      }
    } else if (tipo_cuenta_destino === 'Tarjeta') {
      // Tarjeta: 16 dígitos numéricos
      if (!/^[0-9]+$/.test(cuenta_destino)) {
        return res.status(400).json({ error: 'El número de tarjeta debe tener exactamente 16 dígitos numéricos.' });
      }
    } else if (tipo_cuenta_destino === 'Cuenta') {
      // Cuenta: mínimo 6 dígitos numéricos
      if (!/^[0-9]+$/.test(cuenta_destino)) {
        return res.status(400).json({ error: 'El número de cuenta debe tener al menos 6 dígitos numéricos.' });
      }
    }

    await SolicitudModel.crear({
      id_usuario,
      departamento,
      monto,
      cuenta_destino,
      factura_url,
      concepto,
      tipo_pago,
      tipo_pago_descripcion,
      empresa_a_pagar,
      nombre_persona,
      fecha_limite_pago: fechaLimiteProcesada,
      tipo_cuenta_destino,
      tipo_tarjeta,
      banco_destino
    });

    // Detalles para el correo
    const detallesSolicitud = `
      <table style='border-collapse:collapse; width:100%; max-width:420px; background:#f9fafb; border-radius:8px; overflow:hidden; font-size:15px; margin:16px 0;'>
        <tr style='background:#2563eb; color:#fff;'><th colspan='2' style='padding:10px 0; font-size:16px;'>Detalles de la Solicitud</th></tr>
        <tr><td style='padding:8px 12px; font-weight:bold;'>Departamento:</td><td style='padding:8px 12px;'>${departamento}</td></tr>
        <tr style='background:#f1f5f9;'><td style='padding:8px 12px; font-weight:bold;'>Monto:</td><td style='padding:8px 12px;'>$${monto}</td></tr>
        <tr><td style='padding:8px 12px; font-weight:bold;'>Cuenta destino:</td><td style='padding:8px 12px;'>${cuenta_destino}</td></tr>
        <tr style='background:#f1f5f9;'><td style='padding:8px 12px; font-weight:bold;'>Concepto:</td><td style='padding:8px 12px;'>${concepto}</td></tr>
        <tr><td style='padding:8px 12px; font-weight:bold;'>Tipo de pago:</td><td style='padding:8px 12px;'>${tipo_pago || '-'}</td></tr>
        <tr style='background:#f1f5f9;'><td style='padding:8px 12px; font-weight:bold;'>Fecha límite de pago:</td><td style='padding:8px 12px;'>${fecha_limite_pago || '-'}</td></tr>
      </table>
    `;

    // Enviar correo al admin_general
    const { enviarCorreo } = require('../services/correoService');
    const [admins] = await pool.query("SELECT email, nombre FROM usuarios WHERE rol = 'admin_general'");
    const url = 'https://bechapra.com.mx';
    if (admins.length > 0) {
      const admin = admins[0];
      const [solicitanteInfo] = await pool.query("SELECT nombre FROM usuarios WHERE id_usuario = ?", [id_usuario]);
      const nombreSolicitante = solicitanteInfo[0]?.nombre || id_usuario;
      await enviarCorreo({
        para: admin.email,
        asunto: 'Nueva solicitud registrada',
        nombre: admin.nombre,
        link: url,
        mensaje: `<div style='font-family:Arial,sans-serif;'><h2 style='color:#2563eb;'>Nueva solicitud registrada</h2><p>El usuario <b>${nombreSolicitante}</b> ha registrado una nueva solicitud:</p>${detallesSolicitud}<p style='color:#888;font-size:13px;'>Por favor, revisa la plataforma para más detalles.</p></div>`
      });
    }

    /** 🔔 Notificar a TODOS los aprobadores */
    // Obtener nombre del solicitante para notificación personalizada
    const [solicitanteInfoNotif] = await pool.query("SELECT nombre FROM usuarios WHERE id_usuario = ?", [id_usuario]);
    const nombreSolicNotif = solicitanteInfoNotif[0]?.nombre || id_usuario;
    const [aprobadores] = await pool.query(
      "SELECT id_usuario, email FROM usuarios WHERE rol = 'aprobador'"
    );
    for (const ap of aprobadores) {
      await NotificacionService.crearNotificacion({
        id_usuario: ap.id_usuario,
        mensaje: `📥 Tienes una nueva solicitud pendiente de aprobación de ${nombreSolicNotif} por $${monto}.`,
        correo: ap.email,
      });
    }
    // Notificar al solicitante (correo con detalles)
    const [solicitante] = await pool.query("SELECT email, nombre FROM usuarios WHERE id_usuario = ?", [id_usuario]);
    const nombreSolicitanteCorreo = solicitante[0]?.nombre || '';
    await enviarCorreo({
      para: solicitante[0]?.email,
      asunto: '¡Tu solicitud ha sido registrada!',
      nombre: nombreSolicitanteCorreo,
      link: url,
      mensaje: `<div style='font-family:Arial,sans-serif;'><h2 style='color:#2563eb;'>¡Solicitud registrada!</h2><p>Hola <b>${nombreSolicitanteCorreo}</b>,</p><p>Tu solicitud ha sido registrada correctamente y está en proceso de revisión.</p>${detallesSolicitud}<p style='color:#888;font-size:13px;'>Puedes consultar el estado de tu solicitud en la plataforma.</p></div>`
    });
    await NotificacionService.crearNotificacion({
      id_usuario,
      mensaje: `✅ ¡${nombreSolicitanteCorreo}, tu solicitud fue registrada exitosamente!`,
      correo: solicitante[0]?.email
    });
    // Registrar acción
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
    // Obtener datos completos y claros del solicitante y la solicitud
    const [sol] = await pool.query(
      `SELECT 
         s.id_usuario AS idSolicitante,
         u.email AS emailSolicitante,
         u.nombre AS nombreSolicitante,
         s.departamento, s.monto, s.cuenta_destino, s.concepto, s.tipo_pago, s.fecha_limite_pago, s.factura_url
       FROM solicitudes_pago s
       JOIN usuarios u ON u.id_usuario = s.id_usuario
       WHERE s.id_solicitud = ?`,
      [id]
    );
    if (!sol.length) {
      return res.status(404).json({ error: "No se encontraron datos del solicitante para la solicitud." });
    }
    const {
      idSolicitante,
      emailSolicitante: email,
      nombreSolicitante: nombre,
      departamento,
      monto,
      cuenta_destino,
      concepto,
      tipo_pago,
      fecha_limite_pago,
      factura_url
    } = sol[0];

    // Obtener info de admin y aprobador (más robusto y preparado para múltiples admins)
    const [adminRows] = await pool.query("SELECT email, nombre FROM usuarios WHERE rol = 'admin_general'");
    const [aprobadorRows] = id_aprobador ? await pool.query("SELECT email, nombre FROM usuarios WHERE id_usuario = ?", [id_aprobador]) : [[]];
    const url = 'https://bechapra.com.mx';

    // HTML profesional para detalles de la solicitud
    const detallesSolicitud = `
      <table style="border-collapse:collapse; width:100%; max-width:440px; background:#f9fafb; border-radius:8px; overflow:hidden; font-size:15px; margin:16px 0;">
        <tr style="background:#2563eb; color:#fff;"><th colspan="2" style="padding:10px 0; font-size:16px;">Detalles de la Solicitud</th></tr>
        <tr><td style="padding:8px 12px; font-weight:bold;">ID:</td><td style="padding:8px 12px;">${id}</td></tr>
        <tr style="background:#f1f5f9;"><td style="padding:8px 12px; font-weight:bold;">Departamento:</td><td style="padding:8px 12px;">${departamento}</td></tr>
        <tr><td style="padding:8px 12px; font-weight:bold;">Monto:</td><td style="padding:8px 12px;">$${monto}</td></tr>
        <tr style="background:#f1f5f9;"><td style="padding:8px 12px; font-weight:bold;">Cuenta destino:</td><td style="padding:8px 12px;">${cuenta_destino}</td></tr>
        <tr><td style="padding:8px 12px; font-weight:bold;">Concepto:</td><td style="padding:8px 12px;">${concepto}</td></tr>
        <tr style="background:#f1f5f9;"><td style="padding:8px 12px; font-weight:bold;">Tipo de pago:</td><td style="padding:8px 12px;">${tipo_pago || '-'}</td></tr>
        <tr><td style="padding:8px 12px; font-weight:bold;">Fecha límite de pago:</td><td style="padding:8px 12px;">${fecha_limite_pago || '-'}</td></tr>
        ${comentario_aprobador ? `<tr><td style=\"padding:8px 12px; font-weight:bold;\">Comentario del aprobador:</td><td style=\"padding:8px 12px;\">${comentario_aprobador}</td></tr>` : ''}
      </table>
    `;
    const { enviarCorreo } = require('../services/correoService');

    if (estado === "autorizada") {
      // Correo al admin
      if (adminRows.length > 0) {
        const admin = adminRows[0];
        await enviarCorreo({
          para: admin.email,
          asunto: 'Solicitud aprobada',
          nombre: admin.nombre,
          link: url,
          mensaje: `<div style='font-family:Arial,sans-serif;'><h2 style='color:#22c55e;'>Solicitud aprobada</h2><p>El aprobador <b>${aprobadorRows[0]?.nombre || id_aprobador}</b> ha aprobado una solicitud:</p>${detallesSolicitud}<p style='color:#888;font-size:13px;'>Consulta la plataforma para más información.</p></div>`
        });
      }
      // Correo al aprobador
      if (aprobadorRows.length > 0) {
        const aprobador = aprobadorRows[0];
        await enviarCorreo({
          para: aprobador.email,
          asunto: '¡Aprobación registrada!',
          nombre: aprobador.nombre,
          link: url,
          mensaje: `<div style='font-family:Arial,sans-serif;'><h2 style='color:#2563eb;'>¡Aprobación registrada!</h2><p>Hola <b>${aprobador.nombre}</b>,</p><p>Has aprobado la siguiente solicitud:</p>${detallesSolicitud}<p style='color:#888;font-size:13px;'>Puedes consultar el historial de solicitudes en la plataforma.</p></div>`
        });
      }
      // Correo al solicitante
      await enviarCorreo({
        para: email,
        asunto: '¡Tu solicitud ha sido aprobada!',
        nombre: nombre,
        link: url,
        mensaje: `<div style='font-family:Arial,sans-serif;'><h2 style='color:#22c55e;'>¡Felicidades, tu solicitud fue aprobada!</h2><p>Hola <b>${nombre}</b>,</p><p>Nos complace informarte que tu solicitud ha sido aprobada y está lista para el siguiente paso.</p>${detallesSolicitud}<p style='color:#888;font-size:13px;'>Puedes consultar el estado y seguimiento en la plataforma.</p></div>`
      });
      // 1) Solicitante (notificación in-app)
      await NotificacionService.crearNotificacion({
  id_usuario: idSolicitante,
  mensaje: `✅ ¡Felicidades ${nombre}! Tu solicitud fue autorizada por ${aprobadorRows[0]?.nombre ? `${aprobadorRows[0].nombre}` : 'el aprobador'}.`,
  correo: email,
      });
      // 2) Pagadores
      const [pagadores] = await pool.query(
        "SELECT id_usuario, email, nombre FROM usuarios WHERE rol = 'pagador_banca'"
      );
      for (const pg of pagadores) {
        const nombreAprobador = aprobadorRows[0]?.nombre || 'un aprobador';
        await NotificacionService.crearNotificacion({
          id_usuario: pg.id_usuario,
          mensaje: `� Nueva solicitud autorizada para pago: <b>${nombre}</b> por <b>$${monto}</b> (autorizada por <b>${nombreAprobador}</b>)`,
          correo: pg.email,
        });
      }
      // 3) Aprobador (notificación in-app)
      if (aprobadorRows.length > 0) {
        await NotificacionService.crearNotificacion({
          id_usuario: id_aprobador,
          mensaje: `✅ ¡Aprobaste exitosamente la solicitud de ${nombre} por $${monto}!`,
          correo: aprobadorRows[0].email
        });
      }
    } else {
      // Correo al admin
      if (adminRows.length > 0) {
        const admin = adminRows[0];
        await enviarCorreo({
          para: admin.email,
          asunto: 'Solicitud rechazada',
          nombre: admin.nombre,
          link: url,
          mensaje: `<div style='font-family:Arial,sans-serif;'><h2 style='color:#ef4444;'>Solicitud rechazada</h2><p>El aprobador <b>${aprobadorRows[0]?.nombre || id_aprobador}</b> ha rechazado una solicitud:</p>${detallesSolicitud}<p style='color:#888;font-size:13px;'>Consulta la plataforma para más información.</p></div>`
        });
      }
      // Correo al aprobador
      if (aprobadorRows.length > 0) {
        const aprobador = aprobadorRows[0];
        await enviarCorreo({
          para: aprobador.email,
          asunto: 'Rechazo de solicitud registrado',
          nombre: aprobador.nombre,
          link: url,
          mensaje: `<div style='font-family:Arial,sans-serif;'><h2 style='color:#ef4444;'>Rechazo registrado</h2><p>Has rechazado la siguiente solicitud:</p>${detallesSolicitud}<p style='color:#888;font-size:13px;'>Consulta el historial en la plataforma.</p></div>`
        });
      }
      // Correo al solicitante
      await enviarCorreo({
        para: email,
        asunto: 'Tu solicitud fue rechazada',
        nombre: nombre,
        link: url,
        mensaje: `<div style='font-family:Arial,sans-serif;'><h2 style='color:#ef4444;'>Tu solicitud fue rechazada</h2><p>Hola <b>${nombre}</b>,</p><p>Lamentamos informarte que tu solicitud fue rechazada.</p>${detallesSolicitud}<p style='color:#888;font-size:13px;'>Puedes consultar los detalles en la plataforma.</p></div>`
      });
      // Rechazada → solo solicitante (notificación in-app)
      await NotificacionService.crearNotificacion({
  id_usuario: idSolicitante,
  mensaje: `❌ ${nombre}, tu solicitud fue rechazada por ${aprobadorRows[0]?.nombre ? `${aprobadorRows[0].nombre}` : 'el aprobador'}.`,
  correo: email,
      });
      // Aprobador (notificación in-app)
      if (aprobadorRows.length > 0) {
        await NotificacionService.crearNotificacion({
          id_usuario: id_aprobador,
          mensaje: `❌ Rechazaste la solicitud de ${nombre} por $${monto}.`,
          correo: aprobadorRows[0].email
        });
      }
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

    /** Solicitante + aprobador (si existe) con sus emails y detalles */
    const [rows] = await pool.query(
      `SELECT s.id_usuario AS idSolicitante,
              us.email AS emailSolic,
              us.nombre AS nombreSolic,
              s.id_aprobador,
              ua.email AS emailAprob,
              ua.nombre AS nombreAprob,
              s.departamento, s.monto, s.cuenta_destino, s.concepto, s.tipo_pago, s.fecha_limite_pago, s.factura_url
       FROM solicitudes_pago s
       JOIN usuarios us ON us.id_usuario = s.id_usuario
       LEFT JOIN usuarios ua ON ua.id_usuario = s.id_aprobador
       WHERE s.id_solicitud = ?`,
      [id]
    );

    if (rows.length) {
      const { idSolicitante, emailSolic, nombreSolic, id_aprobador, emailAprob, nombreAprob, departamento, monto, cuenta_destino, concepto, tipo_pago, fecha_limite_pago, factura_url } = rows[0];

      // Obtener info de admin
      const [adminRows] = await pool.query("SELECT email, nombre FROM usuarios WHERE rol = 'admin_general'");
      const url = 'https://bechapra.com.mx';
      const detallesSolicitud = `
        <b>ID:</b> ${id}<br>
        <b>Departamento:</b> ${departamento}<br>
        <b>Monto:</b> $${monto}<br>
        <b>Cuenta destino:</b> ${cuenta_destino}<br>
        <b>Concepto:</b> ${concepto}<br>
        <b>Tipo de pago:</b> ${tipo_pago || '-'}<br>
        <b>Fecha límite de pago:</b> ${fecha_limite_pago || '-'}<br>
        ${factura_url ? `<b>Factura adjunta:</b> ${factura_url}<br>` : ''}
      `;
      const { enviarCorreo } = require('../services/correoService');

      // Correo al admin
      if (adminRows.length > 0) {
        const admin = adminRows[0];
        await enviarCorreo({
          para: admin.email,
          asunto: 'Solicitud pagada',
          nombre: admin.nombre,
          link: url,
          mensaje: `El pagador ID ${id_pagador} ha <b>marcado como pagada</b> la siguiente solicitud:<br>${detallesSolicitud}`
        });
      }
      // Correo al aprobador (si existe)
      if (id_aprobador && emailAprob) {
        await enviarCorreo({
          para: emailAprob,
          asunto: 'Solicitud pagada',
          nombre: nombreAprob,
          link: url,
          mensaje: `La solicitud que aprobaste ha sido <b>pagada</b>:<br>${detallesSolicitud}`
        });
      }
      // Correo al solicitante
      if (emailSolic) {
        await enviarCorreo({
          para: emailSolic,
          asunto: 'Tu solicitud ha sido pagada',
          nombre: nombreSolic,
          link: url,
          mensaje: `¡Tu solicitud ha sido <b>pagada</b>!<br>${detallesSolicitud}`
        });
      }

      // Obtener información del pagador que está marcando como pagada
      const [pagadorInfo] = await pool.query("SELECT nombre FROM usuarios WHERE id_usuario = ?", [id_pagador]);
      const nombrePagador = pagadorInfo[0]?.nombre || 'Pagador';

      // Solicitante (notificación in-app)
      await NotificacionService.crearNotificacion({
        id_usuario: idSolicitante,
        mensaje: nombrePagador ? `💸 Tu solicitud por $${monto} ha sido pagada por ${nombrePagador} del departamento de pagos.` : `💸 Tu solicitud por $${monto} ha sido pagada.`,
        correo: emailSolic,
      });

      // Aprobador (si existe, notificación in-app)
      if (id_aprobador && emailAprob) {
        await NotificacionService.crearNotificacion({
          id_usuario: id_aprobador,
          mensaje: nombrePagador ? `💸 ${nombrePagador} pagó la solicitud de ${nombreSolic} por $${monto} que tú aprobaste.` : `💸 Se pagó la solicitud de ${nombreSolic} por $${monto} que aprobaste.`,
          correo: emailAprob,
        });
      }

      // Pagador (su propio historial)
      const [pagador] = await pool.query("SELECT email, nombre FROM usuarios WHERE id_usuario = ?", [id_pagador]);
      await NotificacionService.crearNotificacion({
        id_usuario: id_pagador,
        mensaje: `✅ Marcaste como pagada la solicitud de <b>${nombreSolic}</b> por <b>$${monto}</b>.`,
        correo: pagador[0]?.email
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
    // Obtener detalles antes de eliminar
    const [sol] = await pool.query(
      `SELECT s.id_usuario, u.email, u.nombre, s.departamento, s.monto, s.cuenta_destino, s.concepto, s.tipo_pago, s.fecha_limite_pago, s.factura_url
       FROM solicitudes_pago s JOIN usuarios u ON u.id_usuario = s.id_usuario WHERE s.id_solicitud = ?`,
      [id]
    );
    let detallesSolicitud = '';
    if (sol.length) {
      const s = sol[0];
      detallesSolicitud = `
        <b>Departamento:</b> ${s.departamento}<br>
        <b>Monto:</b> $${s.monto}<br>
        <b>Cuenta destino:</b> ${s.cuenta_destino}<br>
        <b>Concepto:</b> ${s.concepto}<br>
        <b>Tipo de pago:</b> ${s.tipo_pago || '-'}<br>
        <b>Fecha límite de pago:</b> ${s.fecha_limite_pago || '-'}<br>
        ${s.factura_url ? `<b>Factura adjunta:</b> ${s.factura_url}<br>` : ''}
      `;
    }

    await SolicitudModel.eliminar(id);

    // Enviar correo al admin_general
    const { enviarCorreo } = require('../services/correoService');
    const [admins] = await pool.query("SELECT email, nombre FROM usuarios WHERE rol = 'admin_general'");
    const url = 'https://bechapra.com.mx';
    if (admins.length > 0 && sol.length) {
      const admin = admins[0];
      await enviarCorreo({
        para: admin.email,
        asunto: 'Solicitud eliminada en Bechapra',
        nombre: admin.nombre,
        link: url,
        mensaje: `Se ha eliminado una solicitud del usuario ${sol[0].nombre} (ID: ${sol[0].id_usuario}):<br>${detallesSolicitud}`
      });
    }

    // Enviar correo al solicitante
    if (sol.length) {
      await enviarCorreo({
        para: sol[0].email,
        asunto: 'Tu solicitud ha sido eliminada',
        nombre: sol[0].nombre,
        link: url,
        mensaje: `Tu solicitud ha sido eliminada por el administrador.<br>${detallesSolicitud}`
      });
      await NotificacionService.crearNotificacion({
        id_usuario: sol[0].id_usuario,
        mensaje: 'Tu solicitud ha sido eliminada por el administrador.',
        correo: sol[0].email
      });
    }

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
    // Obtener detalles antes de eliminar
    const [sol] = await pool.query(
      `SELECT s.id_usuario, u.email, u.nombre, s.departamento, s.monto, s.cuenta_destino, s.concepto, s.tipo_pago, s.fecha_limite_pago, s.factura_url
       FROM solicitudes_pago s JOIN usuarios u ON u.id_usuario = s.id_usuario WHERE s.id_solicitud = ?`,
      [id]
    );
    let detallesSolicitud = '';
    if (sol.length) {
      const s = sol[0];
      detallesSolicitud = `
        <b>Departamento:</b> ${s.departamento}<br>
        <b>Monto:</b> $${s.monto}<br>
        <b>Cuenta destino:</b> ${s.cuenta_destino}<br>
        <b>Concepto:</b> ${s.concepto}<br>
        <b>Tipo de pago:</b> ${s.tipo_pago || '-'}<br>
        <b>Fecha límite de pago:</b> ${s.fecha_limite_pago || '-'}<br>
        ${s.factura_url ? `<b>Factura adjunta:</b> ${s.factura_url}<br>` : ''}
      `;
    }

    const ok = await SolicitudModel.eliminarSiSolicitantePendiente(id, id_usuario);
    if (!ok) {
      return res.status(400).json({ error: 'Solo puedes eliminar solicitudes propias y en estado pendiente.' });
    }

    // Enviar correo al admin_general
    const { enviarCorreo } = require('../services/correoService');
    const [admins] = await pool.query("SELECT email, nombre FROM usuarios WHERE rol = 'admin_general'");
    const url = 'https://bechapra.com.mx';
    if (admins.length > 0 && sol.length) {
      const admin = admins[0];
      await enviarCorreo({
        para: admin.email,
        asunto: 'Solicitud eliminada por solicitante en Bechapra',
        nombre: admin.nombre,
        link: url,
        mensaje: `El usuario ${sol[0].nombre} (ID: ${sol[0].id_usuario}) ha eliminado su propia solicitud:<br>${detallesSolicitud}`
      });
    }

    // Enviar correo al solicitante
    if (sol.length) {
      await enviarCorreo({
        para: sol[0].email,
        asunto: 'Has eliminado una solicitud',
        nombre: sol[0].nombre,
        link: url,
        mensaje: `Has eliminado una solicitud correctamente.<br>${detallesSolicitud}`
      });
      await NotificacionService.crearNotificacion({
        id_usuario,
        mensaje: "Has eliminado una solicitud correctamente.",
        correo: sol[0].email
      });
    }
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
      tipo_pago_descripcion,
      empresa_a_pagar,
      nombre_persona,
      fecha_limite_pago,
      tipo_cuenta_destino,
      tipo_tarjeta,
      banco_destino
    } = req.body;

    // Procesar fecha_limite_pago para evitar problemas de zona horaria
    let fechaLimiteProcesada = fecha_limite_pago;
    if (fecha_limite_pago) {
      // Asegurar que la fecha se trate como fecha local, no UTC
      const [year, month, day] = fecha_limite_pago.split('-').map(Number);
      const fechaLocal = new Date(year, month - 1, day);
      fechaLimiteProcesada = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    let factura_url = null;
    if (req.file) {
      factura_url = `/uploads/facturas/${req.file.filename}`;
    }

    // LOG de los campos recibidos y a actualizar
    console.log('[EDITAR SOLICITUD] Campos recibidos:', {
      departamento,
      monto,
      cuenta_destino,
      concepto,
      tipo_pago,
      tipo_pago_descripcion,
      empresa_a_pagar,
      nombre_persona,
      fecha_limite_pago,
      tipo_cuenta_destino,
      tipo_tarjeta,
      banco_destino,
      factura_url
    });

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
        tipo_pago_descripcion,
        empresa_a_pagar,
        nombre_persona,
        fecha_limite_pago: fechaLimiteProcesada,
        tipo_cuenta_destino,
        tipo_tarjeta,
        banco_destino
      },
      esAdminGeneral
    );

    if (filas === 0) {
      return res.status(400).json({
        error: "No se puede editar: La solicitud no está pendiente o no tienes permiso.",
      });
    }

    // Detalles para el correo
    const detallesSolicitud = `
      <b>Departamento:</b> ${departamento}<br>
      <b>Monto:</b> $${monto}<br>
      <b>Cuenta destino:</b> ${cuenta_destino}<br>
      <b>Concepto:</b> ${concepto}<br>
      <b>Tipo de pago:</b> ${tipo_pago || '-'}<br>
      <b>Fecha límite de pago:</b> ${fecha_limite_pago || '-'}<br>
      ${factura_url ? `<b>Factura adjunta:</b> ${factura_url}<br>` : ''}
    `;

    // Enviar correo al admin_general
    const { enviarCorreo } = require('../services/correoService');
    const [admins] = await pool.query("SELECT email, nombre FROM usuarios WHERE rol = 'admin_general'");
    const url = 'https://bechapra.com.mx';
    if (admins.length > 0) {
      const admin = admins[0];
      await enviarCorreo({
        para: admin.email,
        asunto: 'Solicitud actualizada en Bechapra',
        nombre: admin.nombre,
        link: url,
        mensaje: `Se ha actualizado una solicitud por el usuario ID ${id_usuario}:<br>${detallesSolicitud}`
      });
    }

    // Enviar correo al solicitante
    const [solicitante] = await pool.query("SELECT email, nombre FROM usuarios WHERE id_usuario = ?", [id_usuario]);
    await enviarCorreo({
      para: solicitante[0]?.email,
      asunto: 'Solicitud actualizada exitosamente',
      nombre: solicitante[0]?.nombre,
      link: url,
      mensaje: `¡Has actualizado tu solicitud correctamente!<br>${detallesSolicitud}`
    });
    await NotificacionService.crearNotificacion({
      id_usuario,
      mensaje: "✏️ Has editado tu solicitud correctamente.",
      correo: solicitante[0]?.email
    });
    res.json({ message: "Solicitud actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar la solicitud" });
  }
}
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

    // Obtener detalles y correos
    const [rows] = await pool.query(
      `SELECT s.id_usuario AS idSolicitante,
              us.email AS emailSolic,
              us.nombre AS nombreSolic,
              s.id_aprobador,
              ua.email AS emailAprob,
              ua.nombre AS nombreAprob,
              s.departamento, s.monto, s.cuenta_destino, s.concepto, s.tipo_pago, s.fecha_limite_pago, s.factura_url
       FROM solicitudes_pago s
       JOIN usuarios us ON us.id_usuario = s.id_usuario
       LEFT JOIN usuarios ua ON ua.id_usuario = s.id_aprobador
       WHERE s.id_solicitud = ?`,
      [id]
    );

    if (rows.length) {
      const { idSolicitante, emailSolic, nombreSolic, id_aprobador, emailAprob, nombreAprob, departamento, monto, cuenta_destino, concepto, tipo_pago, fecha_limite_pago, factura_url } = rows[0];

      // Obtener info de admin
      const [adminRows] = await pool.query("SELECT email, nombre FROM usuarios WHERE rol = 'admin_general'");
      const url = 'https://bechapra.com.mx';
      const detallesSolicitud = `
        <b>ID:</b> ${id}<br>
        <b>Departamento:</b> ${departamento}<br>
        <b>Monto:</b> $${monto}<br>
        <b>Cuenta destino:</b> ${cuenta_destino}<br>
        <b>Concepto:</b> ${concepto}<br>
        <b>Tipo de pago:</b> ${tipo_pago || '-'}<br>
        <b>Fecha límite de pago:</b> ${fecha_limite_pago || '-'}<br>
        ${factura_url ? `<b>Factura adjunta:</b> ${factura_url}<br>` : ''}
        <b>Comprobante subido:</b> ${soporte_url}<br>
      `;
      const { enviarCorreo } = require('../services/correoService');

      // Correo al admin
      if (adminRows.length > 0) {
        const admin = adminRows[0];
        await enviarCorreo({
          para: admin.email,
          asunto: 'Comprobante subido a solicitud',
          nombre: admin.nombre,
          link: url,
          mensaje: `Se ha subido un comprobante a la siguiente solicitud:<br>${detallesSolicitud}`
        });
      }
      // Correo al aprobador (si existe)
      if (id_aprobador && emailAprob) {
        await enviarCorreo({
          para: emailAprob,
          asunto: 'Comprobante subido a solicitud',
          nombre: nombreAprob,
          link: url,
          mensaje: `Se ha subido un comprobante a la solicitud que aprobaste:<br>${detallesSolicitud}`
        });
      }
      // Correo al solicitante
      if (emailSolic) {
        await enviarCorreo({
          para: emailSolic,
          asunto: 'Comprobante subido a tu solicitud',
          nombre: nombreSolic,
          link: url,
          mensaje: `Se ha subido un comprobante a tu solicitud:<br>${detallesSolicitud}`
        });
      }

      // Notificaciones in-app con más detalles
      const nombrePagador = req.user.nombre || 'Pagador';
      
      // Notificar al solicitante
      await NotificacionService.crearNotificacion({
        id_usuario: idSolicitante,
        mensaje: `📄 ${nombrePagador} subió el comprobante de pago de tu solicitud por $${monto} (${concepto}).`,
        correo: emailSolic
      });

      // Notificar al aprobador si existe
      if (id_aprobador) {
        await NotificacionService.crearNotificacion({
          id_usuario: id_aprobador,
          mensaje: `📄 ${nombrePagador} subió el comprobante de pago de la solicitud de ${nombreSolic} por $${monto} que aprobaste.`,
          correo: emailAprob
        });
      }

      // Notificar al admin
      const admin = await usuarioModel.getUsuarioByRol('admin_general');
      if (admin) {
        await NotificacionService.crearNotificacion({
          id_usuario: admin.id_usuario,
          mensaje: `📄 ${nombrePagador} subió un comprobante de pago para la solicitud de ${nombreSolic} por $${monto}.`,
          correo: admin.email
        });
      }
    }

    // Registrar acción
    await registrarAccion({
      req,
      accion: 'subió',
      entidad: 'comprobante',
      entidadId: null,
      mensajeExtra: `para la solicitud #${id}`
    });

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

// ──────────────── ENDPOINTS DE ESTADÍSTICAS PARA DASHBOARD ADMIN ────────────────

// 1. Solicitudes por estado
exports.getSolicitudesPorEstado = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT estado, COUNT(*) as cantidad FROM solicitudes_pago GROUP BY estado`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estadísticas por estado' });
  }
};

// 2. Monto total pagado por mes/año
exports.getMontoPagadoPorMes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT YEAR(fecha_pago) as anio, MONTH(fecha_pago) as mes, SUM(monto) as total_pagado
       FROM solicitudes_pago
       WHERE estado = 'pagada' AND fecha_pago IS NOT NULL
       GROUP BY anio, mes
       ORDER BY anio DESC, mes DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener monto pagado por mes/año' });
  }
};

// 3. Solicitudes por departamento
exports.getSolicitudesPorDepartamento = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT departamento, COUNT(*) as cantidad FROM solicitudes_pago GROUP BY departamento`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estadísticas por departamento' });
  }
};

// 4. Solicitudes por tipo de pago
exports.getSolicitudesPorTipoPago = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT tipo_pago, COUNT(*) as cantidad FROM solicitudes_pago GROUP BY tipo_pago`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estadísticas por tipo de pago' });
  }
};

// 5. Solicitudes creadas, aprobadas y pagadas en el tiempo
exports.getSolicitudesPorFecha = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DATE(fecha_creacion) as fecha, 
              SUM(estado = 'pendiente') as pendientes,
              SUM(estado = 'autorizada') as autorizadas,
              SUM(estado = 'pagada') as pagadas,
              SUM(estado = 'rechazada') as rechazadas
       FROM solicitudes_pago
       GROUP BY fecha
       ORDER BY fecha DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estadísticas por fecha' });
  }
};

// 6. Ranking de usuarios con más solicitudes
exports.getRankingUsuariosSolicitudes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.nombre, COUNT(s.id_solicitud) as total_solicitudes
       FROM usuarios u
       JOIN solicitudes_pago s ON s.id_usuario = u.id_usuario
       GROUP BY u.id_usuario, u.nombre
       ORDER BY total_solicitudes DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ranking de usuarios' });
  }
};


// ──────────────── Aprobar solicitudes en lote (aprobador) ─────────────────
exports.marcarComoPagadasLote = async (req, res) => {
  try {
    console.log('[BATCH-APROBAR] req.user:', req.user);
    console.log('[BATCH-APROBAR] req.body:', req.body);
    const { ids } = req.body; // Array de IDs de solicitudes
    const { rol, id_usuario: id_aprobador } = req.user;

    if (rol !== "aprobador" && rol !== "admin_general") {
      return res.status(403).json({ error: "No tienes permisos para aprobar solicitudes" });
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Debes enviar un arreglo de IDs de solicitudes" });
    }

    // Solo aprobar las que están en estado 'pendiente'
    const fechaRevision = new Date();
    const [result] = await pool.query(
      `UPDATE solicitudes_pago SET estado = 'autorizada', id_aprobador = ?, comentario_aprobador = ?, fecha_revision = ? WHERE id_solicitud IN (${ids.map(() => '?').join(',')}) AND estado = 'pendiente'`,
      [id_aprobador, req.body.comentario_aprobador || '', fechaRevision, ...ids]
    );

    // Notificar y enviar correos solo si se actualizaron filas
    if (result.affectedRows > 0) {
      // Obtener detalles de las solicitudes actualizadas
      const [solicitudes] = await pool.query(
        `SELECT s.id_solicitud, s.id_usuario AS idSolicitante, us.email AS emailSolic, us.nombre AS nombreSolic,
                s.departamento, s.monto, s.cuenta_destino, s.concepto, s.tipo_pago, s.fecha_limite_pago, s.factura_url
         FROM solicitudes_pago s
         JOIN usuarios us ON us.id_usuario = s.id_usuario
         WHERE s.id_solicitud IN (?)`,
        [ids]
      );
      const [adminRows] = await pool.query("SELECT email, nombre FROM usuarios WHERE rol = 'admin_general'");
      const url = 'https://bechapra.com.mx';
      const { enviarCorreo } = require('../services/correoService');
      for (const s of solicitudes) {
        const detallesSolicitud = `
          <b>ID:</b> ${s.id_solicitud}<br>
          <b>Departamento:</b> ${s.departamento}<br>
          <b>Monto:</b> $${s.monto}<br>
          <b>Cuenta destino:</b> ${s.cuenta_destino}<br>
          <b>Concepto:</b> ${s.concepto}<br>
          <b>Tipo de pago:</b> ${s.tipo_pago || '-'}<br>
          <b>Fecha límite de pago:</b> ${s.fecha_limite_pago || '-'}<br>
          ${s.factura_url ? `<b>Factura adjunta:</b> ${s.factura_url}<br>` : ''}
        `;
        // Correo al admin
        if (adminRows.length > 0) {
          const admin = adminRows[0];
          await enviarCorreo({
            para: admin.email,
            asunto: 'Solicitud aprobada (lote)',
            nombre: admin.nombre,
            link: url,
            mensaje: `El aprobador ID ${id_aprobador} ha <b>aprobado</b> la siguiente solicitud:<br>${detallesSolicitud}`
          });
        }
        // Correo al solicitante
        if (s.emailSolic) {
          await enviarCorreo({
            para: s.emailSolic,
            asunto: 'Tu solicitud ha sido aprobada (lote)',
            nombre: s.nombreSolic,
            link: url,
            mensaje: `¡Tu solicitud ha sido <b>aprobada</b>!<br>${detallesSolicitud}`
          });
        }
        // Notificaciones in-app
        await NotificacionService.crearNotificacion({
          id_usuario: s.idSolicitante,
          mensaje: "✅ Tu solicitud fue autorizada.",
          correo: s.emailSolic,
        });
        // Aprobador (su propio historial)
        const [aprobador] = await pool.query("SELECT email, nombre FROM usuarios WHERE id_usuario = ?", [id_aprobador]);
        await NotificacionService.crearNotificacion({
          id_usuario: id_aprobador,
          mensaje: `✅ Autorizaste la solicitud (ID: ${s.id_solicitud}) correctamente (lote).`,
          correo: aprobador[0]?.email
        });
      }
    }

    res.json({ message: `Solicitudes aprobadas: ${result.affectedRows}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al aprobar solicitudes" });
  }
};

// ──────────────── Rechazar solicitudes en lote (aprobador) ─────────────────
exports.rechazarLote = async (req, res) => {
  try {
    console.log('[BATCH-RECHAZAR] req.user:', req.user);
    console.log('[BATCH-RECHAZAR] req.body:', req.body);
    const { ids, comentario_aprobador } = req.body; // Array de IDs de solicitudes
    const { rol, id_usuario: id_aprobador } = req.user;
    if (rol !== "aprobador" && rol !== "admin_general") {
      return res.status(403).json({ error: "No tienes permisos para rechazar solicitudes" });
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Debes enviar un arreglo de IDs de solicitudes" });
    }

    // Rechazar solo las que están en estado 'pendiente'
    const fechaRevision = new Date();
    const [result] = await pool.query(
      `UPDATE solicitudes_pago SET estado = 'rechazada', id_aprobador = ?, comentario_aprobador = ?, fecha_revision = ? WHERE id_solicitud IN (${ids.map(() => '?').join(',')}) AND estado = 'pendiente'`,
      [id_aprobador, comentario_aprobador, fechaRevision, ...ids]
    );

    if (result.affectedRows > 0) {
      // Obtener detalles de las solicitudes rechazadas
      const [solicitudes] = await pool.query(
        `SELECT s.id_solicitud, s.id_usuario AS idSolicitante, us.email AS emailSolic, us.nombre AS nombreSolic,
                s.departamento, s.monto, s.cuenta_destino, s.concepto, s.tipo_pago, s.fecha_limite_pago, s.factura_url
         FROM solicitudes_pago s
         JOIN usuarios us ON us.id_usuario = s.id_usuario
         WHERE s.id_solicitud IN (${ids.map(() => '?').join(',')})`,
        [...ids]
      );
      const [adminRows] = await pool.query("SELECT email, nombre FROM usuarios WHERE rol = 'admin_general'");
      const url = 'https://bechapra.com.mx';
      const { enviarCorreo } = require('../services/correoService');
      for (const s of solicitudes) {
        const detallesSolicitud = `
          <b>ID:</b> ${s.id_solicitud}<br>
          <b>Departamento:</b> ${s.departamento}<br>
          <b>Monto:</b> $${s.monto}<br>
          <b>Cuenta destino:</b> ${s.cuenta_destino}<br>
          <b>Concepto:</b> ${s.concepto}<br>
          <b>Tipo de pago:</b> ${s.tipo_pago || '-'}<br>
          <b>Fecha límite de pago:</b> ${s.fecha_limite_pago || '-'}<br>
          ${s.factura_url ? `<b>Factura adjunta:</b> ${s.factura_url}<br>` : ''}
          ${comentario_aprobador ? `<b>Comentario del aprobador:</b> ${comentario_aprobador}<br>` : ''}
        `;
        // Correo al admin
        if (adminRows.length > 0) {
          const admin = adminRows[0];
          await enviarCorreo({
            para: admin.email,
            asunto: 'Solicitud rechazada (lote)',
            nombre: admin.nombre,
            link: url,
            mensaje: `El aprobador ID ${id_aprobador} ha <b>rechazado</b> la siguiente solicitud:<br>${detallesSolicitud}`
          });
        }
        // Correo al solicitante
        if (s.emailSolic) {
          await enviarCorreo({
            para: s.emailSolic,
            asunto: 'Tu solicitud ha sido rechazada (lote)',
            nombre: s.nombreSolic,
            link: url,
            mensaje: `Tu solicitud fue <b>rechazada</b>.<br>${detallesSolicitud}`
          });
        }
        // Notificaciones in-app
        await NotificacionService.crearNotificacion({
          id_usuario: s.idSolicitante,
          mensaje: "❌ Tu solicitud fue rechazada.",
          correo: s.emailSolic,
        });
        // Aprobador (su propio historial)
        const [aprobador] = await pool.query("SELECT email, nombre FROM usuarios WHERE id_usuario = ?", [id_aprobador]);
        await NotificacionService.crearNotificacion({
          id_usuario: id_aprobador,
          mensaje: `❌ Rechazaste la solicitud (ID: ${s.id_solicitud}) correctamente (lote).`,
          correo: aprobador[0]?.email
        });
      }
      return res.json({ success: true, message: `Se rechazaron ${result.affectedRows} solicitudes.` });
    } else {
      return res.status(404).json({ error: "No se rechazó ninguna solicitud (verifica estado)." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al rechazar solicitudes en lote" });
  }
};