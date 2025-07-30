const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
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
  controller.createViatico
);

// Actualizar viático
router.put(
  "/:id",
  authMiddleware,
  autorizarRol("solicitante", "admin_general", "aprobador", "pagador_banca"),
  controller.actualizarViatico
);

// Eliminar viático
router.delete(
  "/:id",
  authMiddleware,
  autorizarRol("solicitante", "admin_general"),
  controller.eliminarViatico
);


const upload = require("../middlewares/upload");

// Subir archivo de viático y actualizar viatico_url
router.post(
  "/subir",
  authMiddleware,
  autorizarRol("solicitante", "admin_general"),
  upload.single("viatico_url"),
  controller.subirArchivoViatico
);

module.exports = router;
