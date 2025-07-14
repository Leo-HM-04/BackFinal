const express = require("express");
const cors = require("cors");
const app = express();

const path = require("path");

// Servir archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuario.routes');
const solicitudRoutes = require('./routes/solicitud.routes');
const recurrenteRoutes = require('./routes/recurrente.routes'); // 👈 NUEVO
const tareasRoutes = require("./routes/tareas.routes");

const comprobanteRoutes = require('./routes/comprobante.routes');
const departamentoRoutes = require('./routes/departamento.routes');


app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/solicitudes", solicitudRoutes);
app.use("/api/recurrentes", recurrenteRoutes); // 👈 NUEVO
app.use("/api/tareas", tareasRoutes);
app.use("/api/departamentos", departamentoRoutes);
app.use("/api/comprobantes", comprobanteRoutes);

module.exports = app;


