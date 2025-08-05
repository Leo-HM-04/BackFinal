const multer = require("multer");
const path = require("path");

// Configurar dónde y cómo se guarda el archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📂 Upload fieldname:', file.fieldname);
    console.log('📂 Upload originalname:', file.originalname);
    console.log('📂 Upload route:', req.baseUrl);
    
    // Guardar en la carpeta correcta según el campo y la ruta
    if (file.fieldname === 'factura') {
      cb(null, "uploads/facturas");
    } else if (file.fieldname === 'fact_recurrente') {
      cb(null, "uploads/recurrente");
    } else if (file.fieldname === 'viatico_url') {
      cb(null, "uploads/viaticos");
    } else if (file.fieldname === 'comprobante' && req.baseUrl.includes('/recurrentes')) {
      cb(null, "uploads/comprobante-recurrentes");
    } else if (file.fieldname === 'archivo') {
      // Para comprobantes de viáticos
      console.log('📂 Guardando archivo en uploads/comprobante-viaticos');
      cb(null, "uploads/comprobante-viaticos");
    } else {
      console.log('📂 Carpeta por defecto: uploads/comprobantes');
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
