const pool = require("../db/connection");

// Estadísticas para dashboard de aprobador
exports.getResumenPorEstado = async (req, res) => {
  try {
    // Solo cuenta solicitudes donde el usuario es aprobador
    const { id_usuario } = req.user;
    // Unir solicitudes_pago, solicitudes_viaticos y pagos_recurrentes
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
      [id_usuario, id_usuario, id_usuario]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};

exports.getResumenPorMes = async (req, res) => {
  try {
    const { id_usuario } = req.user;
    // Unir solicitudes_pago, solicitudes_viaticos y pagos_recurrentes
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
      [id_usuario, id_usuario, id_usuario]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener estadísticas mensuales" });
  }
};
