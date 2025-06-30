const app = require("./app");
require("dotenv").config();
require("./tareas/recurrentes");
const http = require("http");
const jwt = require("jsonwebtoken");

// WebSocket
const { wss } = require("./ws");

const PORT = process.env.PORT || 4000;

// Crear servidor HTTP manualmente
const server = http.createServer(app);

// Asociar el WebSocket Server al HTTP Server
server.on("upgrade", (request, socket, head) => {
  const token = new URLSearchParams(request.url.replace("/?", "")).get("token");

  if (!token) return socket.destroy();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.id_usuario;

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, userId);
    });
  } catch (err) {
    console.error("Token inválido en WebSocket:", err.message);
    socket.destroy();
  }
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor HTTP y WebSocket en http://localhost:${PORT}`);
});
