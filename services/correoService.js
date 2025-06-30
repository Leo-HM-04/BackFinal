const nodemailer = require("nodemailer");

// Transportador para Gmail (usa app password si tienes 2FA activado)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tucorreo@gmail.com",        // 🔁 CAMBIA ESTO por tu correo
    pass: "tu_app_password_segura"     // 🔁 CAMBIA ESTO por tu app password de Gmail
  }
});

/**
 * Enviar un correo
 * @param {Object} datos
 * @param {string} datos.para - Correo del destinatario
 * @param {string} datos.asunto - Asunto del correo
 * @param {string} datos.texto - Contenido del mensaje
 */
exports.enviarCorreo = async ({ para, asunto, texto }) => {
  try {
    await transporter.sendMail({
      from: '"Sistema de Solicitudes" <tucorreo@gmail.com>', // 🔁 CAMBIA el nombre
      to: para,
      subject: asunto,
      text: texto
    });
    console.log(`📧 Correo enviado a ${para}`);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
  }
};
