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
  const ws = usuariosConectados.get(id_usuario);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ tipo: "notificacion", mensaje }));
  }
}

module.exports = {
  wss,
  enviarNotificacion
};
