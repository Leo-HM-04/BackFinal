// Script para añadir específicamente la columna com_recurrente a la tabla pagos_recurrentes
const pool = require('./db/connection');

async function addComRecurrenteColumn() {
  console.log('🔧 Añadiendo columna com_recurrente a la tabla pagos_recurrentes...');
  
  try {
    // Verificar si la columna ya existe
    const [checkResult] = await pool.query(`
      SELECT COUNT(*) AS column_exists
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'pagos_recurrentes'
      AND COLUMN_NAME = 'com_recurrente'
    `);
    
    const columnExists = checkResult[0].column_exists > 0;
    
    if (columnExists) {
      console.log('✅ La columna com_recurrente ya existe en la tabla pagos_recurrentes.');
    } else {
      // Añadir la columna si no existe
      await pool.query(`
        ALTER TABLE pagos_recurrentes
        ADD COLUMN com_recurrente VARCHAR(255) NULL AFTER fact_recurrente
      `);
      console.log('✅ La columna com_recurrente ha sido añadida a la tabla pagos_recurrentes.');
    }

    console.log('✅ Operación completada.');
  } catch (error) {
    console.error('❌ Error al añadir la columna com_recurrente:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await pool.end();
  }
}

// Ejecutar la función
addComRecurrenteColumn();
