const pool = require("../db/connection");

// Crear una nueva plantilla de pago recurrente con validaciones
exports.crearRecurrente = async (datos) => {
  const {
    id_usuario,
    departamento,
    monto,
    cuenta_destino,
    concepto,
    tipo_pago,
    frecuencia,
    siguiente_fecha,
    fact_recurrente = null
  } = datos;

  // Validaciones adicionales
  let frecuenciaNormalizada = frecuencia;
  if (frecuencia === 'diaria') frecuenciaNormalizada = 'diario';
  if (!['diario', 'semanal', 'quincenal', 'mensual'].includes(frecuenciaNormalizada)) {
    throw new Error('Frecuencia inválida');
  }
  if (!departamento || !monto || !cuenta_destino || !concepto || !tipo_pago || !siguiente_fecha) {
    throw new Error('Faltan datos obligatorios');
  }
  if (isNaN(monto) || monto <= 0) {
    throw new Error('Monto inválido');
  }
  const fechaHoy = new Date();
  const fechaSiguiente = new Date(siguiente_fecha);
  if (fechaSiguiente < fechaHoy) {
    throw new Error('La siguiente fecha debe ser igual o mayor a hoy');
  }

  await pool.query(`
    INSERT INTO pagos_recurrentes 
    (id_usuario, departamento, monto, cuenta_destino, concepto, tipo_pago, frecuencia, siguiente_fecha, estado, fact_recurrente)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)`,
    [id_usuario, departamento, monto, cuenta_destino, concepto, tipo_pago, frecuenciaNormalizada, siguiente_fecha, fact_recurrente]
  );

};


// Obtener todas las plantillas activas del usuario
exports.obtenerRecurrentesPorUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.nombre AS nombre_usuario
     FROM pagos_recurrentes r
     JOIN usuarios u ON r.id_usuario = u.id_usuario
     WHERE r.id_usuario = ?`,
    [id_usuario]
  );
  return rows;
};

// Obtener todas las plantillas (solo admin_general)
exports.obtenerTodas = async () => {
  const [rows] = await pool.query(
    `SELECT r.*, u.nombre AS nombre_usuario
     FROM pagos_recurrentes r
     JOIN usuarios u ON r.id_usuario = u.id_usuario`
  );
  return rows;
};

// Pausar o reactivar plantilla recurrente

exports.cambiarEstadoActivo = async (id_recurrente, activo) => {
  console.log('MODELO cambiarEstadoActivo:', { id_recurrente, activo });
  await pool.query(`UPDATE pagos_recurrentes SET activo = ? WHERE id_recurrente = ?`, [activo ? 1 : 0, id_recurrente]);
  // Devuelve el registro actualizado
  const [rows] = await pool.query('SELECT * FROM pagos_recurrentes WHERE id_recurrente = ?', [id_recurrente]);
  return rows[0];
};


// 🔎 Obtener plantillas pendientes (para los aprobadores)
exports.obtenerPendientes = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM pagos_recurrentes WHERE estado = 'pendiente'`
  );
  return rows;
};

// ✅ Aprobar plantilla
exports.aprobarRecurrente = async (id_recurrente, id_aprobador) => {
  await pool.query(
    `UPDATE pagos_recurrentes SET estado = 'aprobada', id_aprobador = ?, fecha_revision = NOW() WHERE id_recurrente = ?`,
    [id_aprobador, id_recurrente]
  );
};

// ❌ Rechazar plantilla
exports.rechazarRecurrente = async (id_recurrente, id_aprobador, comentario_aprobador) => {
  await pool.query(
    `UPDATE pagos_recurrentes SET estado = 'rechazada', id_aprobador = ?, comentario_aprobador = ?, fecha_revision = NOW() WHERE id_recurrente = ?`,
    [id_aprobador, comentario_aprobador, id_recurrente]
  );
};


// 🗑️ Eliminar plantilla recurrente por ID
exports.eliminarRecurrente = async (id_recurrente) => {
  await pool.query(
    `DELETE FROM pagos_recurrentes WHERE id_recurrente = ?`,
    [id_recurrente]
  );
};



