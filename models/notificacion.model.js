
const pool = require('../db/connection');

// Notificaciones adaptado a la nueva estructura
const createNotificacion = async ({ usuario_id, rol, tipo, mensaje, leida = false, fecha, entidad, entidad_id }) => {
  await pool.query(
    'INSERT INTO notificaciones (usuario_id, rol, tipo, mensaje, leida, fecha, entidad, entidad_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [usuario_id, rol, tipo, mensaje, leida, fecha, entidad, entidad_id]
  );
};

const getNotificaciones = async (usuario_id) => {
  const [rows] = await pool.query('SELECT * FROM notificaciones WHERE usuario_id = ?', [usuario_id]);
  return rows;
};

const marcarLeida = async (id) => {
  await pool.query('UPDATE notificaciones SET leida = TRUE WHERE id = ?', [id]);
};

module.exports = { createNotificacion, getNotificaciones, marcarLeida };
