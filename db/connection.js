const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "srv1505.hstgr.io",
  user: process.env.DB_USER || "u995420991_undbechapra",
  password: process.env.DB_PASSWORD || "19042004Leo", // sin contraseña
  database: process.env.DB_NAME || "u995420991_plataformaPago",
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión exitosa a la base de datos");
    connection.release();
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error.message);
  }
})();

module.exports = pool;
