const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
const controller = require("../controllers/recurrente.controller");

// Crear plantilla (solo solicitantes)
router.post("/", verificarToken, autorizarRol("solicitante"), controller.crearRecurrente);

// Obtener plantillas del usuario autenticado
router.get("/", verificarToken, controller.obtenerRecurrentes);

// 🔎 Obtener todas las plantillas pendientes (aprobadores y admin_general)
router.get("/pendientes", verificarToken, autorizarRol("aprobador", "admin_general"), controller.obtenerPendientes);

// ✅ Aprobar plantilla (aprobadores y admin_general)
router.put("/:id/aprobar", verificarToken, autorizarRol("aprobador", "admin_general"), controller.aprobarRecurrente);

// ❌ Rechazar plantilla (aprobadores y admin_general)
router.put("/:id/rechazar", verificarToken, autorizarRol("aprobador", "admin_general"), controller.rechazarRecurrente);

// 🗑️ Eliminar plantilla (solo solicitante o admin_general)
router.delete("/:id", verificarToken, autorizarRol("solicitante", "admin_general"), controller.eliminarRecurrente);


module.exports = router;
