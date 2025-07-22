const pool = require('../db/connection');

// Estadísticas de Solicitudes
exports.getSolicitudesStats = async (req, res) => {
  try {
    // Conteo por estado
    const [porEstado] = await pool.query(
      `SELECT estado, COUNT(*) as total FROM solicitudes_pago GROUP BY estado`
    );
    // Conteo por mes
    const [porMes] = await pool.query(
      `SELECT MONTH(fecha_creacion) as mes, COUNT(*) as total FROM solicitudes_pago GROUP BY mes`
    );
    res.json({ porEstado, porMes });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de solicitudes' });
  }
};

// Estadísticas de Usuarios
exports.getUsuariosStats = async (req, res) => {
  try {
    // Conteo por rol
    const [porRol] = await pool.query(
      `SELECT rol, COUNT(*) as total FROM usuarios GROUP BY rol`
    );
    // Activos/Bloqueados
    const [bloqueados] = await pool.query(
      `SELECT bloqueado, COUNT(*) as total FROM usuarios GROUP BY bloqueado`
    );
    res.json({ porRol, bloqueados });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de usuarios' });
  }
};

// Estadísticas de Recurrentes
exports.getRecurrentesStats = async (req, res) => {
  try {
    // Conteo por estado
    const [porEstado] = await pool.query(
      `SELECT estado, COUNT(*) as total FROM pagos_recurrentes GROUP BY estado`
    );
    // Conteo por frecuencia
    const [porFrecuencia] = await pool.query(
      `SELECT frecuencia, COUNT(*) as total FROM pagos_recurrentes GROUP BY frecuencia`
    );
    res.json({ porEstado, porFrecuencia });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de recurrentes' });
  }
};

// Estadísticas de Notificaciones
exports.getNotificacionesStats = async (req, res) => {
  try {
    // Conteo por usuario, incluyendo el nombre
    const [porUsuario] = await pool.query(
      `SELECT n.id_usuario, COUNT(*) as total, u.nombre FROM notificaciones n
       LEFT JOIN usuarios u ON n.id_usuario = u.id_usuario
       GROUP BY n.id_usuario, u.nombre`
    );
    // Conteo por leída/no leída
    const [porLeida] = await pool.query(
      "SELECT leida, COUNT(*) as total FROM notificaciones GROUP BY leida"
    );
    res.json({ porLeida, porUsuario });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de notificaciones' });
  }
};

// Estadísticas de tendencia semanal
exports.getTendenciaSemanal = async (req, res) => {
  try {
    // Agrupar pagos por semana
    const [pagosPorSemana] = await pool.query(`
      SELECT WEEK(created_at) as semana, COUNT(*) as pagos
      FROM pagos_recurrentes
      GROUP BY semana
      ORDER BY semana
    `);
    // Agrupar solicitudes por semana
    const [solicitudesPorSemana] = await pool.query(`
      SELECT WEEK(fecha_creacion) as semana, COUNT(*) as solicitudes
      FROM solicitudes_pago
      GROUP BY semana
      ORDER BY semana
    `);
    // Unir los resultados por semana
    const semanas = {};
    pagosPorSemana.forEach(row => {
      semanas[row.semana] = { semana: `S${row.semana}`, pagos: row.pagos, solicitudes: 0 };
    });
    solicitudesPorSemana.forEach(row => {
      if (!semanas[row.semana]) semanas[row.semana] = { semana: `S${row.semana}`, pagos: 0, solicitudes: row.solicitudes };
      else semanas[row.semana].solicitudes = row.solicitudes;
    });
    const tendencia = Object.values(semanas).sort((a,b)=>a.semana.localeCompare(b.semana));
    res.json({ tendencia });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tendencia semanal' });
  }
};