// ✏️ Editar plantilla recurrente (solo si es del usuario y está pendiente)
exports.editarRecurrenteSiPendiente = async (id_recurrente, id_usuario, datos) => {
  const {
    departamento,
    monto,
    cuenta_destino,
    concepto,
    tipo_pago,
    frecuencia,
    siguiente_fecha,
    fact_recurrente
  } = datos;

  // Validaciones adicionales
  let frecuenciaNormalizada = frecuencia;
  if (frecuencia === 'diaria') frecuenciaNormalizada = 'diario';
  if (!['diario', 'semanal', 'quincenal', 'mensual'].includes(frecuenciaNormalizada)) {
    throw new Error('Frecuencia inválida');
  }
  if (!departamento || !monto || !cuenta_destino || !concepto || !tipo_pago || !siguiente_fecha) {
    throw new Error('Faltan datos obligatorios');
  }
  if (isNaN(monto) || monto <= 0) {
    throw new Error('Monto inválido');
  }
  const fechaHoy = new Date();
  const fechaSiguiente = new Date(siguiente_fecha);
  if (fechaSiguiente < fechaHoy) {
    throw new Error('La siguiente fecha debe ser igual o mayor a hoy');
  }

  let query = `UPDATE pagos_recurrentes 
     SET departamento = ?, monto = ?, cuenta_destino = ?, concepto = ?, tipo_pago = ?, frecuencia = ?, siguiente_fecha = ?`;
  let params = [
    departamento,
    monto,
    cuenta_destino,
    concepto,
    tipo_pago,
    frecuenciaNormalizada,
    siguiente_fecha
  ];
  if (fact_recurrente) {
    query += ', fact_recurrente = ?';
    params.push(fact_recurrente);
  }
  query += ' WHERE id_recurrente = ? AND id_usuario = ? AND estado = "pendiente"';
  params.push(id_recurrente, id_usuario);
  const [result] = await pool.query(query, params);


  return result.affectedRows;
};


// 📜 Obtener historial completo (admin_general)
exports.obtenerHistorialCompleto = async () => {
  const [rows] = await pool.query(
    'SELECT r.*, u.nombre AS nombre_usuario, a.nombre AS nombre_aprobador, p.nombre AS nombre_pagador ' +
    'FROM pagos_recurrentes r ' +
    'JOIN usuarios u ON r.id_usuario = u.id_usuario ' +
    'LEFT JOIN usuarios a ON r.id_aprobador = a.id_usuario ' +
    'LEFT JOIN usuarios p ON r.id_pagador = p.id_usuario'
  );
  return rows;
};

// 📜 Obtener historial por usuario
exports.obtenerHistorialPorUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    'SELECT h.*, r.concepto, r.frecuencia, r.id_usuario, u.nombre AS nombre_usuario, a.nombre AS nombre_aprobador, p.nombre AS nombre_pagador ' +
    'FROM historial_recurrentes h ' +
    'JOIN pagos_recurrentes r ON h.id_recurrente = r.id_recurrente ' +
    'JOIN usuarios u ON r.id_usuario = u.id_usuario ' +
    'LEFT JOIN usuarios a ON r.id_aprobador = a.id_usuario ' +
    'LEFT JOIN usuarios p ON r.id_pagador = p.id_usuario ' +
    'WHERE r.id_usuario = ? ' +
    'ORDER BY h.fecha_ejecucion DESC',
    [id_usuario]
  );
  return rows;
};

// Obtener una plantilla recurrente por id
exports.getPorId = async (id_recurrente) => {
  const [rows] = await pool.query("SELECT * FROM pagos_recurrentes WHERE id_recurrente = ?", [id_recurrente]);
  return rows[0];
};
// Subir factura recurrente
exports.subirFacturaRecurrente = async (id_recurrente, fact_recurrente) => {
  await pool.query(
    `UPDATE pagos_recurrentes SET fact_recurrente = ? WHERE id_recurrente = ?`,
    [fact_recurrente, id_recurrente]
  );
};
