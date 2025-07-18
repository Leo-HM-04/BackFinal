
const pool = require('../db/connection');

// Auditoría adaptada a la nueva estructura
const createAuditoria = async ({ usuario_id, rol, accion, entidad, entidad_id, fecha, detalles }) => {
  await pool.query(
    'INSERT INTO auditoria (usuario_id, rol, accion, entidad, entidad_id, fecha, detalles) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [usuario_id, rol, accion, entidad, entidad_id, fecha, detalles]
  );
};

const getAuditoria = async (filtro = {}) => {
  let query = 'SELECT * FROM auditoria WHERE 1=1';
  let params = [];
  if (filtro.usuario_id) {
    query += ' AND usuario_id = ?';
    params.push(filtro.usuario_id);
  }
  if (filtro.rol) {
    query += ' AND rol = ?';
    params.push(filtro.rol);
  }
  if (filtro.entidad) {
    query += ' AND entidad = ?';
    params.push(filtro.entidad);
  }
  if (filtro.tipo) {
    query += ' AND tipo = ?';
    params.push(filtro.tipo);
  }
  const [rows] = await pool.query(query, params);
  return rows;
};

module.exports = { createAuditoria, getAuditoria };
