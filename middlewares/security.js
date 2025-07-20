// Seguridad HTTP avanzada
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

module.exports = {
  helmet,
  loginLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos por IP
    message: {
      message: 'Demasiados intentos de inicio de sesión. Intenta de nuevo más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
};
