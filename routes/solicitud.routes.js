const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
const controller = require("../controllers/solicitud.controller");
const upload = require("../middlewares/upload"); // Multer configurado (mover arriba)

// ✅ Obtener solicitudes autorizadas y pagadas
router.get(
  "/autorizadas-pagadas",
  authMiddleware,
  autorizarRol("pagador_banca", "admin_general"),
  controller.getAutorizadasYPagadas
);

// ✅ Crear solicitud con archivo (solo solicitantes y admin_general)
router.post(
  "/",
  authMiddleware,
  autorizarRol("solicitante", "admin_general"),
  upload.single("factura"), // Subida del archivo
  controller.createSolicitud
);

// ✅ Obtener todas o propias según el rol
router.get("/", authMiddleware, controller.getSolicitudes);

// ✅ Obtener una solicitud por ID
router.get("/:id", authMiddleware, controller.getSolicitud);

// ✅ Aprobar o rechazar solicitud
router.put(
  "/:id/estado",
  authMiddleware,
  autorizarRol("aprobador", "admin_general"),
  controller.actualizarEstado
);

// ✅ Marcar como pagada
router.put(
  "/:id/pagar",
  authMiddleware,
  autorizarRol("pagador_banca", "admin_general"),
  controller.marcarComoPagada
);

// Eliminar solicitud (solo solicitante y pendiente)
router.delete(
  "/solicitante/:id",
  authMiddleware,
  autorizarRol("solicitante"),
  controller.deleteSolicitudSolicitante
);

// ✅ Eliminar solicitud
router.delete(
  "/:id",
  authMiddleware,
  autorizarRol("admin_general", "solicitante"),
  controller.deleteSolicitud
);

// ✅ Editar solicitud con archivo (solo solicitante)
router.put(
  "/:id",
  authMiddleware,
  autorizarRol("solicitante"),
  upload.single("factura"), // Subida opcional de nueva factura
  controller.editarSolicitud
);

// ✅ Subir comprobante de pago (pagador)
router.put(
  "/:id/comprobante",
  authMiddleware,
  autorizarRol("pagador_banca", "admin_general"),
  upload.single("comprobante"),
  controller.subirComprobante
);

// ✅ Obtener solicitudes pagadas
router.get(
  "/pagadas",
  authMiddleware,
  autorizarRol("pagador_banca", "admin_general"),
  controller.getPagadas
);

module.exports = router;
