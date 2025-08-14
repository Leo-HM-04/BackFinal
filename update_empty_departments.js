const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateEmptyDepartments() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'srv1505.hstgr.io',
    user: process.env.DB_USER || 'u995420991_undbechapra',
    password: process.env.DB_PASSWORD || '19042004Leo',
    database: process.env.DB_NAME || 'u995420991_plataformaPago',
  });

  try {
    console.log('🔧 Actualizando registros con departamento vacío...\n');
    
    // Actualizar todos los registros con folios AT- y departamento vacío a "atraccion de talento"
    const [result] = await pool.query(`
      UPDATE solicitudes_pago 
      SET departamento = 'atraccion de talento' 
      WHERE folio LIKE 'AT-%' AND (departamento = '' OR departamento IS NULL)
    `);
    
    console.log(`✅ Actualizados ${result.affectedRows} registros a "atraccion de talento"`);
    
    // Verificar los cambios
    console.log('\n🔍 Verificando cambios...');
    const [updated] = await pool.query(`
      SELECT id_solicitud, departamento, folio 
      FROM solicitudes_pago 
      WHERE folio LIKE 'AT-%' 
      ORDER BY id_solicitud
    `);
    
    console.log('Registros con folio AT- después de la actualización:');
    updated.forEach(record => {
      console.log(`   ID: ${record.id_solicitud}, Folio: ${record.folio}, Dept: ${record.departamento}`);
    });
    
    // Verificar si quedan registros con departamento vacío
    const [remaining] = await pool.query(`
      SELECT id_solicitud, departamento, folio 
      FROM solicitudes_pago 
      WHERE departamento = '' OR departamento IS NULL
    `);
    
    if (remaining.length > 0) {
      console.log(`\n⚠️  Aún quedan ${remaining.length} registros con departamento vacío:`);
      remaining.forEach(record => {
        console.log(`   ID: ${record.id_solicitud}, Folio: ${record.folio}`);
      });
    } else {
      console.log('\n✅ Todos los registros tienen departamento asignado.');
    }
    
  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar actualización
updateEmptyDepartments();
