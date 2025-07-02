const express = require("express");
const router = express.Router();

const verificarToken = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
const controller = require("../controllers/solicitud.controller");
const upload = require("../middlewares/upload"); // Multer configurado

// ✅ Crear solicitud con archivo (solo solicitantes y admin_general)
router.post(
  "/",
  verificarToken,
  autorizarRol("solicitante", "admin_general"),
  upload.single("factura"), // Subida del archivo
  controller.createSolicitud
);

// ✅ Obtener todas o propias según el rol
router.get("/", verificarToken, controller.getSolicitudes);

// ✅ Obtener una solicitud por ID
router.get("/:id", verificarToken, controller.getSolicitud);

// ✅ Aprobar o rechazar solicitud
router.put(
  "/:id/estado",
  verificarToken,
  autorizarRol("aprobador", "admin_general"),
  controller.actualizarEstado
);

// ✅ Marcar como pagada
router.put(
  "/:id/pagar",
  verificarToken,
  autorizarRol("pagador_banca", "admin_general"),
  controller.marcarComoPagada
);

// ✅ Eliminar solicitud
router.delete(
  "/:id",
  verificarToken,
  autorizarRol("admin_general", "solicitante"),
  controller.deleteSolicitud
);

// ✅ Editar solicitud con archivo (solo solicitante)
router.put(
  "/:id",
  verificarToken,
  autorizarRol("solicitante"),
  upload.single("factura"), // Subida opcional de nueva factura
  controller.editarSolicitud
);

module.exports = router;
