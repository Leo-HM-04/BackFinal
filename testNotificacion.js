const { crearNotificacion } = require('./services/notificacionesService');

(async () => {
  // Cambia el id_usuario por uno que exista en tu base de datos
  const id_usuario = 1; // Ejemplo: 1
  await crearNotificacion({
    id_usuario,
    mensaje: 'Prueba de notificación por correo para cualquier rol',
    enviarCorreo: true
  });
  console.log('✅ Notificación enviada. Verifica el correo del usuario en la base de datos.');
})();

