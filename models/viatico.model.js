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
  const [result] = await pool.query(
    `INSERT INTO solicitudes_viaticos SET ?`,
    [datos]
  );
  return { id_viatico: result.insertId, ...datos };
};

exports.actualizar = async (id_viatico, datos) => {
  await pool.query(
    `UPDATE solicitudes_viaticos SET ? WHERE id_viatico = ?`,
    [datos, id_viatico]
  );
};

exports.eliminar = async (id_viatico) => {
  await pool.query(
    `DELETE FROM solicitudes_viaticos WHERE id_viatico = ?`,
    [id_viatico]
  );
};
