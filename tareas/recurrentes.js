// tareas/recurrentes.js
const cron = require("node-cron");
const pool = require("../db/connection");
const dayjs = require("dayjs");

const ejecutarRecurrentes = async () => {
  const hoy = dayjs().format("YYYY-MM-DD");

  try {
    const [plantillas] = await pool.query(
      "SELECT * FROM pagos_recurrentes WHERE siguiente_fecha = ? AND estado = 'aprobada'",
      [hoy]
    );

    for (const plantilla of plantillas) {
      // Crear solicitud
      const [resultado] = await pool.query(
        `INSERT INTO solicitudes_pago (
          id_usuario, departamento, monto, cuenta_destino, factura_url,
          concepto, tipo_pago, fecha_limite_pago, id_recurrente_origen
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          plantilla.id_usuario,
          plantilla.departamento,
          plantilla.monto,
          plantilla.cuenta_destino,
          null, // factura_url
          plantilla.concepto,
          plantilla.tipo_pago,
          hoy,
          plantilla.id_recurrente // 👈 vínculo con la plantilla
        ]
      );

      const id_solicitud_generada = resultado.insertId;

      // Registrar en historial de ejecuciones
      await pool.query(
        `INSERT INTO ejecuciones_recurrentes (id_recurrente, id_solicitud, fecha_ejecucion)
         VALUES (?, ?, NOW())`,
        [plantilla.id_recurrente, id_solicitud_generada]
      );

      // Calcular siguiente fecha según frecuencia
      let siguiente = dayjs(plantilla.siguiente_fecha);
      switch (plantilla.frecuencia) {
        case "diaria":
          siguiente = siguiente.add(1, "day");
          break;
        case "semanal":
          siguiente = siguiente.add(1, "week");
          break;
        case "mensual":
          siguiente = siguiente.add(1, "month");
          break;
        default:
          console.warn("Frecuencia desconocida:", plantilla.frecuencia);
          continue;
      }

      // Actualizar siguiente_fecha
      await pool.query(
        `UPDATE pagos_recurrentes SET siguiente_fecha = ? WHERE id_recurrente = ?`,
        [siguiente.format("YYYY-MM-DD"), plantilla.id_recurrente]
      );

      console.log(`✅ Generada solicitud y registrada ejecución para plantilla ${plantilla.id_recurrente}`);
    }

    console.log("✔️  Ejecución de tareas recurrentes completada.");
  } catch (err) {
    console.error("❌ Error al ejecutar tareas recurrentes:", err);
  }
};

module.exports = { ejecutarRecurrentes };

// Ejecutar la tarea automáticamente cada día a las 00:05
cron.schedule("5 0 * * *", ejecutarRecurrentes);
