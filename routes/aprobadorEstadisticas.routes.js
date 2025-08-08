const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
const controller = require("../controllers/aprobadorEstadisticas.controller");

// Solo para aprobador y admin_general
router.get("/resumen-estado", authMiddleware, autorizarRol("aprobador", "admin_general"), controller.getResumenPorEstado);
router.get("/resumen-mes", authMiddleware, autorizarRol("aprobador", "admin_general"), controller.getResumenPorMes);

module.exports = router;
