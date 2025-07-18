const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
const controller = require("../controllers/recurrente.controller");
const upload = require("../middlewares/upload");



// 📄 Obtener todas las plantillas (admin_general y aprobador)
router.get("/todas", verificarToken, autorizarRol("admin_general", "aprobador"), controller.obtenerTodasRecurrentes);

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
// Marcar como pagada (pagador_banca)
router.put(
  "/:id/pagar",
  verificarToken,
  autorizarRol("pagador_banca", "admin_general"),
  controller.marcarComoPagadaRecurrente
);

// Subir factura recurrente (solicitante o admin_general)
router.put('/:id/factura', verificarToken, autorizarRol('solicitante', 'admin_general'), upload.single('factura'), controller.subirFacturaRecurrente);
// Pausar o reactivar plantilla (solo solicitante o admin_general)
router.put('/:id/activa', verificarToken, autorizarRol('solicitante', 'admin_general'), controller.cambiarEstadoActiva);

// 📄 Obtener solo las recurrentes aprobadas (pagador)
router.get("/aprobadas", verificarToken, autorizarRol("pagador_banca"), controller.obtenerAprobadasParaPagador);

// 📄 Obtener plantillas recurrentes del usuario autenticado (solicitante)
router.get("/", verificarToken, autorizarRol("solicitante", "admin_general"), controller.obtenerRecurrentes);

// 📄 Crear plantilla recurrente (solicitante)
router.post("/", verificarToken, autorizarRol("solicitante", "admin_general"), upload.single('fact_recurrente'), controller.crearRecurrente);

// 📄 Obtener una plantilla recurrente por ID (solicitante o admin_general)
router.get("/:id", verificarToken, autorizarRol("solicitante", "admin_general"), controller.getRecurrentePorId);

module.exports = router;
