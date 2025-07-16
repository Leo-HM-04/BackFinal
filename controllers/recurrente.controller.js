
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

    let fact_recurrente = null;
    if (req.file) {
      fact_recurrente = `/uploads/recurrente/${req.file.filename}`;
    }
    await RecurrenteModel.crearRecurrente({
      id_usuario, departamento, monto, cuenta_destino,
      concepto, tipo_pago, frecuencia, siguiente_fecha, fact_recurrente
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
    const { id_usuario, rol } = req.user;
    let recurrentes;
    if (rol === 'admin_general') {
      recurrentes = await RecurrenteModel.obtenerTodas();
    } else {
      recurrentes = await RecurrenteModel.obtenerRecurrentesPorUsuario(id_usuario);
    }
    res.json(recurrentes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las plantillas recurrentes" });
  }
};
/* ────────────── Pausar o reactivar plantilla ────────────── */
exports.cambiarEstadoActiva = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;
    console.log('CONTROLADOR cambiarEstadoActiva:', { id, activo });
    const recurrenteActualizado = await RecurrenteModel.cambiarEstadoActivo(id, activo);
    res.json({
      message: `Plantilla ${activo ? 'reactivada' : 'pausada'} correctamente`,
      recurrente: recurrenteActualizado
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cambiar el estado de la plantilla" });
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

    let fact_recurrente = undefined;
    if (req.file) {
      fact_recurrente = `/uploads/recurrente/${req.file.filename}`;
    }
    const filas = await RecurrenteModel.editarRecurrenteSiPendiente(id, id_usuario, {
      departamento, monto, cuenta_destino,
      concepto, tipo_pago, frecuencia, siguiente_fecha,
      fact_recurrente
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

// Subir factura recurrente
exports.subirFacturaRecurrente = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, rol } = req.user;
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    // Validar dueño o admin_general
    const [rows] = await pool.query('SELECT id_usuario FROM pagos_recurrentes WHERE id_recurrente = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Plantilla no encontrada' });
    if (rol !== 'admin_general' && rows[0].id_usuario !== id_usuario) {
      return res.status(403).json({ error: 'No tienes permiso para subir la factura' });
    }

    // Guardar ruta en la BD
    const fact_recurrente = `/uploads/recurrente/${req.file.filename}`;
    await require('../models/recurrente.model').subirFacturaRecurrente(id, fact_recurrente);
    await pool.query('INSERT INTO auditoria_recurrentes (id_usuario, accion, fecha) VALUES (?, "subir_factura", NOW())', [id_usuario]);
    res.json({ message: 'Factura recurrente subida correctamente', fact_recurrente });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al subir la factura recurrente' });
  }
};

// Obtener una plantilla recurrente por id
exports.obtenerRecurrentePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, rol } = req.user;
    const recurrente = await RecurrenteModel.getPorId(id);
    if (!recurrente) return res.status(404).json({ error: "No encontrada" });
    if (rol !== "admin_general" && recurrente.id_usuario !== id_usuario) {
      return res.status(403).json({ error: "No tienes permiso" });
    }
    res.json(recurrente);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la plantilla" });
  }
};