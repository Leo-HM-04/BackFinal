const pool = require("../db/connection");
const correoService = require("./correoService");
const ws = require("../ws"); // aún no lo creamos, pero lo harás después

// Crear notificación y (opcionalmente) enviarla por WebSocket y correo
exports.crearNotificacion = async ({
  id_usuario,
  mensaje,
  enviarWebSocket = false,
  enviarCorreo = false,
  correo = null
}) => {
  try {
    // Log de depuración para ver qué se intenta guardar
    console.log('[Notificaciones] Insertando:', { id_usuario, mensaje });
    // 1. Guardar en la base de datos (leida en false, fecha_creacion automática)
    await pool.query(
      "INSERT INTO notificaciones (id_usuario, mensaje, leida) VALUES (?, ?, 0)",
      [id_usuario, mensaje]
    );

    // 2. Enviar por WebSocket si se solicita
    if (enviarWebSocket && ws && typeof ws.enviarNotificacion === 'function') {
      ws.enviarNotificacion(id_usuario, mensaje);
    }

    // 3. Enviar por correo si se solicita
    if (enviarCorreo && correo) {
      // Log para depuración
      console.log('[Notificaciones] Enviando correo a admin:', { para: correo, asunto: 'Nueva notificación', mensaje });
      // Enviar correo simple (texto plano)
      try {
        await correoService.enviarCorreo({
          para: correo,
          asunto: "Nueva notificación",
          nombre: 'Administrador',
          link: '',
          mensaje // se ignora, pero lo dejamos para compatibilidad
        });
      } catch (err) {
        console.error('[Notificaciones] Error enviando correo a admin:', err);
      }
    }
  } catch (error) {
    console.error("Error al crear notificación:", error);
  }
};

// Obtener todas las notificaciones de un usuario
exports.obtenerNotificaciones = async (id_usuario) => {
  const [rows] = await pool.query(
    "SELECT id_notificacion, id_usuario, mensaje, leida, fecha_creacion FROM notificaciones WHERE id_usuario = ? ORDER BY fecha_creacion DESC",
    [id_usuario]
  );
  // Normalizar los campos para el frontend
  return rows.map(row => ({
    id: row.id_notificacion,
    mensaje: row.mensaje,
    leida: !!row.leida,
    fecha: row.fecha_creacion,
    // Se pueden agregar más campos si el frontend los requiere
  }));
};

// Marcar una notificación como leída
exports.marcarComoLeida = async (id_notificacion) => {
  await pool.query(
    "UPDATE notificaciones SET leida = 1 WHERE id_notificacion = ?",
    [id_notificacion]
  );
};
