const pool = require("../db/connection");
const correoService = require("./correoService");
const ws = require("../ws"); // aún no lo creamos, pero lo harás después

// Crear notificación y enviarla por WebSocket y correo
exports.crearNotificacion = async ({ id_usuario, mensaje, correo }) => {
  try {
    // 1. Guardar en la base de datos
    await pool.query(
      "INSERT INTO notificaciones (id_usuario, mensaje) VALUES (?, ?)",
      [id_usuario, mensaje]
    );

    // 2. Enviar por WebSocket
    ws.enviarNotificacion(id_usuario, mensaje);

    // 3. Enviar por correo
    await correoService.enviarCorreo({
      para: correo,
      asunto: "Nueva notificación",
      texto: mensaje
    });

  } catch (error) {
    console.error("Error al crear notificación:", error);
  }
};

// Obtener todas las notificaciones de un usuario
exports.obtenerNotificaciones = async (id_usuario) => {
  const [rows] = await pool.query(
    "SELECT * FROM notificaciones WHERE id_usuario = ? ORDER BY fecha_creacion DESC",
    [id_usuario]
  );
  return rows;
};

// Marcar una notificación como leída
exports.marcarComoLeida = async (id_notificacion) => {
  await pool.query(
    "UPDATE notificaciones SET leida = TRUE WHERE id_notificacion = ?",
    [id_notificacion]
  );
};
