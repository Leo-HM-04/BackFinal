const pool = require("../db/connection");

// Crear una nueva plantilla de pago recurrente
exports.crearRecurrente = async (datos) => {
  const {
    id_usuario,
    departamento,
    monto,
    cuenta_destino,
    concepto,
    tipo_pago,
    frecuencia,
    siguiente_fecha
  } = datos;

  await pool.query(`
    INSERT INTO pagos_recurrentes 
    (id_usuario, departamento, monto, cuenta_destino, concepto, tipo_pago, frecuencia, siguiente_fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_usuario, departamento, monto, cuenta_destino, concepto, tipo_pago, frecuencia, siguiente_fecha]
  );
};

// Obtener todas las plantillas activas del usuario
exports.obtenerRecurrentesPorUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    `SELECT * FROM pagos_recurrentes WHERE id_usuario = ? AND activo = 1`,
    [id_usuario]
  );
  return rows;
};

// 🔎 Obtener plantillas pendientes (para los aprobadores)
exports.obtenerPendientes = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM pagos_recurrentes WHERE estado = 'pendiente'`
  );
  return rows;
};

// ✅ Aprobar plantilla
exports.aprobarRecurrente = async (id_recurrente) => {
  await pool.query(
    `UPDATE pagos_recurrentes SET estado = 'aprobada' WHERE id_recurrente = ?`,
    [id_recurrente]
  );
};

// ❌ Rechazar plantilla
exports.rechazarRecurrente = async (id_recurrente) => {
  await pool.query(
    `UPDATE pagos_recurrentes SET estado = 'rechazada' WHERE id_recurrente = ?`,
    [id_recurrente]
  );
};


// 🗑️ Eliminar plantilla recurrente por ID
exports.eliminarRecurrente = async (id_recurrente) => {
  await pool.query(
    `DELETE FROM pagos_recurrentes WHERE id_recurrente = ?`,
    [id_recurrente]
  );
};
