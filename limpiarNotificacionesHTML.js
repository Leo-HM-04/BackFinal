const pool = require('./db/connection');

async function limpiarNotificacionesHTML() {
  try {
    console.log('🧹 Limpiando etiquetas HTML de notificaciones existentes...');
    
    // Buscar todas las notificaciones con etiquetas HTML
    const [notificaciones] = await pool.query(
      "SELECT id_notificacion, mensaje FROM notificaciones WHERE mensaje LIKE '%<b>%' OR mensaje LIKE '%</b>%'"
    );
    
    console.log(`📋 Encontradas ${notificaciones.length} notificaciones con etiquetas HTML`);
    
    let actualizadas = 0;
    
    for (const notif of notificaciones) {
      // Limpiar las etiquetas HTML
      let mensajeLimpio = notif.mensaje
        .replace(/<b>/g, '')
        .replace(/<\/b>/g, '')
        .replace(/<br>/g, '\n')
        .replace(/<br\/>/g, '\n');
      
      // Actualizar en la base de datos
      await pool.query(
        "UPDATE notificaciones SET mensaje = ? WHERE id_notificacion = ?",
        [mensajeLimpio, notif.id_notificacion]
      );
      
      actualizadas++;
      console.log(`✓ Actualizada notificación ${notif.id_notificacion}`);
    }
    
    console.log(`✅ Se actualizaron ${actualizadas} notificaciones`);
    
    // Verificar que ya no hay etiquetas HTML
    const [verificacion] = await pool.query(
      "SELECT COUNT(*) as total FROM notificaciones WHERE mensaje LIKE '%<b>%' OR mensaje LIKE '%</b>%'"
    );
    
    if (verificacion[0].total === 0) {
      console.log('🎉 ¡Todas las notificaciones están limpias de etiquetas HTML!');
    } else {
      console.log(`⚠️ Aún quedan ${verificacion[0].total} notificaciones con etiquetas HTML`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

limpiarNotificacionesHTML();
