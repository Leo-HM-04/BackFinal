const { enviarCorreo } = require('./services/correoService');

async function probarCorreo() {
  console.log('🧪 Iniciando prueba de envío de correo...');
  
  try {
    const resultado = await enviarCorreo({
      para: 'automatizaciones@bechapra.com.mx', // Enviar a ti mismo para probar
      asunto: 'Prueba de configuración SMTP',
      nombre: 'Usuario de Prueba',
      link: 'https://bechapra.com.mx',
      mensaje: 'Esta es una prueba para verificar que el servicio de correo funciona correctamente.'
    });
    
    if (resultado.success) {
      console.log('✅ Prueba exitosa! El correo se envió correctamente.');
      console.log('📧 ID del mensaje:', resultado.messageId);
    } else {
      console.log('❌ La prueba falló:', resultado.error);
    }
  } catch (error) {
    console.error('💥 Error durante la prueba:', error);
  }
  
  process.exit(0);
}

probarCorreo();
