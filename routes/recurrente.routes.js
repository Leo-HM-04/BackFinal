const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
const controller = require("../controllers/recurrente.controller");

// Crear plantilla (solo solicitantes)
router.post("/", verificarToken, autorizarRol("solicitante"), controller.crearRecurrente);

// Obtener plantillas del usuario autenticado
router.get("/", verificarToken, controller.obtenerRecurrentes);

// 🔎 Obtener todas las plantillas pendientes (solo aprobadores)
router.get("/pendientes", verificarToken, autorizarRol("aprobador"), controller.obtenerPendientes);

// ✅ Aprobar plantilla (solo aprobadores)
router.put("/:id/aprobar", verificarToken, autorizarRol("aprobador"), controller.aprobarRecurrente);

// ❌ Rechazar plantilla (solo aprobadores)
router.put("/:id/rechazar", verificarToken, autorizarRol("aprobador"), controller.rechazarRecurrente);

module.exports = router;
