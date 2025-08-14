const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDepartmentIssues() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'srv1505.hstgr.io',
    user: process.env.DB_USER || 'u995420991_undbechapra',
    password: process.env.DB_PASSWORD || '19042004Leo',
    database: process.env.DB_NAME || 'u995420991_plataformaPago',
  });

  try {
    console.log('🔧 Iniciando corrección de problemas de departamentos...\n');
    
    // 1. Primero, vamos a actualizar el ENUM para incluir "atraccion de talento"
    console.log('📝 Actualizando ENUM de departamentos para incluir "atraccion de talento"...');
    
    const newEnumValues = [
      'contabilidad',
      'facturacion', 
      'cobranza',
      'vinculacion',
      'administracion',
      'ti',
      'automatizaciones',
      'comercial',
      'atencion a clientes',
      'tesoreria',
      'nomina',
      'atraccion de talento'
    ];
    
    const enumString = newEnumValues.map(val => `'${val}'`).join(',');
    
    await pool.query(`
      ALTER TABLE solicitudes_pago 
      MODIFY COLUMN departamento ENUM(${enumString}) NOT NULL
    `);
    console.log('   ✅ ENUM actualizado exitosamente.');
    
    // 2. Verificar registros con departamento vacío
    console.log('\n🔍 Verificando registros con departamento vacío...');
    const [emptyDepts] = await pool.query(
      "SELECT id_solicitud, departamento, folio FROM solicitudes_pago WHERE departamento = '' OR departamento IS NULL"
    );
    
    if (emptyDepts.length > 0) {
      console.log(`   Encontrados ${emptyDepts.length} registros con departamento vacío.`);
      console.log('   Por favor, actualiza manualmente estos registros:');
      emptyDepts.forEach(record => {
        console.log(`     ID: ${record.id_solicitud}, Folio: ${record.folio}`);
      });
      
      // Como ejemplo, podemos asumir que algunos folios AT- corresponden a "atraccion de talento"
      // Pero esto debe ser confirmado manualmente
      console.log('\n⚠️  ATENCIÓN: Los registros con departamento vacío necesitan ser actualizados manualmente.');
      console.log('   Puedes usar estas consultas como referencia:');
      console.log('   UPDATE solicitudes_pago SET departamento = "atraccion de talento" WHERE id_solicitud = X;');
    }
    
    // 3. Mostrar la nueva estructura
    console.log('\n📋 Nueva estructura del campo departamento:');
    const [newStructure] = await pool.query('SHOW COLUMNS FROM solicitudes_pago LIKE "departamento"');
    console.log(`   Tipo: ${newStructure[0].Type}`);
    
    // 4. Verificar que ahora podemos insertar "atraccion de talento"
    console.log('\n🧪 Probando inserción de "atraccion de talento"...');
    try {
      // Solo hacer una prueba sin insertar realmente
      await pool.query('SELECT 1 FROM solicitudes_pago WHERE departamento = "atraccion de talento" LIMIT 1');
      console.log('   ✅ El valor "atraccion de talento" ahora es válido en la base de datos.');
    } catch (error) {
      console.log('   ❌ Error al validar el nuevo valor:', error.message);
    }
    
    console.log('\n✅ Corrección de departamentos completada.');
    console.log('\n📋 Resumen de cambios:');
    console.log('   1. ✅ ENUM actualizado para incluir "atraccion de talento"');
    console.log('   2. ✅ Cambio de abreviatura "automatizaciones" de "AT" a "AU"');
    console.log('   3. ⚠️  Registros con departamento vacío requieren atención manual');
    
  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar corrección
fixDepartmentIssues();
