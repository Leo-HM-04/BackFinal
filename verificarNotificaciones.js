const pool = require('./db/connection');

async function verNotificacionesPagador() {
  try {
    console.log('🔍 Consultando notificaciones para usuarios pagador_banca...');
    
    // Obtener pagadores
    const [pagadores] = await pool.query("SELECT id_usuario, nombre, email FROM usuarios WHERE rol = 'pagador_banca'");
    console.log('👥 Pagadores encontrados:', pagadores);
    
    for (const pagador of pagadores) {
      console.log(`\n📋 Notificaciones para ${pagador.nombre} (ID: ${pagador.id_usuario}):`);
      
      const [notificaciones] = await pool.query(
        "SELECT id_notificacion, mensaje, leida, fecha_creacion FROM notificaciones WHERE id_usuario = ? ORDER BY fecha_creacion DESC LIMIT 10",
        [pagador.id_usuario]
      );
      
      if (notificaciones.length === 0) {
        console.log('   ❌ No hay notificaciones');
      } else {
        notificaciones.forEach((notif, index) => {
          console.log(`   ${index + 1}. ${notif.leida ? '✅' : '🔔'} ${notif.mensaje}`);
          console.log(`      📅 ${notif.fecha_creacion}`);
        });
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verNotificacionesPagador();
