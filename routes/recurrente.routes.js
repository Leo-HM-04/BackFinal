const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
const controller = require("../controllers/recurrente.controller");
const upload = require("../middlewares/upload");


// 📄 Obtener todas las plantillas (admin_general y aprobador)
router.get("/todas", verificarToken, autorizarRol("admin_general", "aprobador"), controller.obtenerTodasRecurrentes);

// Obtener una plantilla recurrente por id
router.get("/:id", verificarToken, controller.obtenerRecurrentePorId);

// 📝 Crear plantilla (solo solicitantes)
router.post("/", verificarToken, autorizarRol("solicitante"), upload.single('fact_recurrente'), controller.crearRecurrente);


// 📄 Obtener plantillas del usuario autenticado
router.get("/", verificarToken, controller.obtenerRecurrentes);

// 📄 Obtener todas las plantillas (solo admin_general)
router.get("/todas", verificarToken, autorizarRol("admin_general"), controller.obtenerTodasRecurrentes);

// 🔍 Obtener todas las plantillas pendientes (aprobadores y admin_general)
router.get("/pendientes", verificarToken, autorizarRol("aprobador", "admin_general"), controller.obtenerPendientes);

// ✅ Aprobar plantilla (aprobadores y admin_general)
router.put("/:id/aprobar", verificarToken, autorizarRol("aprobador", "admin_general"), controller.aprobarRecurrente);

// ❌ Rechazar plantilla (aprobadores y admin_general)
router.put("/:id/rechazar", verificarToken, autorizarRol("aprobador", "admin_general"), controller.rechazarRecurrente);

// 🗑️ Eliminar plantilla (solo solicitante o admin_general)
router.delete("/:id", verificarToken, autorizarRol("solicitante", "admin_general"), controller.eliminarRecurrente);

// ✏️ Editar plantilla recurrente (solo solicitante)
router.put("/:id", verificarToken, autorizarRol("solicitante"), upload.single('fact_recurrente'), controller.editarRecurrente);

// 📜 Obtener historial de ejecuciones (todos los roles, pero filtra según el rol)
router.get("/historial", verificarToken, controller.obtenerHistorial);

// 📜 Historial de solicitudes generadas a partir de una plantilla recurrente
router.get("/:id/historial", verificarToken, controller.obtenerHistorial);

// Subir factura recurrente (solicitante o admin_general)
router.put('/:id/factura', verificarToken, autorizarRol('solicitante', 'admin_general'), upload.single('factura'), controller.subirFacturaRecurrente);
// Pausar o reactivar plantilla (solo solicitante o admin_general)
router.put('/:id/activa', verificarToken, autorizarRol('solicitante', 'admin_general'), controller.cambiarEstadoActiva);

module.exports = router;
