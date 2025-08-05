const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");

const upload = require("../middlewares/upload");
const controller = require("../controllers/viatico.controller");

// Obtener todos los viáticos (según rol)
router.get("/", authMiddleware, controller.getViaticos);

// Obtener un viático por ID
router.get("/:id", authMiddleware, controller.getViatico);

// Crear viático (solo solicitantes y admin_general)
router.post(
  "/",
  authMiddleware,
  autorizarRol("solicitante", "admin_general"),
  upload.single("viatico_url"), // <-- AGREGA ESTO
  controller.createViatico
);

// Editar viático (igual que solicitudes)

router.put(
  "/:id",
  authMiddleware,
  autorizarRol("solicitante", "admin_general"),
  upload.single("viatico_url"),
  controller.editarViatico
);

// Eliminar viático
router.delete(
  "/:id",
  authMiddleware,
  autorizarRol("solicitante", "admin_general"),
  controller.eliminarViatico
);

// Subir archivo de viático y actualizar viatico_url
router.post(
  "/subir",
  authMiddleware,
  autorizarRol("solicitante", "admin_general"),
  upload.single("viatico_url"),
  controller.subirArchivoViatico
);

// Actualizar viático con archivo específico por ID
router.put(
  "/:id/subir",
  authMiddleware,
  autorizarRol("solicitante", "admin_general"),
  upload.single("viatico_file"),
  controller.actualizarViaticoConArchivo
);

// Aprobar o rechazar viático individual (solo aprobador y admin_general)
router.put(
  "/:id/aprobar",
  authMiddleware,
  autorizarRol("aprobador", "admin_general"),
  controller.aprobarViatico
);

router.put(
  "/:id/rechazar",
  authMiddleware,
  autorizarRol("aprobador", "admin_general"),
  controller.rechazarViatico
);

// Aprobar/rechazar viáticos en lote (solo aprobador y admin_general)
router.post(
  "/aprobar-lote",
  authMiddleware,
  autorizarRol("aprobador", "admin_general"),
  controller.aprobarLoteViaticos
);

// Rechazar viáticos en lote (solo aprobador y admin_general)
router.post(
  "/rechazar-lote",
  authMiddleware,
  autorizarRol("aprobador", "admin_general"),
  controller.rechazarLoteViaticos
);

// Obtener viáticos del usuario autenticado
router.get(
  "/mios",
  authMiddleware,
  autorizarRol("solicitante", "admin_general"),
  controller.getViaticos
);

// Marcar viático como pagado (solo pagador_banca y admin_general)
router.put(
  "/:id/pagar",
  authMiddleware,
  autorizarRol("pagador_banca", "admin_general"),
  controller.marcarComoPagado
);

module.exports = router;
