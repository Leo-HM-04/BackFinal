const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixFolioConflicts() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'srv1505.hstgr.io',
    user: process.env.DB_USER || 'u995420991_undbechapra',
    password: process.env.DB_PASSWORD || '19042004Leo',
    database: process.env.DB_NAME || 'u995420991_plataformaPago',
  });

  try {
    console.log('🔧 Corrigiendo conflictos de folios...\n');
    
    // 1. Verificar folios AT- actuales y sus departamentos
    const [atFolios] = await pool.query(`
      SELECT id_solicitud, folio, departamento 
      FROM solicitudes_pago 
      WHERE folio LIKE 'AT-%' 
      ORDER BY CAST(SUBSTRING(folio, 4) AS UNSIGNED) ASC
    `);
    
    console.log('📋 Estado actual de folios AT-:');
    atFolios.forEach(record => {
      console.log(`   ${record.folio} (ID: ${record.id_solicitud}) - ${record.departamento}`);
    });
    
    // 2. Encontrar duplicados o conflictos
    const folioMap = {};
    const conflicts = [];
    
    atFolios.forEach(record => {
      if (folioMap[record.folio]) {
        conflicts.push({
          folio: record.folio,
          existing: folioMap[record.folio],
          duplicate: record
        });
      } else {
        folioMap[record.folio] = record;
      }
    });
    
    if (conflicts.length > 0) {
      console.log('\n⚠️  Folios duplicados encontrados:');
      conflicts.forEach(conflict => {
        console.log(`   ${conflict.folio}:`);
        console.log(`     - ID ${conflict.existing.id_solicitud} (${conflict.existing.departamento})`);
        console.log(`     - ID ${conflict.duplicate.id_solicitud} (${conflict.duplicate.departamento})`);
      });
    }
    
    // 3. Reorganizar folios para que sean secuenciales por departamento
    const atraccionFolios = atFolios.filter(r => r.departamento === 'atraccion de talento');
    const otherATFolios = atFolios.filter(r => r.departamento !== 'atraccion de talento');
    
    console.log('\n🎯 Folios de Atracción de Talento:', atraccionFolios.length);
    console.log('🤖 Otros folios AT-:', otherATFolios.length);
    
    if (otherATFolios.length > 0) {
      console.log('\n❌ ERROR: Hay folios AT- que no son de "atraccion de talento":');
      otherATFolios.forEach(record => {
        console.log(`   ${record.folio} (ID: ${record.id_solicitud}) - ${record.departamento}`);
      });
      console.log('\nEstos registros necesitan ser investigados manualmente.');
    }
    
    // 4. Encontrar el próximo número disponible para AT-
    let maxNumber = 0;
    atraccionFolios.forEach(record => {
      const number = parseInt(record.folio.split('-')[1]);
      if (number > maxNumber) {
        maxNumber = number;
      }
    });
    
    const nextATNumber = maxNumber + 1;
    console.log(`\n📊 Próximo folio AT- disponible: AT-${nextATNumber.toString().padStart(4, '0')}`);
    
    // 5. Verificar folios AU- para automatizaciones
    const [auFolios] = await pool.query(`
      SELECT id_solicitud, folio, departamento 
      FROM solicitudes_pago 
      WHERE folio LIKE 'AU-%' 
      ORDER BY CAST(SUBSTRING(folio, 4) AS UNSIGNED) ASC
    `);
    
    console.log('\n🔧 Folios AU- para automatizaciones:');
    auFolios.forEach(record => {
      console.log(`   ${record.folio} (ID: ${record.id_solicitud}) - ${record.departamento}`);
    });
    
    let maxAUNumber = 0;
    auFolios.forEach(record => {
      const number = parseInt(record.folio.split('-')[1]);
      if (number > maxAUNumber) {
        maxAUNumber = number;
      }
    });
    
    const nextAUNumber = maxAUNumber + 1;
    console.log(`📊 Próximo folio AU- disponible: AU-${nextAUNumber.toString().padStart(4, '0')}`);
    
    console.log('\n✅ Análisis de folios completado.');
    console.log('\n📋 Resumen:');
    console.log(`   - Folios AT- para "atraccion de talento": ${atraccionFolios.length}`);
    console.log(`   - Folios AU- para "automatizaciones": ${auFolios.length}`);
    console.log(`   - Próximo AT-: AT-${nextATNumber.toString().padStart(4, '0')}`);
    console.log(`   - Próximo AU-: AU-${nextAUNumber.toString().padStart(4, '0')}`);
    
  } catch (error) {
    console.error('❌ Error durante el análisis:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar análisis
fixFolioConflicts();
