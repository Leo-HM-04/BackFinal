// Script para vaciar todas las tablas principales de la base de datos.
// ¡Úsalo solo en desarrollo/test! No en producción.
const mysql = require('mysql2/promise');

async function resetDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'plataforma_solicitudes_pago',
    multipleStatements: true
  });

  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    const tablas = [
      'comprobantes_pago',
      'ejecuciones_recurrentes',
      'notificaciones',
      'pagos_recurrentes',
      'solicitudes_pago',
      'usuarios'
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

resetDatabase();
