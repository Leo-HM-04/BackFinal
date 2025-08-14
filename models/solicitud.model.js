const pool = require("../db/connection");

exports.getTodas = async () => {
  const [rows] = await pool.query(`
    SELECT s.*, u.nombre AS usuario_nombre
    FROM solicitudes_pago s
    JOIN usuarios u ON s.id_usuario = u.id_usuario
  `);

  // Sobrescribir id_usuario con el nombre
  const resultadoTransformado = rows.map((solicitud) => {
    return {
      ...solicitud,
      id_usuario: solicitud.nombre_usuario,
    };
  });

  return resultadoTransformado;
};

// Obtener solicitudes de un usuario específico (rol solicitante)
exports.getPorUsuario = async (id_usuario) => {
  const [rows] = await pool.query(`
    SELECT s.*, u.nombre AS usuario_nombre
    FROM solicitudes_pago s
    JOIN usuarios u ON s.id_usuario = u.id_usuario
    WHERE s.id_usuario = ?
  `, [id_usuario]);
  return rows;
};

// Obtener solo solicitudes autorizadas (para pagador_banca)
exports.getAutorizadas = async () => {
  const [rows] = await pool.query(`
    SELECT s.*, u.nombre AS usuario_nombre, a.nombre AS aprobador_nombre
    FROM solicitudes_pago s
    JOIN usuarios u ON s.id_usuario = u.id_usuario
    LEFT JOIN usuarios a ON s.id_aprobador = a.id_usuario
  `);
  return rows;
};

// Obtener una sola solicitud por ID
exports.getPorId = async (id_solicitud) => {
  const [rows] = await pool.query(`
    SELECT s.*, u.nombre AS usuario_nombre
    FROM solicitudes_pago s
    JOIN usuarios u ON s.id_usuario = u.id_usuario
    WHERE s.id_solicitud = ?
  `, [id_solicitud]);
  return rows[0];
};

