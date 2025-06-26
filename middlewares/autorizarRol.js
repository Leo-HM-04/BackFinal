
// middlewares/autorizarRol.js
const autorizarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: "Acceso denegado. Rol no autorizado." });
    }
    next();
  };
};

module.exports = autorizarRol;
