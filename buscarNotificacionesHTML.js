const pool = require('./db/connection');

async function buscarNotificacionesConHTML() {
  try {
    console.log('🔍 Buscando notificaciones con etiquetas HTML en la base de datos...');
    
    const [notificaciones] = await pool.query(
      "SELECT id_notificacion, id_usuario, mensaje, fecha_creacion FROM notificaciones WHERE mensaje LIKE '%<b>%' ORDER BY fecha_creacion DESC LIMIT 10"
    );
    
    if (notificaciones.length === 0) {
      console.log('✅ No se encontraron notificaciones con etiquetas HTML');
    } else {
      console.log(`❌ Se encontraron ${notificaciones.length} notificaciones con etiquetas HTML:`);
      
      for (const notif of notificaciones) {
        console.log(`\n📋 ID: ${notif.id_notificacion} | Usuario: ${notif.id_usuario} | Fecha: ${notif.fecha_creacion}`);
        console.log(`📝 Mensaje: ${notif.mensaje}`);
        console.log('---');
      }
    }
    
    // También buscar por usuarios específicos (aprobadores)
    console.log('\n🔍 Buscando notificaciones de aprobadores...');
    const [aprobadorNotifs] = await pool.query(`
      SELECT n.id_notificacion, n.id_usuario, n.mensaje, n.fecha_creacion, u.nombre, u.rol 
      FROM notificaciones n 
      JOIN usuarios u ON n.id_usuario = u.id_usuario 
      WHERE u.rol = 'aprobador' AND n.mensaje LIKE '%<b>%' 
      ORDER BY n.fecha_creacion DESC LIMIT 5
    `);
    
    if (aprobadorNotifs.length > 0) {
      console.log(`📥 Notificaciones de aprobadores con HTML (${aprobadorNotifs.length}):`);
      for (const notif of aprobadorNotifs) {
        console.log(`\n👤 ${notif.nombre} (${notif.rol})`);
        console.log(`📝 ${notif.mensaje}`);
      }
    } else {
      console.log('✅ No hay notificaciones de aprobadores con etiquetas HTML');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

buscarNotificacionesConHTML();
