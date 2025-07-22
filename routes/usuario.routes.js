const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
// Ruta pública para verificar email
router.get('/verificar-email', usuarioController.verificarEmail);
const { authMiddleware } = require("../middlewares/authMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");

// Solo usuarios autenticados Y con rol admin_general podrán acceder
router.get("/", authMiddleware, autorizarRol("admin_general"), usuarioController.getUsuarios);
router.get("/:id", authMiddleware, autorizarRol("admin_general"), usuarioController.getUsuario);
router.post("/", authMiddleware, autorizarRol("admin_general"), usuarioController.createUsuario);
router.put("/:id", authMiddleware, autorizarRol("admin_general"), usuarioController.updateUsuario);
router.delete("/:id", authMiddleware, autorizarRol("admin_general"), usuarioController.deleteUsuario);
const authController = require("../controllers/authController");
// Endpoint para cerrar sesión y marcar usuario como inactivo
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
