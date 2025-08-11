// Script para vaciar todas las tablas principales de la base de datos.
// ¡Úsalo solo en desarrollo/test! No en producción.
const mysql = require('mysql2/promise');

async function resetDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'srv1505.hstgr.io',
    user: process.env.DB_USER || 'u995420991_undbechapra',
    password: process.env.DB_PASSWORD || '19042004Leo',
    database: process.env.DB_NAME || 'u995420991_plataformaPago',
    multipleStatements: true
  });

  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    const tablas = [
      'comprobantes_pago',
      'comprobantes_viaticos',
      'ejecuciones_recurrentes',
      'login_audit',
      'notificaciones',
      'pagos_recurrentes',
      'solicitudes_pago',
      'solicitudes_viaticos',
      'usuarios',
      'viatico_conceptos',
      'viaticos',
      'viaticos_detalle'
    ];
    for (const tabla of tablas) {
      try {
        await connection.query(`DELETE FROM ${tabla}`);
        await connection.query(`TRUNCATE TABLE ${tabla}`);
        console.log(`✅ Tabla ${tabla} vaciada`);
      } catch (err) {
        console.error(`❌ Error vaciando ${tabla}:`, err.message);
      }
    }
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Todas las tablas vaciadas (forzado)');
  } catch (err) {
    console.error('❌ Error general al vaciar tablas:', err.message);
    throw err;
  } finally {
    await connection.end();
  }
}

console.log('🚨 Iniciando proceso de restablecimiento de la base de datos...');
resetDatabase()
  .then(() => {
    console.log('✅ Base de datos restablecida exitosamente. Se han vaciado todas las tablas:');
    console.log('   - comprobantes_pago');
    console.log('   - comprobantes_viaticos');
    console.log('   - ejecuciones_recurrentes');
    console.log('   - login_audit');
    console.log('   - notificaciones');
    console.log('   - pagos_recurrentes');
    console.log('   - solicitudes_pago');
    console.log('   - solicitudes_viaticos');
    console.log('   - usuarios');
    console.log('   - viatico_conceptos');
    console.log('   - viaticos');
    console.log('   - viaticos_detalle');
    console.log('🔹 Para crear el usuario administrador, ejecuta: node crearUsuario.js');
  })
  .catch(err => {
    console.error('❌ Error al restablecer la base de datos:', err);
  });
