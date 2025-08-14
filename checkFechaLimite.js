const mysql = require('mysql2/promise');

async function checkFechaLimite() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'plataforma_solicitudes_pago'
  });

  try {
    // 1. Verificar estructura del campo
    const [structure] = await pool.query('DESCRIBE solicitudes_pago');
    const fechaField = structure.find(r => r.Field === 'fecha_limite_pago');
    console.log('=== ESTRUCTURA DEL CAMPO ===');
    console.log('Campo fecha_limite_pago:', fechaField);

    // 2. Verificar las últimas solicitudes
    console.log('\n=== ÚLTIMAS SOLICITUDES ===');
    const [solicitudes] = await pool.query(`
      SELECT id_solicitud, fecha_creacion, fecha_limite_pago, departamento 
      FROM solicitudes_pago 
      ORDER BY fecha_creacion DESC 
      LIMIT 5
    `);

    solicitudes.forEach(row => {
      console.log(`ID: ${row.id_solicitud}`);
      console.log(`   Fecha creación: ${row.fecha_creacion}`);
      console.log(`   Fecha límite: ${row.fecha_limite_pago}`);
      console.log(`   Departamento: ${row.departamento}`);
      
      if (row.fecha_limite_pago) {
        const fechaCreacion = new Date(row.fecha_creacion);
        const fechaLimite = new Date(row.fecha_limite_pago);
        
        console.log(`   Fecha creación JS: ${fechaCreacion.toISOString()}`);
        console.log(`   Fecha límite JS: ${fechaLimite.toISOString()}`);
        
        const diffDays = Math.floor((fechaLimite - fechaCreacion) / (1000 * 60 * 60 * 24));
        console.log(`   Diferencia en días: ${diffDays}`);
      }
      console.log('---');
    });

    // 3. Simular una inserción para ver qué pasa
    console.log('\n=== SIMULACIÓN DE INSERCIÓN ===');
    const fechaEjemplo = '2025-08-16';
    console.log(`Fecha que se insertaría: ${fechaEjemplo}`);
    
    // Crear fecha como en el frontend
    const fechaJS = new Date(fechaEjemplo);
    console.log(`Fecha JS (new Date): ${fechaJS.toISOString()}`);
    console.log(`Fecha JS toString: ${fechaJS.toString()}`);
    console.log(`Fecha JS toLocaleDateString: ${fechaJS.toLocaleDateString()}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkFechaLimite();
