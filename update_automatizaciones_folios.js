const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateAutomatizacionesFolios() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'srv1505.hstgr.io',
    user: process.env.DB_USER || 'u995420991_undbechapra',
    password: process.env.DB_PASSWORD || '19042004Leo',
    database: process.env.DB_NAME || 'u995420991_plataformaPago',
  });

  try {
    console.log('🔧 Actualizando folios de "automatizaciones" de AT- a AU-...\n');
    
    // Obtener registros de automatizaciones que tienen folio AT-
    const [automatizacionesRecords] = await pool.query(`
      SELECT id_solicitud, folio, departamento 
      FROM solicitudes_pago 
      WHERE departamento = 'automatizaciones' AND folio LIKE 'AT-%'
      ORDER BY id_solicitud
    `);
    
    console.log(`Encontrados ${automatizacionesRecords.length} registros de automatizaciones con folio AT-:`);
    automatizacionesRecords.forEach(record => {
      console.log(`   ID: ${record.id_solicitud}, Folio: ${record.folio}`);
    });
    
    if (automatizacionesRecords.length === 0) {
      console.log('No hay registros que actualizar.');
      return;
    }
    
    // Obtener el último número de folio AU- para continuar la secuencia
    const [lastAUFolio] = await pool.query(`
      SELECT folio FROM solicitudes_pago 
      WHERE folio LIKE 'AU-%' 
      ORDER BY CAST(SUBSTRING(folio, 4) AS UNSIGNED) DESC 
      LIMIT 1
    `);
    
    let nextNumber = 1;
    if (lastAUFolio.length > 0) {
      const lastNumber = parseInt(lastAUFolio[0].folio.split('-')[1]);
      nextNumber = lastNumber + 1;
    }
    
    console.log(`\nIniciando numeración AU- desde: AU-${nextNumber.toString().padStart(4, '0')}`);
    
    // Actualizar cada registro
    for (const record of automatizacionesRecords) {
      const newFolio = `AU-${nextNumber.toString().padStart(4, '0')}`;
      
      await pool.query(`
        UPDATE solicitudes_pago 
        SET folio = ? 
        WHERE id_solicitud = ?
      `, [newFolio, record.id_solicitud]);
      
      console.log(`   ✅ ID ${record.id_solicitud}: ${record.folio} → ${newFolio}`);
      nextNumber++;
    }
    
    // Verificar los cambios
    console.log('\n🔍 Verificando cambios...');
    const [updatedRecords] = await pool.query(`
      SELECT id_solicitud, departamento, folio 
      FROM solicitudes_pago 
      WHERE departamento = 'automatizaciones' 
      ORDER BY id_solicitud
    `);
    
    console.log('Registros de automatizaciones después de la actualización:');
    updatedRecords.forEach(record => {
      console.log(`   ID: ${record.id_solicitud}, Folio: ${record.folio}, Dept: ${record.departamento}`);
    });
    
    // Verificar distribución de folios AT-
    console.log('\n📊 Distribución actual de folios AT-:');
    const [atFolioDistribution] = await pool.query(`
      SELECT departamento, COUNT(*) as count
      FROM solicitudes_pago 
      WHERE folio LIKE 'AT-%' 
      GROUP BY departamento
    `);
    
    atFolioDistribution.forEach(dist => {
      console.log(`   ${dist.departamento}: ${dist.count} folios AT-`);
    });
    
    console.log('\n✅ Actualización de folios completada.');
    
  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar actualización
updateAutomatizacionesFolios();
