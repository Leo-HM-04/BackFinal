const db = require('../db/connection');

const Comprobante = {
  create: async (comprobante) => {
    const [result] = await db.query(
      'INSERT INTO comprobantes_pago (id_solicitud, nombre_archivo, ruta_archivo, fecha_subida, usuario_subio, comentario) VALUES (?, ?, ?, NOW(), ?, ?)',
      [
        comprobante.id_solicitud,
        comprobante.nombre_archivo,
        comprobante.ruta_archivo,
        comprobante.usuario_subio,
        comprobante.comentario || null
      ]
    );
    return result.insertId;
  },
  findBySolicitud: async (id_solicitud) => {
    const [rows] = await db.query(
      'SELECT * FROM comprobantes_pago WHERE id_solicitud = ?',
      [id_solicitud]
    );
    return rows;
  },
  delete: async (id_comprobante) => {
    const [result] = await db.query(
      'DELETE FROM comprobantes_pago WHERE id_comprobante = ?',
      [id_comprobante]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Comprobante;
