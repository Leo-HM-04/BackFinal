const WebSocket = require("ws");

const usuariosConectados = new Map(); // userId → socket

// Creamos el WebSocket Server, pero lo conectamos luego al servidor HTTP
const wss = new WebSocket.Server({ noServer: true });

// Evento de conexión
wss.on("connection", (ws, request, userId) => {
  console.log(`✅ WebSocket conectado: Usuario ${userId}`);
  usuariosConectados.set(userId, ws);

  ws.on("close", () => {
    console.log(`❌ WebSocket desconectado: Usuario ${userId}`);
    usuariosConectados.delete(userId);
  });
});

// Función para enviar notificación a un usuario
function enviarNotificacion(id_usuario, mensaje) {
  console.log(`🔍 Buscando conexión WebSocket para usuario ${id_usuario}...`);
  console.log("👥 Usuarios conectados actualmente:", Array.from(usuariosConectados.keys()));

  const ws = usuariosConectados.get(id_usuario);

  if (!ws) {
    console.log(`❌ No se encontró conexión WebSocket para el usuario ${id_usuario}`);
    return;
  }

  console.log(`✅ Conexión encontrada para usuario ${id_usuario}`);
  console.log(`📡 Estado del WebSocket: ${ws.readyState}`);

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ tipo: "notificacion", mensaje }));
    console.log(`📤 Notificación enviada a usuario ${id_usuario}: ${mensaje}`);
  } else {
    console.log(`⚠️ WebSocket no está en estado OPEN para el usuario ${id_usuario}`);
  }
}

module.exports = {
  wss,
  enviarNotificacion
};
