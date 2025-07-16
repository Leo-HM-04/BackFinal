const multer = require("multer");
const path = require("path");

// Configurar dónde y cómo se guarda el archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Si el campo es fact_recurrente, guardar en uploads/recurrente
    if (file.fieldname === 'fact_recurrente') {
      cb(null, "uploads/recurrente");
    } else {
      cb(null, "uploads/comprobantes");
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, nombre);
  }
});

const upload = multer({ storage });

module.exports = upload;
