const RecurrenteModel = require("../models/recurrente.model");

// Crear una nueva plantilla de pago recurrente
exports.crearRecurrente = async (req, res) => {
  try {
    const { id_usuario } = req.user;
    const {
      departamento,
      monto,
      cuenta_destino,
      concepto,
      tipo_pago,
      frecuencia,
      siguiente_fecha,
    } = req.body;

    if (!departamento || !monto || !cuenta_destino || !concepto || !tipo_pago || !frecuencia || !siguiente_fecha) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    await RecurrenteModel.crearRecurrente({
      id_usuario,
      departamento,
      monto,
      cuenta_destino,
      concepto,
      tipo_pago,
      frecuencia,
      siguiente_fecha,
    });

    res.status(201).json({ message: "Plantilla de pago recurrente creada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la plantilla recurrente" });
  }
};

// Obtener plantillas recurrentes del usuario autenticado
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

// 🔎 Obtener plantillas pendientes (solo aprobadores)
exports.obtenerPendientes = async (req, res) => {
  try {
    const pendientes = await RecurrenteModel.obtenerPendientes();
    res.json(pendientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las plantillas pendientes" });
  }
};

// ✅ Aprobar plantilla
exports.aprobarRecurrente = async (req, res) => {
  try {
    const { id } = req.params;
    await RecurrenteModel.aprobarRecurrente(id);
    res.json({ message: "Plantilla aprobada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al aprobar la plantilla" });
  }
};

// ❌ Rechazar plantilla
exports.rechazarRecurrente = async (req, res) => {
  try {
    const { id } = req.params;
    await RecurrenteModel.rechazarRecurrente(id);
    res.json({ message: "Plantilla rechazada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al rechazar la plantilla" });
  }
};


// 🗑️ Eliminar plantilla recurrente
exports.eliminarRecurrente = async (req, res) => {
  const { id } = req.params;
  try {
    await RecurrenteModel.eliminarRecurrente(id);
    res.json({ message: "Plantilla recurrente eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la plantilla recurrente" });
  }
};

// ✏️ Editar plantilla recurrente (solo si es del usuario y está pendiente)
exports.editarRecurrente = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.user;
    const {
      departamento,
      monto,
      cuenta_destino,
      concepto,
      tipo_pago,
      frecuencia,
      siguiente_fecha,
    } = req.body;

    if (!departamento || !monto || !cuenta_destino || !concepto || !tipo_pago || !frecuencia || !siguiente_fecha) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const filas = await RecurrenteModel.editarRecurrenteSiPendiente(id, id_usuario, {
      departamento,
      monto,
      cuenta_destino,
      concepto,
      tipo_pago,
      frecuencia,
      siguiente_fecha,
    });

    if (filas === 0) {
      return res.status(403).json({ error: "No puedes editar esta plantilla. Asegúrate de que te pertenece y esté pendiente." });
    }

    res.json({ message: "Plantilla recurrente actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al editar la plantilla recurrente" });
  }
};


// 📜 Obtener historial de ejecuciones (rol admin_general ve todo, los demás solo lo suyo)
exports.obtenerHistorial = async (req, res) => {
  try {
    const { rol, id_usuario } = req.user;

    let historial = [];

    if (rol === "admin_general") {
      historial = await RecurrenteModel.obtenerHistorialCompleto(); // Ver todo
    } else {
      historial = await RecurrenteModel.obtenerHistorialPorUsuario(id_usuario); // Solo lo suyo
    }

    res.json(historial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener historial de ejecuciones" });
  }
};


const SolicitudModel = require("../models/solicitud.model");

exports.obtenerHistorial = async (req, res) => {
  const { id } = req.params;

  try {
    const historial = await SolicitudModel.getPorRecurrente(id);
    res.json(historial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el historial de ejecuciones" });
  }
};


