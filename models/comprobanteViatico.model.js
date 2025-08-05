const db = require('../db/connection');

const ComprobanteViatico = {
  create: async (comprobante) => {
    try {
      // Ensure all required fields have valid data
      if (!comprobante.id_viatico) {
        throw new Error('id_viatico es requerido');
      }
      if (!comprobante.archivo_url) {
        throw new Error('archivo_url es requerido');
      }
      if (!comprobante.id_usuario_subio) {
        throw new Error('id_usuario_subio es requerido');
      }

      console.log('🔍 Intentando insertar con valores:', {
        id_viatico: comprobante.id_viatico,
        archivo_url: comprobante.archivo_url,
        id_usuario_subio: comprobante.id_usuario_subio
      });

      const [result] = await db.query(
        'INSERT INTO comprobantes_viaticos (id_viatico, archivo_url, fecha_subida, id_usuario_subio) VALUES (?, ?, NOW(), ?)',
        [
          parseInt(comprobante.id_viatico, 10),
          comprobante.archivo_url,
          parseInt(comprobante.id_usuario_subio, 10)
        ]
      );
      
      console.log('✅ Resultado de inserción:', result);
      return result.insertId;
    } catch (error) {
      console.error('❌ Error en ComprobanteViatico.create:', error);
      throw error;
    }
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
