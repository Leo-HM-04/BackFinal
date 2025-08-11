const pool = require("../db/connection");

// Consolidar resumen por estado para aprobador
exports.getResumenPorEstado = async (id_aprobador) => {
  const [rows] = await pool.query(
    `SELECT estado, SUM(total) as total, SUM(monto_total) as monto_total FROM (
      SELECT estado, COUNT(*) as total, SUM(monto) as monto_total
      FROM solicitudes_pago
      WHERE id_aprobador = ?
      GROUP BY estado
      UNION ALL
      SELECT estado, COUNT(*) as total, SUM(monto) as monto_total
      FROM solicitudes_viaticos
      WHERE id_aprobador = ?
      GROUP BY estado
      UNION ALL
      SELECT estado, COUNT(*) as total, SUM(monto) as monto_total
      FROM pagos_recurrentes
      WHERE id_aprobador = ?
      GROUP BY estado
    ) t
    GROUP BY estado`,
    [id_aprobador, id_aprobador, id_aprobador]
  );
  return rows;
};

// Consolidar resumen por mes para aprobador
exports.getResumenPorMes = async (id_aprobador) => {
  const [rows] = await pool.query(
    `SELECT anio, mes, estado, SUM(total) as total, SUM(monto_total) as monto_total FROM (
      SELECT YEAR(fecha_revision) as anio, MONTH(fecha_revision) as mes, estado, COUNT(*) as total, SUM(monto) as monto_total
      FROM solicitudes_pago
      WHERE id_aprobador = ?
      GROUP BY anio, mes, estado
      UNION ALL
      SELECT YEAR(fecha_revision) as anio, MONTH(fecha_revision) as mes, estado, COUNT(*) as total, SUM(monto) as monto_total
      FROM solicitudes_viaticos
      WHERE id_aprobador = ?
      GROUP BY anio, mes, estado
      UNION ALL
      SELECT YEAR(fecha_revision) as anio, MONTH(fecha_revision) as mes, estado, COUNT(*) as total, SUM(monto) as monto_total
      FROM pagos_recurrentes
      WHERE id_aprobador = ?
      GROUP BY anio, mes, estado
    ) t
    GROUP BY anio, mes, estado
    ORDER BY anio DESC, mes DESC`,
    [id_aprobador, id_aprobador, id_aprobador]
  );
  return rows;
};