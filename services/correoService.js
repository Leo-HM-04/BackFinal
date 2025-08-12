const nodemailer = require("nodemailer");
require('dotenv').config();

// Transportador para Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true, // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  debug: false, // Puedes activar esto para debug
  logger: false
});

// Verificar conexión SMTP al inicializar
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error en configuración SMTP:", error);
  } else {
    console.log("✅ Servidor SMTP listo para enviar correos");
  }
});

/**
 * Enviar un correo profesional con HTML
 * @param {Object} datos
 * @param {string} datos.para - Correo del destinatario
 * @param {string} datos.asunto - Asunto del correo
 * @param {string} datos.nombre - Nombre del destinatario
 * @param {string} [datos.link] - Link de acceso a la plataforma
 */
exports.enviarCorreo = async ({ para, asunto, nombre, link, mensaje }) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 32px;">
      <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px;">
        <h2 style="color: #1a237e; margin-bottom: 8px;">¡Notificación de Bechapra!</h2>
        <p style="color: #333; font-size: 16px;">Hola <b>${nombre || ''}</b>,</p>
        ${mensaje ? `<div style='background:#e0f7fa;padding:16px;border-radius:8px;margin-bottom:16px;'><b>Mensaje:</b><br>${mensaje}</div>` : ''}
        <p style="color: #333; font-size: 15px;">Puedes acceder a la plataforma desde el siguiente enlace:</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${link || 'https://bechapra.com.mx'}" style="background: #1a237e; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">Ir a la plataforma</a>
        </div>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #888; font-size: 13px;">Si tienes dudas, responde a este correo o comunícate con soporte.</p>
        <p style="color: #1a237e; font-weight: bold; font-size: 15px; margin-top: 16px;">Equipo Bechapra</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `Bechapra Plataforma <${process.env.SMTP_USER}>`,
    to: para,
    subject: asunto,
    html
  };

  try {
    console.log(`📧 Intentando enviar correo a ${para}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado exitosamente a ${para}. ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    console.error("📋 Detalles del error:", {
      code: error.code,
      response: error.response,
      command: error.command
    });
    return { success: false, error: error.message };
  }
};
