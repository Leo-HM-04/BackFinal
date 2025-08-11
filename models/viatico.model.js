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

exports.getPagados = async () => {
  const [rows] = await pool.query(`
    SELECT v.*, u.nombre AS usuario_nombre, a.nombre AS aprobador_nombre, p.nombre AS pagador_nombre
    FROM solicitudes_viaticos v
    JOIN usuarios u ON v.id_usuario = u.id_usuario
    LEFT JOIN usuarios a ON v.id_aprobador = a.id_usuario
    LEFT JOIN usuarios p ON v.id_pagador = p.id_usuario
    WHERE v.estado = 'pagada'
    ORDER BY v.fecha_pago DESC
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
  // Extraer variables del objeto datos para validación
  const {
    tipo_cuenta_destino,
    cuenta_destino,
    tipo_tarjeta
  } = datos;
  // Validar formato según tipo de cuenta destino
  if (tipo_cuenta_destino === 'CLABE') {
    if (!/^[0-9]{18}$/.test(cuenta_destino)) {
      throw new Error('La cuenta CLABE debe tener 18 dígitos numéricos');
    }
  } else if (tipo_cuenta_destino === 'Tarjeta') {
    if (tipo_tarjeta === 'Cuenta') {
      // Solo numérico, mínimo 6 dígitos, sin máximo
      if (!/^[0-9]{6,}$/.test(cuenta_destino)) {
        throw new Error('El número de cuenta debe tener al menos 6 dígitos numéricos');
      }
    } else {
      // Débito o Crédito: exactamente 16 dígitos
      if (!/^[0-9]{16}$/.test(cuenta_destino)) {
        throw new Error('La tarjeta debe tener 16 dígitos numéricos');
      }
    }
  }
  // --- Generar folio automático igual que solicitudes ---
  // Eliminar redeclaración de variables ya extraídas arriba
  const {
    id_usuario,
    departamento,
    monto,
    viatico_url,
    concepto,
    tipo_pago,
    fecha_limite_pago,
    banco_destino,
    tipo_pago_descripcion,
    empresa_a_pagar,
    nombre_persona
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
      (id_usuario, departamento, monto, cuenta_destino, viatico_url, concepto, tipo_pago, fecha_limite_pago, tipo_cuenta_destino, tipo_tarjeta, banco_destino, folio, tipo_pago_descripcion, empresa_a_pagar, nombre_persona)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_usuario, departamento, monto, cuenta_destino, viatico_url, concepto, tipo_pago, fecha_limite_pago, tipo_cuenta_destino, tipo_tarjeta, banco_destino, folio, tipo_pago_descripcion, empresa_a_pagar, nombre_persona]
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
    'tipo_cuenta_destino','tipo_tarjeta','banco_destino','viatico_url','tipo_pago_descripcion',
    'empresa_a_pagar','nombre_persona'
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

// Aprobar o rechazar viático individual (solo por rol aprobador o admin_general)
exports.actualizarEstado = async (id_viatico, estado, comentario_aprobador, id_aprobador) => {
  const campos = [
    'autorizada',
    'rechazada'
  ];
  if (!campos.includes(estado)) return 0;
  const [result] = await pool.query(
    `UPDATE solicitudes_viaticos 
    SET estado = ?, comentario_aprobador = ?, id_aprobador = ?, fecha_revision = NOW() 
    WHERE id_viatico = ? AND estado = 'pendiente'`,
    [estado, comentario_aprobador, id_aprobador, id_viatico]
  );
  return result.affectedRows;
};

// Aprobar viáticos en lote
exports.aprobarLote = async (ids, id_aprobador, comentario_aprobador = null) => {
  if (!Array.isArray(ids) || !ids.length) return 0;
  // Si no se envía comentario, poner uno por defecto
  const comentario = comentario_aprobador && comentario_aprobador.trim() !== ''
    ? comentario_aprobador
    : 'Solicitudes aprobadas en lote';
  const [result] = await pool.query(
    `UPDATE solicitudes_viaticos 
    SET estado = 'autorizada', comentario_aprobador = ?, id_aprobador = ?, fecha_revision = NOW() 
    WHERE id_viatico IN (?) AND estado = 'pendiente'`,
    [comentario, id_aprobador, ids]
  );
  return result.affectedRows;
};

// Rechazar viáticos en lote
exports.rechazarLote = async (ids, id_aprobador, comentario_aprobador = null) => {
  if (!Array.isArray(ids) || !ids.length) return 0;
  // Si no se envía comentario, poner uno por defecto
  const comentario = comentario_aprobador && comentario_aprobador.trim() !== ''
    ? comentario_aprobador
    : 'Solicitudes rechazadas en lote';
  const [result] = await pool.query(
    `UPDATE solicitudes_viaticos 
    SET estado = 'rechazada', comentario_aprobador = ?, id_aprobador = ?, fecha_revision = NOW() 
    WHERE id_viatico IN (?) AND estado = 'pendiente'`,
    [comentario, id_aprobador, ids]
  );
  return result.affectedRows;
};

// Marcar un viático como pagado (solo por rol pagador_banca)
exports.marcarComoPagado = async (id_viatico, id_pagador) => {
  const [result] = await pool.query(
    `UPDATE solicitudes_viaticos 
     SET estado = 'pagada', id_pagador = ?, fecha_pago = NOW()
     WHERE id_viatico = ? AND estado = 'autorizada'`,
    [id_pagador, id_viatico]
  );
  return result.affectedRows;
};