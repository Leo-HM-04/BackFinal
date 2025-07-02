const SolicitudModel = require("../models/solicitud.model");
const { enviarNotificacion } = require("../ws");
const pool = require("../db/connection");

// Obtener todas las solicitudes o solo las del usuario (según su rol)
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

// Obtener una solicitud por su ID
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

// Crear una nueva solicitud de pago
exports.createSolicitud = async (req, res) => {
  try {
    const {
      departamento,
      monto,
      cuenta_destino,
      concepto,
      tipo_pago,
      fecha_limite_pago,
    } = req.body;

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

    // 🔔 Notificar a los aprobadores
    const [aprobadores] = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE rol = 'aprobador'"
    );
    aprobadores.forEach(({ id_usuario }) => {
      enviarNotificacion(id_usuario, "📥 Nueva solicitud pendiente de aprobación.");
    });

    res.status(201).json({ message: "Solicitud creada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la solicitud" });
  }
};

// Aprobar o rechazar una solicitud (solo aprobadores)
exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, comentario_aprobador } = req.body;
    const { id_usuario: id_aprobador } = req.user;

    if (!["autorizada", "rechazada"].includes(estado)) {
      return res.status(400).json({ error: "Estado no válido." });
    }

    const filasActualizadas = await SolicitudModel.actualizarEstado(
      id,
      estado,
      comentario_aprobador,
      id_aprobador
    );

    if (filasActualizadas === 0) {
      return res.status(404).json({ error: "Solicitud no encontrada o ya actualizada." });
    }

    const [rows] = await pool.query(
      "SELECT id_usuario FROM solicitudes_pago WHERE id_solicitud = ?",
      [id]
    );

    if (rows.length) {
      const idSolicitante = rows[0].id_usuario;

      if (estado === "autorizada") {
        enviarNotificacion(idSolicitante, "✅ Tu solicitud fue autorizada.");

        // 🔔 Notificar a pagadores
        const [pagadores] = await pool.query(
          "SELECT id_usuario FROM usuarios WHERE rol = 'pagador_banca'"
        );
        pagadores.forEach(({ id_usuario }) => {
          enviarNotificacion(id_usuario, "📝 Nueva solicitud autorizada para pago.");
        });
      } else {
        enviarNotificacion(idSolicitante, "❌ Tu solicitud fue rechazada.");
      }
    }

    res.json({ message: "Estado actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la solicitud" });
  }
};

// Marcar una solicitud como pagada (solo pagador_banca)
exports.marcarComoPagada = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, id_usuario: id_pagador } = req.user;

    if (rol !== "pagador_banca") {
      return res.status(403).json({ error: "No tienes permisos para marcar la solicitud como pagada" });
    }

    const filas = await SolicitudModel.marcarComoPagada(id, id_pagador);

    if (filas === 0) {
      return res.status(404).json({ error: "No se pudo marcar como pagada." });
    }

    // 🔔 Notificar al solicitante y aprobador
    const [rows] = await pool.query(
      "SELECT id_usuario, id_aprobador FROM solicitudes_pago WHERE id_solicitud = ?",
      [id]
    );

    if (rows.length) {
      const { id_usuario: idSolicitante, id_aprobador } = rows[0];
      enviarNotificacion(idSolicitante, "💸 Tu solicitud ha sido pagada.");
      if (id_aprobador) {
        enviarNotificacion(id_aprobador, "💸 Se pagó la solicitud que aprobaste.");
      }
    }

    res.json({ message: "Solicitud marcada como pagada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al marcar la solicitud como pagada" });
  }
};

// Eliminar una solicitud (solo admin_general)
exports.deleteSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    await SolicitudModel.eliminar(id);
    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la solicitud" });
  }
};

// Editar una solicitud (solo el solicitante y si está pendiente)
exports.editarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.user;

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

    const filasActualizadas = await SolicitudModel.editarSolicitudSiPendiente(
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
      }
    );

    if (filasActualizadas === 0) {
      return res.status(400).json({
        error: "No se puede editar: La solicitud no está pendiente o no te pertenece.",
      });
    }

    res.json({ message: "Solicitud actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar la solicitud" });
  }
};
