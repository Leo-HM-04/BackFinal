const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDepartmentIssues() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'srv1505.hstgr.io',
    user: process.env.DB_USER || 'u995420991_undbechapra',
    password: process.env.DB_PASSWORD || '19042004Leo',
    database: process.env.DB_NAME || 'u995420991_plataformaPago',
  });

  try {
    console.log('🔍 Verificando estructura de la base de datos...\n');
    
    // 1. Verificar estructura de la tabla solicitudes_pago
    console.log('📋 Estructura de tabla solicitudes_pago:');
    const [structure] = await pool.query('DESCRIBE solicitudes_pago');
    const departamentoField = structure.find(field => field.Field === 'departamento');
    console.log(`   Campo departamento: ${departamentoField ? 'EXISTS' : 'MISSING'}`);
    if (departamentoField) {
      console.log(`   Tipo: ${departamentoField.Type}`);
      console.log(`   Nulo: ${departamentoField.Null}`);
    }
    
    // 2. Verificar registros con departamento "atraccion de talento"
    console.log('\n🎯 Verificando registros con "atraccion de talento":');
    const [atraccionRecords] = await pool.query(
      "SELECT id_solicitud, departamento, folio FROM solicitudes_pago WHERE departamento = 'atraccion de talento'"
    );
    console.log(`   Encontrados: ${atraccionRecords.length} registros`);
    if (atraccionRecords.length > 0) {
      console.log('   Registros:');
      atraccionRecords.forEach(record => {
        console.log(`     ID: ${record.id_solicitud}, Folio: ${record.folio}, Dept: ${record.departamento}`);
      });
    }
    
    // 3. Verificar registros con departamento "automatizaciones"
    console.log('\n🤖 Verificando registros con "automatizaciones":');
    const [autoRecords] = await pool.query(
      "SELECT id_solicitud, departamento, folio FROM solicitudes_pago WHERE departamento = 'automatizaciones'"
    );
    console.log(`   Encontrados: ${autoRecords.length} registros`);
    if (autoRecords.length > 0) {
      console.log('   Registros:');
      autoRecords.forEach(record => {
        console.log(`     ID: ${record.id_solicitud}, Folio: ${record.folio}, Dept: ${record.departamento}`);
      });
    }
    
    // 4. Verificar todos los departamentos únicos en la base de datos
    console.log('\n📊 Departamentos únicos en la base de datos:');
    const [departments] = await pool.query(
      "SELECT DISTINCT departamento, COUNT(*) as count FROM solicitudes_pago GROUP BY departamento ORDER BY departamento"
    );
    departments.forEach(dept => {
      console.log(`   ${dept.departamento}: ${dept.count} solicitudes`);
    });
    
    // 5. Verificar folios con "AT-" (ambigüedad entre automatizaciones y atraccion de talento)
    console.log('\n🏷️  Verificando folios con "AT-":');
    const [atFolios] = await pool.query(
      "SELECT id_solicitud, departamento, folio FROM solicitudes_pago WHERE folio LIKE 'AT-%' ORDER BY id_solicitud"
    );
    console.log(`   Encontrados: ${atFolios.length} folios AT-`);
    if (atFolios.length > 0) {
      console.log('   Folios AT-:');
      atFolios.forEach(record => {
        console.log(`     ${record.folio} (ID: ${record.id_solicitud}) - Dept: ${record.departamento}`);
      });
    }
    
    // 6. Verificar problemas de zona horaria en fechas
    console.log('\n🕐 Verificando fechas para detectar problemas de zona horaria:');
    const [dateIssues] = await pool.query(`
      SELECT id_solicitud, fecha_creacion, fecha_limite_pago 
      FROM solicitudes_pago 
      WHERE DATE(fecha_creacion) != DATE(fecha_limite_pago) 
        AND fecha_limite_pago IS NOT NULL 
      ORDER BY id_solicitud DESC 
      LIMIT 5
    `);
    console.log(`   Registros con fechas diferentes: ${dateIssues.length}`);
    if (dateIssues.length > 0) {
      dateIssues.forEach(record => {
        console.log(`     ID: ${record.id_solicitud}`);
        console.log(`       Creación: ${record.fecha_creacion}`);
        console.log(`       Límite: ${record.fecha_limite_pago}`);
      });
    }
    
    console.log('\n✅ Verificación completada.');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar verificación
checkDepartmentIssues();
