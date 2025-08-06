// Script para añadir las columnas faltantes a las tablas
const pool = require('./db/connection');

async function updateDatabaseStructure() {
  console.log('🔧 Verificando y actualizando estructura de las tablas...');
  
  try {
    // Verificar y actualizar la estructura ENUM para el estado de pagos_recurrentes
    try {
      console.log('🔄 Actualizando ENUM para estado en tabla pagos_recurrentes...');
      await pool.query(`
        ALTER TABLE pagos_recurrentes 
        MODIFY COLUMN estado ENUM('pendiente', 'aprobada', 'rechazada', 'pagada') NOT NULL;
      `);
      console.log('✅ Campo ENUM estado en pagos_recurrentes actualizado correctamente.');
    } catch (err) {
      console.error('❌ Error al modificar ENUM estado en pagos_recurrentes:', err.message);
    }
    
    // Estructura de columnas para las tablas
    const tablesToUpdate = {
      'solicitudes_pago': [
        { name: 'tipo_pago_descripcion', type: 'VARCHAR(100) NULL', after: 'tipo_pago' },
        { name: 'empresa_a_pagar', type: 'VARCHAR(100) NULL', after: 'tipo_pago_descripcion' },
        { name: 'nombre_persona', type: 'VARCHAR(100) NULL', after: 'empresa_a_pagar' },
        { name: 'tipo_cuenta_destino', type: 'VARCHAR(50) NULL', after: 'folio' },
        { name: 'tipo_tarjeta', type: 'VARCHAR(50) NULL', after: 'tipo_cuenta_destino' },
        { name: 'banco_destino', type: 'VARCHAR(50) NULL', after: 'tipo_tarjeta' },
        { name: 'fecha_pago', type: 'DATETIME NULL', after: 'id_pagador' },
        { name: 'id_pagador', type: 'INT NULL', after: 'id_aprobador' },
        { name: 'id_aprobador', type: 'INT NULL', after: 'estado' }
      ],
      'solicitudes_viaticos': [
        { name: 'tipo_pago_descripcion', type: 'VARCHAR(100) NULL', after: 'tipo_pago' },
        { name: 'empresa_a_pagar', type: 'VARCHAR(100) NULL', after: 'tipo_pago_descripcion' },
        { name: 'nombre_persona', type: 'VARCHAR(100) NULL', after: 'empresa_a_pagar' },
        { name: 'tipo_cuenta_destino', type: 'VARCHAR(50) NULL', after: 'folio' },
        { name: 'tipo_tarjeta', type: 'VARCHAR(50) NULL', after: 'tipo_cuenta_destino' },
        { name: 'banco_destino', type: 'VARCHAR(50) NULL', after: 'tipo_tarjeta' },
        { name: 'fecha_pago', type: 'DATETIME NULL', after: 'id_pagador' },
        { name: 'id_pagador', type: 'INT NULL', after: 'id_aprobador' },
        { name: 'id_aprobador', type: 'INT NULL', after: 'estado' }
      ],
      'pagos_recurrentes': [
        { name: 'tipo_pago_descripcion', type: 'VARCHAR(100) NULL', after: 'tipo_pago' },
        { name: 'empresa_a_pagar', type: 'VARCHAR(100) NULL', after: 'tipo_pago_descripcion' },
        { name: 'nombre_persona', type: 'VARCHAR(100) NULL', after: 'empresa_a_pagar' },
        { name: 'tipo_cuenta_destino', type: 'VARCHAR(50) NULL', after: 'frecuencia' },
        { name: 'tipo_tarjeta', type: 'VARCHAR(50) NULL', after: 'tipo_cuenta_destino' },
        { name: 'banco_destino', type: 'VARCHAR(50) NULL', after: 'tipo_tarjeta' },
        { name: 'com_recurrente', type: 'VARCHAR(255) NULL', after: 'fact_recurrente' },
        { name: 'fecha_pago', type: 'DATETIME NULL', after: 'id_pagador' },
        { name: 'id_pagador', type: 'INT NULL', after: 'id_aprobador' },
        { name: 'id_aprobador', type: 'INT NULL', after: 'estado' }
      ]
    };
    
    // Recorrer cada tabla y sus columnas
    for (const [tableName, columnsToCheck] of Object.entries(tablesToUpdate)) {
      console.log(`🔍 Verificando tabla ${tableName}...`);
      
      // Verificar y añadir cada columna
      for (const column of columnsToCheck) {
        // Verificar si la columna ya existe
        const [checkResult] = await pool.query(`
          SELECT COUNT(*) AS column_exists
          FROM information_schema.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND COLUMN_NAME = ?
        `, [tableName, column.name]);
        
        const columnExists = checkResult[0].column_exists > 0;
        
        if (columnExists) {
          console.log(`✅ La columna ${column.name} ya existe en la tabla ${tableName}.`);
        } else {
          try {
            // Añadir la columna si no existe
            await pool.query(`
              ALTER TABLE ${tableName} 
              ADD COLUMN ${column.name} ${column.type} AFTER ${column.after}
            `);
            console.log(`✅ La columna ${column.name} ha sido añadida a la tabla ${tableName}.`);
          } catch (err) {
            console.error(`❌ Error al añadir la columna ${column.name} a la tabla ${tableName}:`, err.message);
            // Si hay un error con la referencia 'after', intentar añadir al final
            try {
              await pool.query(`
                ALTER TABLE ${tableName} 
                ADD COLUMN ${column.name} ${column.type}
              `);
              console.log(`✅ La columna ${column.name} ha sido añadida al final de la tabla ${tableName}.`);
            } catch (finalError) {
              console.error(`❌ No se pudo añadir la columna ${column.name} a la tabla ${tableName}:`, finalError.message);
            }
          }
        }
      }
    }
    
    // Mostrar un resumen de las tablas verificadas
    console.log('\n🔍 Resumen de actualizaciones:');
    for (const tableName of Object.keys(tablesToUpdate)) {
      console.log(`✅ Tabla ${tableName}: estructura verificada y actualizada`);
    }
    
    console.log('\n✅ La estructura de la base de datos ha sido actualizada correctamente.');
    console.log('🚀 Ya puedes continuar con el siguiente paso: node resetDatabase.js');
  } catch (error) {
    console.error('❌ Error general al actualizar la estructura de la base de datos:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await pool.end();
  }
}

// Ejecutar la función
updateDatabaseStructure();