// Crear una nueva solicitud
exports.crear = async (datos) => {

  const {
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
    fecha_limite_pago,
    tipo_cuenta_destino,
    tipo_tarjeta,
    banco_destino
  } = datos;

  // Validar formato según tipo de cuenta destino
  if (tipo_cuenta_destino === 'CLABE') {
    if (!/^[0-9]+$/.test(cuenta_destino)) {
      throw new Error('La cuenta CLABE debe tener 18 dígitos numéricos');
    }
  } else if (tipo_cuenta_destino === 'Tarjeta') {
    // Débito o Crédito: exactamente 16 dígitos
    if (!/^[0-9]+$/.test(cuenta_destino)) {
      throw new Error('La tarjeta debe tener 16 dígitos numéricos');
    }
  } else if (tipo_cuenta_destino === 'Cuenta') {
    // Solo numérico, mínimo 6 dígitos, sin máximo
    if (!/^[0-9]+$/.test(cuenta_destino)) {
      throw new Error('El número de cuenta debe tener al menos 6 dígitos numéricos');
    }
  }

  // Mapeo de abreviaturas
  const abreviaturas = {
    'contabilidad': 'CT',
    'facturacion': 'FC',
    'cobranza': 'CB',
    'vinculacion': 'VN',
    'administracion': 'AD',
    'ti': 'TI',
    'automatizaciones': 'AU',
    'comercial': 'CM',
    'atencion a clientes': 'AC',
    'tesorería': 'TS',
    'nomina': 'NM',
    'atraccion de talento': 'AT'
  };
  const abrev = abreviaturas[departamento.toLowerCase()] || 'XX';

  // Buscar el último folio para el departamento
  const [rows] = await pool.query(
    `SELECT folio FROM solicitudes_pago WHERE folio LIKE ? ORDER BY id_solicitud DESC LIMIT 1`,
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

  await pool.query(
    `INSERT INTO solicitudes_pago 
    (id_usuario, departamento, monto, cuenta_destino, factura_url, concepto, tipo_pago, tipo_pago_descripcion, empresa_a_pagar, nombre_persona, fecha_limite_pago, folio, tipo_cuenta_destino, tipo_tarjeta, banco_destino)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_usuario, departamento, monto, cuenta_destino, factura_url, concepto, tipo_pago, tipo_pago_descripcion, empresa_a_pagar, nombre_persona, fecha_limite_pago, folio, tipo_cuenta_destino, tipo_tarjeta, banco_destino]
  );
};

// Aprobar o rechazar solicitud (solo por rol aprobador)
exports.actualizarEstado = async (id_solicitud, estado, comentario_aprobador, id_aprobador) => {
  const [result] = await pool.query(
    `UPDATE solicitudes_pago 
     SET estado = ?, comentario_aprobador = ?, id_aprobador = ?, fecha_revision = NOW() 
     WHERE id_solicitud = ?`,
    [estado, comentario_aprobador, id_aprobador, id_solicitud]
  );

  return result.affectedRows;
};

// Marcar una solicitud como pagada (solo por rol pagador_banca)
exports.marcarComoPagada = async (id_solicitud, id_pagador) => {
  const [result] = await pool.query(
    `UPDATE solicitudes_pago 
     SET estado = 'pagada', id_pagador = ?, fecha_pago = NOW()
     WHERE id_solicitud = ? AND estado = 'autorizada'`,
    [id_pagador, id_solicitud]
  );

  return result.affectedRows;
};

// Eliminar una solicitud (solo admin_general)
exports.eliminar = async (id_solicitud) => {
  await pool.query("DELETE FROM solicitudes_pago WHERE id_solicitud = ?", [id_solicitud]);
};

// Editar una solicitud si es del usuario y está pendiente, o si es admin_general
exports.editarSolicitudSiPendiente = async (id_solicitud, id_usuario, datos, esAdminGeneral = false) => {
  let query, params;
  // Obtener el departamento actual de la solicitud
  const [solicitudRows] = await pool.query('SELECT departamento FROM solicitudes_pago WHERE id_solicitud = ?', [id_solicitud]);
  const departamentoActual = solicitudRows.length > 0 ? solicitudRows[0].departamento : null;
  // Obtener valores actuales para conservar si se envía vacío
  const [actual] = await pool.query('SELECT tipo_cuenta_destino, tipo_tarjeta, banco_destino, tipo_pago_descripcion, empresa_a_pagar, nombre_persona FROM solicitudes_pago WHERE id_solicitud = ?', [id_solicitud]);
  const tipoCuentaDestino = (datos.tipo_cuenta_destino !== undefined && datos.tipo_cuenta_destino !== null && datos.tipo_cuenta_destino.trim() !== '') ? datos.tipo_cuenta_destino : actual[0]?.tipo_cuenta_destino;
  const tipoTarjeta = (datos.tipo_tarjeta !== undefined && datos.tipo_tarjeta !== null && datos.tipo_tarjeta.trim() !== '') ? datos.tipo_tarjeta : actual[0]?.tipo_tarjeta;
  const bancoDestino = (datos.banco_destino !== undefined && datos.banco_destino !== null && datos.banco_destino.trim() !== '') ? datos.banco_destino : actual[0]?.banco_destino;
  const tipoPagoDescripcion = (datos.tipo_pago_descripcion !== undefined && datos.tipo_pago_descripcion !== null && String(datos.tipo_pago_descripcion).trim() !== '') ? datos.tipo_pago_descripcion : actual[0]?.tipo_pago_descripcion;
  const empresaAPagar = (datos.empresa_a_pagar !== undefined && datos.empresa_a_pagar !== null && String(datos.empresa_a_pagar).trim() !== '') ? datos.empresa_a_pagar : actual[0]?.empresa_a_pagar;
  const nombrePersona = (datos.nombre_persona !== undefined && datos.nombre_persona !== null && String(datos.nombre_persona).trim() !== '') ? datos.nombre_persona : actual[0]?.nombre_persona;
  let setFields = [
    'departamento = ?',
    'monto = ?',
    'cuenta_destino = ?',
    'concepto = ?',
    'tipo_pago = ?',
    'tipo_pago_descripcion = ?',
    'empresa_a_pagar = ?',
    'nombre_persona = ?',
    'tipo_cuenta_destino = ?',
    'tipo_tarjeta = ?',
    'banco_destino = ?'
  ];
  let setParams = [
    datos.departamento,
    datos.monto,
    datos.cuenta_destino,
    datos.concepto,
    datos.tipo_pago,
    tipoPagoDescripcion,
    empresaAPagar,
    nombrePersona,
    tipoCuentaDestino,
    tipoTarjeta,
    bancoDestino
  ];
  // Si el departamento cambió, generar nuevo folio
  if (departamentoActual && datos.departamento && datos.departamento !== departamentoActual) {
    const abreviaturas = {
      'contabilidad': 'CT',
      'facturacion': 'FC',
      'cobranza': 'CB',
      'vinculacion': 'VN',
      'administracion': 'AD',
      'ti': 'TI',
      'automatizaciones': 'AU',
      'comercial': 'CM',
      'atencion a clientes': 'AC',
      'tesorería': 'TS',
      'nomina': 'NM',
      'atraccion de talento': 'AT'
    };
    const abrev = abreviaturas[datos.departamento.toLowerCase()] || 'XX';
    const [rows] = await pool.query(
      `SELECT folio FROM solicitudes_pago WHERE folio LIKE ? AND id_solicitud != ? ORDER BY CAST(SUBSTRING(folio, CHAR_LENGTH(?) + 2) AS UNSIGNED) DESC LIMIT 1`,
      [`${abrev}-%`, id_solicitud, abrev]
    );
    let numero = 1;
    if (rows.length > 0 && rows[0].folio) {
      const partes = rows[0].folio.split('-');
      if (partes.length === 2 && !isNaN(parseInt(partes[1]))) {
        numero = parseInt(partes[1]) + 1;
      }
    }
    const folio = `${abrev}-${numero.toString().padStart(4, '0')}`;
    setFields.push('folio = ?');
    setParams.push(folio);
  }
  if (typeof datos.factura_url === 'string' && datos.factura_url.length > 0) {
    setFields.push('factura_url = ?');
    setParams.push(datos.factura_url);
  }
  if (typeof datos.fecha_limite_pago === 'string' && datos.fecha_limite_pago.length > 0) {
    setFields.push('fecha_limite_pago = ?');
    setParams.push(datos.fecha_limite_pago);
  }
  if (esAdminGeneral) {
    query = `UPDATE solicitudes_pago SET ${setFields.join(', ')} WHERE id_solicitud = ? AND estado = 'pendiente'`;
    setParams.push(id_solicitud);
  } else {
    query = `UPDATE solicitudes_pago SET ${setFields.join(', ')} WHERE id_solicitud = ? AND id_usuario = ? AND estado = 'pendiente'`;
    setParams.push(id_solicitud, id_usuario);
  }
  const [result] = await pool.query(query, setParams);
  return result.affectedRows > 0;
};

exports.getPorRecurrente = async (id_recurrente) => {
  const [rows] = await pool.query(
    `SELECT * FROM solicitudes_pago WHERE id_recurrente_origen = ? ORDER BY fecha_creacion DESC`,
    [id_recurrente]
  );
  return rows;
};

// Eliminar una solicitud solo si es del solicitante y está pendiente
exports.eliminarSiSolicitantePendiente = async (id_solicitud, id_usuario) => {
  const [result] = await pool.query(
    "DELETE FROM solicitudes_pago WHERE id_solicitud = ? AND id_usuario = ? AND estado = 'pendiente'",
    [id_solicitud, id_usuario]
  );
  return result.affectedRows > 0;
};

// Obtener solo solicitudes pagadas
exports.getPagadas = async () => {
  const [rows] = await pool.query(`
    SELECT s.*, u.nombre AS usuario_nombre
    FROM solicitudes_pago s
    JOIN usuarios u ON s.id_usuario = u.id_usuario
    WHERE s.estado = 'pagada'
  `);
  return rows;
};

// Obtener las solicitudes autorizadas y pagadas de pagador_banca
exports.getAutorizadasYPagadas = async () => {
  const [rows] = await pool.query(`
    SELECT s.*, u.nombre AS usuario_nombre, a.nombre AS aprobador_nombre
    FROM solicitudes_pago s
    JOIN usuarios u ON s.id_usuario = u.id_usuario
    LEFT JOIN usuarios a ON s.id_aprobador = a.id_usuario
    WHERE s.estado IN ('autorizada', 'pagada')
  `);
  return rows;
}

// Rechazar solicitudes en lote (solo por rol aprobador o admin_general)
exports.rechazarLote = async (ids, id_aprobador, comentario_aprobador = null) => {
  const [result] = await pool.query(
    `UPDATE solicitudes_pago 
     SET estado = 'rechazada', comentario_aprobador = ?, id_aprobador = ?, fecha_revision = NOW() 
     WHERE id_solicitud IN (?) AND estado = 'pendiente'`,
    [comentario_aprobador, id_aprobador, ids]
  );
  return result.affectedRows;
};

// Aprobar solicitudes en lote (solo por rol aprobador o admin_general)
exports.aprobarLote = async (ids, id_aprobador, comentario_aprobador = null) => {
  const [result] = await pool.query(
    `UPDATE solicitudes_pago 
     SET estado = 'autorizada', comentario_aprobador = ?, id_aprobador = ?, fecha_revision = NOW() 
     WHERE id_solicitud IN (?) AND estado = 'pendiente'`,
    [comentario_aprobador, id_aprobador, ids]
  );
  return result.affectedRows;
};