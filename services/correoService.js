const nodemailer = require("nodemailer");

// Transportador para Gmail (usa app password si tienes 2FA activado)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "enrique.bechapra@gmail.com", // Tu correo real
    pass: "jtjz ueoa vpvr pusk" // Tu app password
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
exports.enviarCorreo = async ({ para, asunto, nombre, link }) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 32px;">
      <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px;">
        <h2 style="color: #1a237e; margin-bottom: 8px;">¡Bienvenido/a a Bechapra!</h2>
        <p style="color: #333; font-size: 16px;">Hola <b>${nombre || ''}</b>,</p>
        <p style="color: #333; font-size: 15px;">Te damos la bienvenida a la nueva plataforma de <b>Bechapra</b>.<br>
        Puedes acceder a la plataforma desde el siguiente enlace:</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${link || 'https://bechapra.com'}" style="background: #1a237e; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">Ir a la plataforma</a>
        </div>
        <p style="color: #333; font-size: 15px;">Para obtener tus credenciales de acceso, por favor contacta al administrador.</p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #888; font-size: 13px;">Si tienes dudas, responde a este correo o comunícate con soporte.</p>
        <p style="color: #1a237e; font-weight: bold; font-size: 15px; margin-top: 16px;">Equipo Bechapra</p>
      </div>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: 'Bechapra Plataforma <enrique.bechapra@gmail.com>',
      to: para,
      subject: asunto,
      html
    });
    console.log(`📧 Correo profesional enviado a ${para}`);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
  }
};
