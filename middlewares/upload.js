const multer = require("multer");
const path = require("path");

// Configurar dónde y cómo se guarda el archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Guardar en la carpeta correcta según el campo y la ruta
    if (file.fieldname === 'factura') {
      cb(null, "uploads/facturas");
    } else if (file.fieldname === 'fact_recurrente') {
      cb(null, "uploads/recurrente");
    } else if (file.fieldname === 'viatico_url') {
      cb(null, "uploads/viaticos");
    } else if (file.fieldname === 'comprobante' && req.baseUrl.includes('/recurrentes')) {
      cb(null, "uploads/comprobante-recurrentes");
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
