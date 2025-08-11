const NotificacionService = require('./services/notificacionesService');
const pool = require('./db/connection');

async function crearNotificacionPruebaPagador() {
  try {
    console.log('🧪 Creando notificación de prueba para pagador...');
    
    // Obtener un pagador
    const [pagadores] = await pool.query("SELECT id_usuario, nombre, email FROM usuarios WHERE rol = 'pagador_banca' LIMIT 1");
    
    if (pagadores.length === 0) {
      console.log('❌ No se encontraron usuarios con rol pagador_banca');
      return;
    }
    
    const pagador = pagadores[0];
    console.log(`👤 Pagador encontrado: ${pagador.nombre} (ID: ${pagador.id_usuario})`);
    
    // Crear una notificación de prueba
    await NotificacionService.crearNotificacion({
      id_usuario: pagador.id_usuario,
      mensaje: `🎯 PRUEBA: Nueva solicitud autorizada para pago: <b>Juan Pérez</b> por <b>$5,000</b> (autorizada por <b>María González</b>)`,
      correo: pagador.email,
    });
    
    console.log('✅ Notificación de prueba creada exitosamente');
    
    // Verificar que se creó
    const [notificaciones] = await pool.query(
      "SELECT mensaje, fecha_creacion FROM notificaciones WHERE id_usuario = ? ORDER BY fecha_creacion DESC LIMIT 1",
      [pagador.id_usuario]
    );
    
    if (notificaciones.length > 0) {
      console.log('📋 Última notificación creada:');
      console.log(`   Mensaje: ${notificaciones[0].mensaje}`);
      console.log(`   Fecha: ${notificaciones[0].fecha_creacion}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

crearNotificacionPruebaPagador();
