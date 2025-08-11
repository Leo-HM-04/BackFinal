// Modelo para estadísticas del aprobador
const db = require('../db/connection');

const AprobadorEstadisticas = {
  // Distribución por estado (consolidado, pagador)
  async resumenPorEstado(rolPagadorId) {
    const [rows] = await db.query(`
      SELECT estado, COUNT(*) as total, SUM(monto) as monto_total, 'solicitudes_pago' as origen
      FROM solicitudes_pago
      WHERE id_pagador = ?
      GROUP BY estado
      UNION ALL
      SELECT estado, COUNT(*) as total, SUM(monto) as monto_total, 'solicitudes_viaticos' as origen
      FROM solicitudes_viaticos
      WHERE id_pagador = ?
      GROUP BY estado
      UNION ALL
      SELECT estado, COUNT(*) as total, SUM(monto) as monto_total, 'pagos_recurrentes' as origen
      FROM pagos_recurrentes
      WHERE id_pagador = ?
      GROUP BY estado
    `, [rolPagadorId, rolPagadorId, rolPagadorId]);
    return rows;
  },

  // Tendencia mensual (consolidado, pagador)
  async tendenciaMensual(rolPagadorId) {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(fecha_creacion, '%Y-%m') as mes, COUNT(*) as total, SUM(monto) as monto_total, 'solicitudes_pago' as origen
      FROM solicitudes_pago
      WHERE id_pagador = ?
      GROUP BY mes
      UNION ALL
      SELECT DATE_FORMAT(fecha_creacion, '%Y-%m') as mes, COUNT(*) as total, SUM(monto) as monto_total, 'solicitudes_viaticos' as origen
      FROM solicitudes_viaticos
      WHERE id_pagador = ?
      GROUP BY mes
      UNION ALL
      SELECT DATE_FORMAT(created_at, '%Y-%m') as mes, COUNT(*) as total, SUM(monto) as monto_total, 'pagos_recurrentes' as origen
      FROM pagos_recurrentes
      WHERE id_pagador = ?
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT 12
    `, [rolPagadorId, rolPagadorId, rolPagadorId]);
    return rows;
  },

  // Comparativo por origen (consolidado, pagador)
  async comparativoOrigen(rolPagadorId) {
    const [rows] = await db.query(`
      SELECT 'solicitudes_pago' as origen, COUNT(*) as total, SUM(monto) as monto_total
      FROM solicitudes_pago
      WHERE id_pagador = ?
      UNION ALL
      SELECT 'solicitudes_viaticos' as origen, COUNT(*) as total, SUM(monto) as monto_total
      FROM solicitudes_viaticos
      WHERE id_pagador = ?
      UNION ALL
      SELECT 'pagos_recurrentes' as origen, COUNT(*) as total, SUM(monto) as monto_total
      FROM pagos_recurrentes
      WHERE id_pagador = ?
    `, [rolPagadorId, rolPagadorId, rolPagadorId]);
    return rows;
  },

  // Tiempo promedio de pago (consolidado, pagador)
  async tiempoPromedioAprobacion(rolPagadorId) {
    const [rows] = await db.query(`
      SELECT estado, AVG(DATEDIFF(fecha_pago, fecha_creacion)) as dias_promedio, 'solicitudes_pago' as origen
      FROM solicitudes_pago
      WHERE id_pagador = ? AND fecha_pago IS NOT NULL
      GROUP BY estado
      UNION ALL
      SELECT estado, AVG(DATEDIFF(fecha_pago, fecha_creacion)) as dias_promedio, 'solicitudes_viaticos' as origen
      FROM solicitudes_viaticos
      WHERE id_pagador = ? AND fecha_pago IS NOT NULL
      GROUP BY estado
      UNION ALL
      SELECT estado, AVG(DATEDIFF(fecha_pago, created_at)) as dias_promedio, 'pagos_recurrentes' as origen
      FROM pagos_recurrentes
      WHERE id_pagador = ? AND fecha_pago IS NOT NULL
      GROUP BY estado
    `, [rolPagadorId, rolPagadorId, rolPagadorId]);
    return rows;
  },

  // Top usuarios (consolidado, pagador)
  async topUsuarios(rolPagadorId) {
    const [rows] = await db.query(`
      SELECT id_usuario as usuario_id, COUNT(*) as total, SUM(monto) as monto_total, 'solicitudes_pago' as origen
      FROM solicitudes_pago
      WHERE id_pagador = ?
      GROUP BY id_usuario
      UNION ALL
      SELECT id_usuario as usuario_id, COUNT(*) as total, SUM(monto) as monto_total, 'solicitudes_viaticos' as origen
      FROM solicitudes_viaticos
      WHERE id_pagador = ?
      GROUP BY id_usuario
      UNION ALL
      SELECT id_usuario as usuario_id, COUNT(*) as total, SUM(monto) as monto_total, 'pagos_recurrentes' as origen
      FROM pagos_recurrentes
      WHERE id_pagador = ?
      GROUP BY id_usuario
      ORDER BY monto_total DESC
      LIMIT 5
    `, [rolPagadorId, rolPagadorId, rolPagadorId]);
    return rows;
  }
};

module.exports = AprobadorEstadisticas;
