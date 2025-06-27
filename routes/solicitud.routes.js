const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
const controller = require("../controllers/solicitud.controller");

// Crear solicitud (solo solicitantes)
router.post("/", verificarToken, autorizarRol("solicitante", "admin_general"), controller.createSolicitud);

// Obtener todas o propias según el rol (sin restricción de rol, solo autenticación)
router.get("/", verificarToken, controller.getSolicitudes);

// Obtener una solicitud por ID (también sin restricción de rol específica)
router.get("/:id", verificarToken, controller.getSolicitud);

// ✅ Aprobar o rechazar solicitud (aprobadores y admin_general)
router.put("/:id/estado", verificarToken, autorizarRol("aprobador", "admin_general"), controller.actualizarEstado);

// ✅ Marcar como pagada (pagador_banca y admin_general)
router.put("/:id/pagar", verificarToken, autorizarRol("pagador_banca", "admin_general"), controller.marcarComoPagada);

// ✅ Eliminar solicitud (solo admin_general)
router.delete("/:id", verificarToken, autorizarRol("admin_general", "solicitante"), controller.deleteSolicitud);

// Editar solicitud (solo solicitante y si está pendiente)
router.put("/:id", verificarToken, autorizarRol("solicitante"), controller.editarSolicitud);

module.exports = router;
