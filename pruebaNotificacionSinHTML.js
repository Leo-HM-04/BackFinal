const pool = require('./db/connection');
const NotificacionService = require('./services/notificacionesService');

async function pruebaNotificacionSinHTML() {
  try {
    console.log('🧪 Enviando notificación de prueba sin etiquetas HTML...');
    
    // Buscar un usuario pagador para enviar la notificación
    const [pagadores] = await pool.query(
      "SELECT id_usuario, email, nombre FROM usuarios WHERE rol = 'pagador_banca' LIMIT 1"
    );
    
    if (pagadores.length === 0) {
      console.log('❌ No se encontró ningún usuario con rol pagador_banca');
      return;
    }
    
    const pagador = pagadores[0];
    console.log(`👤 Enviando notificación a: ${pagador.nombre} (${pagador.email})`);
    
    // Crear notificación sin etiquetas HTML
    await NotificacionService.crearNotificacion({
      id_usuario: pagador.id_usuario,
      mensaje: `📄 Test de Pagador subió el comprobante de pago de la solicitud de Test de Solicitante por $2006.00`,
      correo: pagador.email
    });
    
    console.log('✅ Notificación enviada correctamente sin etiquetas HTML');
    console.log('🔍 Verificando en la base de datos...');
    
    // Verificar la notificación en la base de datos
    const [notificaciones] = await pool.query(
      "SELECT mensaje FROM notificaciones WHERE id_usuario = ? ORDER BY id_notificacion DESC LIMIT 1",
      [pagador.id_usuario]
    );
    
    if (notificaciones.length > 0) {
      console.log('📋 Mensaje almacenado:', notificaciones[0].mensaje);
      
      // Verificar que no contenga etiquetas HTML
      const mensaje = notificaciones[0].mensaje;
      if (mensaje.includes('<b>') || mensaje.includes('</b>')) {
        console.log('❌ ERROR: La notificación todavía contiene etiquetas HTML');
      } else {
        console.log('✅ CORRECTO: La notificación está limpia sin etiquetas HTML');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

pruebaNotificacionSinHTML();
