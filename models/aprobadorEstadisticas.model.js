const pool = require("../db/connection");

// Devuelve resumen por estado para el aprobador
exports.getResumenPorEstado = async (id_aprobador) => {
  const [rows] = await pool.query(
    `SELECT estado, COUNT(*) as total, SUM(monto) as monto_total
     FROM solicitudes_pago
     WHERE id_aprobador = ?
     GROUP BY estado`,
    [id_aprobador]
  );
  return rows;
};

// Devuelve resumen por mes para el aprobador
exports.getResumenPorMes = async (id_aprobador) => {
  const [rows] = await pool.query(
    `SELECT YEAR(fecha_revision) as anio, MONTH(fecha_revision) as mes, estado, COUNT(*) as total, SUM(monto) as monto_total
     FROM solicitudes_pago
     WHERE id_aprobador = ?
     GROUP BY anio, mes, estado
     ORDER BY anio DESC, mes DESC`,
    [id_aprobador]
  );
  return rows;
};
