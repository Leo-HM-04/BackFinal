
// middlewares/autorizarRol.js

const autorizarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    console.log("🔒 [autorizarRol] Roles permitidos:", rolesPermitidos);
    console.log("🔒 [autorizarRol] req.user:", req.user);
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      console.warn("❌ [autorizarRol] Acceso denegado. Rol recibido:", req.user ? req.user.rol : undefined);
      return res.status(403).json({ message: "Acceso denegado. Rol no autorizado." });
    }
    console.log("✅ [autorizarRol] Acceso concedido para rol:", req.user.rol);
    next();
  };
};

module.exports = autorizarRol;
