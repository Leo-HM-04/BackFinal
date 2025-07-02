/* ──────────────────────────────────────────────────────────────
   Controlador de Plantillas Recurrentes
   Con notificaciones (BD + WS + correo) – Flujo acordado
   ────────────────────────────────────────────────────────────── */

const RecurrenteModel      = require("../models/recurrente.model");
const SolicitudModel       = require("../models/solicitud.model"); // Para historial
const NotificacionService  = require("../services/notificacionesService");
const pool                 = require("../db/connection");

/* ────────────── Crear plantilla recurrente ────────────── */
exports.crearRecurrente = async (req, res) => {
  try {
    const { id_usuario } = req.user;
    const {
      departamento, monto, cuenta_destino,
      concepto, tipo_pago, frecuencia, siguiente_fecha,
    } = req.body;

    if (!departamento || !monto || !cuenta_destino || !concepto ||
        !tipo_pago || !frecuencia || !siguiente_fecha) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    await RecurrenteModel.crearRecurrente({
      id_usuario, departamento, monto, cuenta_destino,
      concepto, tipo_pago, frecuencia, siguiente_fecha,
    });

    /* 🔔 Aprobadores */
    const [aprobadores] = await pool.query(
      "SELECT id_usuario, email FROM usuarios WHERE rol = 'aprobador'"
    );
    for (const ap of aprobadores) {
      await NotificacionService.crearNotificacion({
        id_usuario: ap.id_usuario,
        mensaje: "📋 Nueva plantilla recurrente pendiente de aprobación.",
        correo: ap.email,
      });
    }

    res.status(201).json({ message: "Plantilla recurrente creada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la plantilla recurrente" });
  }
};

/* ────────────── Obtener plantillas del usuario ────────────── */
exports.obtenerRecurrentes = async (req, res) => {
  try {
    const { id_usuario } = req.user;
    const recurrentes = await RecurrenteModel.obtenerRecurrentesPorUsuario(id_usuario);
    res.json(recurrentes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las plantillas recurrentes" });
  }
};

/* ────────────── Obtener plantillas pendientes ────────────── */
exports.obtenerPendientes = async (_req, res) => {
  try {
    const pendientes = await RecurrenteModel.obtenerPendientes();
    res.json(pendientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las plantillas pendientes" });
  }
};

/* ────────────── Aprobar plantilla ────────────── */
exports.aprobarRecurrente = async (req, res) => {
  try {
    const { id } = req.params;

    await RecurrenteModel.aprobarRecurrente(id);

    /* Datos del solicitante */
    const [sol] = await pool.query(
      `SELECT r.id_usuario, u.email
       FROM pagos_recurrentes r
       JOIN usuarios u ON u.id_usuario = r.id_usuario
       WHERE r.id_recurrente = ?`,
      [id]
    );

    if (sol.length) {
      const { id_usuario, email } = sol[0];

      /* 🔔 Solicitante */
      await NotificacionService.crearNotificacion({
        id_usuario,
        mensaje: "✅ Tu plantilla recurrente fue aprobada.",
        correo: email,
      });
    }

    /* 🔔 Pagadores */
    const [pagadores] = await pool.query(
      "SELECT id_usuario, email FROM usuarios WHERE rol = 'pagador_banca'"
    );
    for (const pg of pagadores) {
      await NotificacionService.crearNotificacion({
        id_usuario: pg.id_usuario,
        mensaje: "📝 Nueva plantilla recurrente aprobada: solicitudes futuras listas para pago.",
        correo: pg.email,
      });
    }

    res.json({ message: "Plantilla aprobada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al aprobar la plantilla" });
  }
};

/* ────────────── Rechazar plantilla ────────────── */
exports.rechazarRecurrente = async (req, res) => {
  try {
    const { id } = req.params;

    await RecurrenteModel.rechazarRecurrente(id);

    // 🔔 Notificar al solicitante solamente
    const [sol] = await pool.query(
      `SELECT r.id_usuario, u.email
       FROM pagos_recurrentes r
       JOIN usuarios u ON u.id_usuario = r.id_usuario
       WHERE r.id_recurrente = ?`,
      [id]
    );

    if (sol.length) {
      const { id_usuario, email } = sol[0];

      await NotificacionService.crearNotificacion({
        id_usuario,
        mensaje: "❌ Tu plantilla recurrente fue rechazada.",
        correo: email,
      });
    }

    res.json({ message: "Plantilla rechazada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al rechazar la plantilla" });
  }
};


/* ────────────── Eliminar plantilla ────────────── */
exports.eliminarRecurrente = async (req, res) => {
  try {
    const { id } = req.params;
    await RecurrenteModel.eliminarRecurrente(id);
    res.json({ message: "Plantilla recurrente eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la plantilla recurrente" });
  }
};

/* ────────────── Editar plantilla (si está pendiente) ────────────── */
exports.editarRecurrente = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, email } = req.user;
    const {
      departamento, monto, cuenta_destino,
      concepto, tipo_pago, frecuencia, siguiente_fecha,
    } = req.body;

    if (!departamento || !monto || !cuenta_destino || !concepto ||
        !tipo_pago || !frecuencia || !siguiente_fecha) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const filas = await RecurrenteModel.editarRecurrenteSiPendiente(id, id_usuario, {
      departamento, monto, cuenta_destino,
      concepto, tipo_pago, frecuencia, siguiente_fecha,
    });

    if (filas === 0) {
      return res.status(403).json({
        error: "No puedes editar esta plantilla. Asegúrate de que te pertenece y esté pendiente.",
      });
    }

    await NotificacionService.crearNotificacion({
      id_usuario,
      mensaje: "✏️ Tu plantilla recurrente fue actualizada.",
      correo: email,
    });

    res.json({ message: "Plantilla recurrente actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar la plantilla recurrente" });
  }
};

/* ────────────── Historial de ejecuciones ────────────── */
exports.obtenerHistorial = async (req, res) => {
  try {
    const { rol, id_usuario } = req.user;
    const { id } = req.params;

    let historial = [];
    if (rol === "admin_general") {
      historial = await RecurrenteModel.obtenerHistorialCompleto();
    } else if (id) {
      historial = await SolicitudModel.getPorRecurrente(id);
    } else {
      historial = await RecurrenteModel.obtenerHistorialPorUsuario(id_usuario);
    }

    res.json(historial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener historial de ejecuciones" });
  }
};
