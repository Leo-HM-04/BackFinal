const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'plataforma_solicitudes_pago'
};

async function testFechas() {
  let connection;
  
  try {
    console.log('🔄 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado a la base de datos');

    // Obtener algunas solicitudes recientes
    console.log('\n📋 Verificando fechas de solicitudes recientes:');
    const [rows] = await connection.execute(
      'SELECT id_solicitud, fecha_creacion, fecha_limite_pago, departamento FROM solicitudes_pago ORDER BY fecha_creacion DESC LIMIT 5'
    );

    if (rows.length === 0) {
      console.log('❌ No se encontraron solicitudes');
      return;
    }

    rows.forEach((row, index) => {
      console.log(`\n--- Solicitud ${index + 1} (ID: ${row.id_solicitud}) ---`);
      console.log(`   Departamento: ${row.departamento}`);
      console.log(`   Fecha creación: ${row.fecha_creacion}`);
      console.log(`   Fecha límite pago: ${row.fecha_limite_pago}`);
      
      // Análisis de fechas
      const fechaCreacion = new Date(row.fecha_creacion);
      const fechaLimite = new Date(row.fecha_limite_pago);
      
      console.log(`   Fecha creación (parsed): ${fechaCreacion.toLocaleDateString('es-MX')}`);
      console.log(`   Fecha límite (parsed): ${fechaLimite.toLocaleDateString('es-MX')}`);
      
      // Diferencia en días
      const diffTime = fechaLimite.getTime() - fechaCreacion.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log(`   Diferencia: ${diffDays} días`);
    });

    // Probar inserción de fecha actual
    console.log('\n🧪 Probando inserción de fecha actual...');
    const today = new Date();
    const fechaLocal = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    console.log(`   Fecha actual (sistema): ${today.toLocaleDateString('es-MX')}`);
    console.log(`   Fecha para enviar: ${fechaLocal}`);
    
    // Simular cómo MySQL interpreta la fecha
    const fechaMySQL = new Date(fechaLocal);
    console.log(`   Fecha interpretada por MySQL: ${fechaMySQL.toLocaleDateString('es-MX')}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔄 Conexión cerrada');
    }
  }
}

// Ejecutar la prueba
testFechas();
