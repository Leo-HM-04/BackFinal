const db = require('../db/connection');

const ComprobanteViatico = {
  create: async (comprobante) => {
    const [result] = await db.query(
      'INSERT INTO comprobantes_viaticos (id_viatico, archivo_url, fecha_subida, id_usuario_subio) VALUES (?, ?, NOW(), ?)',
      [
        comprobante.id_viatico,
        comprobante.archivo_url,
        comprobante.id_usuario_subio
      ]
    );
    return result.insertId;
  },
  findByViatico: async (id_viatico) => {
    const [rows] = await db.query(
      'SELECT * FROM comprobantes_viaticos WHERE id_viatico = ?',
      [id_viatico]
    );
    return rows;
  },
  delete: async (id_comprobante) => {
    const [result] = await db.query(
      'DELETE FROM comprobantes_viaticos WHERE id_comprobante = ?',
      [id_comprobante]
    );
    return result.affectedRows > 0;
  }
};

module.exports = ComprobanteViatico;
