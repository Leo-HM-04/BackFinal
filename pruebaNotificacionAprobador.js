const pool = require('./db/connection');
const NotificacionService = require('./services/notificacionesService');

async function pruebaNotificacionAprobador() {
  try {
    console.log('🧪 Enviando notificación de prueba para aprobador...');
    
    // Buscar un usuario aprobador
    const [aprobadores] = await pool.query(
      "SELECT id_usuario, email, nombre FROM usuarios WHERE rol = 'aprobador' LIMIT 1"
    );
    
    if (aprobadores.length === 0) {
      console.log('❌ No se encontró ningún usuario con rol aprobador');
      return;
    }
    
    const aprobador = aprobadores[0];
    console.log(`👤 Enviando notificación a: ${aprobador.nombre} (${aprobador.email})`);
    
    // Crear notificación sin etiquetas HTML
    await NotificacionService.crearNotificacion({
      id_usuario: aprobador.id_usuario,
      mensaje: `📥 Tienes una nueva solicitud pendiente de aprobación de Test de Solicitante por $2007.`,
      correo: aprobador.email
    });
    
    console.log('✅ Notificación enviada correctamente');
    console.log('🔍 Verificando la notificación más reciente...');
    
    // Verificar la notificación en la base de datos
    const [notificaciones] = await pool.query(
      "SELECT mensaje FROM notificaciones WHERE id_usuario = ? ORDER BY id_notificacion DESC LIMIT 1",
      [aprobador.id_usuario]
    );
    
    if (notificaciones.length > 0) {
      console.log('📋 Mensaje almacenado:', notificaciones[0].mensaje);
      
      // Verificar que no contenga etiquetas HTML
      const mensaje = notificaciones[0].mensaje;
      if (mensaje.includes('<b>') || mensaje.includes('</b>')) {
        console.log('❌ ERROR: La notificación contiene etiquetas HTML');
      } else {
        console.log('✅ CORRECTO: La notificación está limpia');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

pruebaNotificacionAprobador();
