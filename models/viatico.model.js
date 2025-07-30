const pool = require("../db/connection");

exports.getTodas = async () => {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre AS usuario_nombre
    FROM solicitudes_viaticos v
    JOIN usuarios u ON v.id_usuario = u.id_usuario
  `);
  return rows;
};

exports.getPorUsuario = async (id_usuario) => {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre AS usuario_nombre
    FROM solicitudes_viaticos v
    JOIN usuarios u ON v.id_usuario = u.id_usuario
    WHERE v.id_usuario = ?
  `, [id_usuario]);
  return rows;
};

exports.getAutorizadas = async () => {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre AS usuario_nombre, a.nombre AS aprobador_nombre
    FROM solicitudes_viaticos v
    JOIN usuarios u ON v.id_usuario = u.id_usuario
    LEFT JOIN usuarios a ON v.id_aprobador = a.id_usuario
    WHERE v.estado = 'autorizada'
  `);
  return rows;
};

exports.getPorId = async (id_viatico) => {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre AS usuario_nombre
    FROM solicitudes_viaticos v
    JOIN usuarios u ON v.id_usuario = u.id_usuario
    WHERE v.id_viatico = ?
  `, [id_viatico]);
  return rows[0];
};

exports.crear = async (datos) => {
  // --- Generar folio automático igual que solicitudes ---
  const {
    id_usuario,
    departamento,
    monto,
    cuenta_destino,
    viatico_url,
    concepto,
    tipo_pago,
    fecha_limite_pago,
    tipo_cuenta_destino,
    tipo_tarjeta,
    banco_destino
  } = datos;

  // Mapeo de abreviaturas igual que solicitudes
  const abreviaturas = {
    'contabilidad': 'CT',
    'facturacion': 'FC',
    'cobranza': 'CB',
    'vinculacion': 'VN',
    'administracion': 'AD',
    'ti': 'TI',
    'automatizaciones': 'AT',
    'comercial': 'CM',
    'atencion a clientes': 'AC',
    'tesoreria': 'TS',
    'nomina': 'NM'
  };
  const abrev = abreviaturas[departamento?.toLowerCase?.()] || 'XX';

  // Buscar el último folio para el departamento
  const [rows] = await pool.query(
    `SELECT folio FROM solicitudes_viaticos WHERE folio LIKE ? ORDER BY id_viatico DESC LIMIT 1`,
    [`${abrev}-%`]
  );
  let numero = 1;
  if (rows.length > 0 && rows[0].folio) {
    const partes = rows[0].folio.split('-');
    if (partes.length === 2 && !isNaN(parseInt(partes[1]))) {
      numero = parseInt(partes[1]) + 1;
    }
  }
  const folio = `${abrev}-${numero.toString().padStart(4, '0')}`;

  // Insertar el viático con folio
  const [result] = await pool.query(
    `INSERT INTO solicitudes_viaticos 
      (id_usuario, departamento, monto, cuenta_destino, viatico_url, concepto, tipo_pago, fecha_limite_pago, tipo_cuenta_destino, tipo_tarjeta, banco_destino, folio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_usuario, departamento, monto, cuenta_destino, viatico_url, concepto, tipo_pago, fecha_limite_pago, tipo_cuenta_destino, tipo_tarjeta, banco_destino, folio]
  );
  return { id_viatico: result.insertId, ...datos, folio };
};


// Editar un viático si es del usuario y está pendiente, o si es admin_general
exports.editarViaticoSiPendiente = async (id_viatico, id_usuario, datos, esAdminGeneral = false) => {
  let query, params;
  // Obtener el estado, usuario actual y departamento actual del viático
  const [viaticoRows] = await pool.query('SELECT estado, id_usuario, departamento FROM solicitudes_viaticos WHERE id_viatico = ?', [id_viatico]);
  if (!viaticoRows.length) return 0;
  const viatico = viaticoRows[0];
  if (!esAdminGeneral) {
    if (viatico.id_usuario !== id_usuario) return 0;
    if (String(viatico.estado).toLowerCase() !== 'pendiente') return 0;
  }
  // Solo permitir actualizar campos válidos
  const camposPermitidos = [
    'departamento','monto','cuenta_destino','concepto','tipo_pago','fecha_limite_pago',
    'tipo_cuenta_destino','tipo_tarjeta','banco_destino','viatico_url'
  ];
  const setFields = [];
  const setParams = [];

  // Detectar si el departamento cambió
  let nuevoDepartamento = datos.departamento !== undefined ? datos.departamento : viatico.departamento;
  let actualizarFolio = false;
  if (datos.departamento !== undefined && datos.departamento !== viatico.departamento) {
    actualizarFolio = true;
  }

  // Si el departamento cambió, generar nuevo folio único para el nuevo departamento
  let nuevoFolio = null;
  if (actualizarFolio) {
    const abreviaturas = {
      'contabilidad': 'CT',
      'facturacion': 'FC',
      'cobranza': 'CB',
      'vinculacion': 'VN',
      'administracion': 'AD',
      'ti': 'TI',
      'automatizaciones': 'AT',
      'comercial': 'CM',
      'atencion a clientes': 'AC',
      'tesoreria': 'TS',
      'nomina': 'NM'
    };
    const abrev = abreviaturas[nuevoDepartamento?.toLowerCase?.()] || 'XX';
    const [rows] = await pool.query(
      `SELECT folio FROM solicitudes_viaticos WHERE folio LIKE ? ORDER BY id_viatico DESC LIMIT 1`,
      [`${abrev}-%`]
    );
    let numero = 1;
    if (rows.length > 0 && rows[0].folio) {
      const partes = rows[0].folio.split('-');
      if (partes.length === 2 && !isNaN(parseInt(partes[1]))) {
        numero = parseInt(partes[1]) + 1;
      }
    }
    nuevoFolio = `${abrev}-${numero.toString().padStart(4, '0')}`;
    setFields.push(`folio = ?`);
    setParams.push(nuevoFolio);
  }

  for (const campo of camposPermitidos) {
    if (datos[campo] !== undefined) {
      setFields.push(`${campo} = ?`);
      setParams.push(datos[campo]);
    }
  }
  if (!setFields.length) return 0;
  if (esAdminGeneral) {
    query = `UPDATE solicitudes_viaticos SET ${setFields.join(', ')} WHERE id_viatico = ?`;
    setParams.push(id_viatico);
  } else {
    query = `UPDATE solicitudes_viaticos SET ${setFields.join(', ')} WHERE id_viatico = ? AND id_usuario = ? AND estado = 'pendiente'`;
    setParams.push(id_viatico, id_usuario);
  }
  const [result] = await pool.query(query, setParams);
  return result.affectedRows;
};

exports.eliminar = async (id_viatico) => {
  await pool.query(
    `DELETE FROM solicitudes_viaticos WHERE id_viatico = ?`,
    [id_viatico]
  );
};
