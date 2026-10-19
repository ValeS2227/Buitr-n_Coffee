const nodemailer = require("nodemailer");

// Usa una "contraseña de aplicación" de Gmail, NO tu contraseña normal.
// Genera una en: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envía un correo con el código de verificación (usado tanto para
 * verificar el email al registrarse como para recuperar contraseña).
 */
async function enviarCodigoVerificacion(destinatario, codigo) {
  const mailOptions = {
    from: `"Buitrón Coffee" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: "Tu código de verificación - Buitrón Coffee",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #7a3b1e; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">☕ Buitrón Coffee</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #eee; border-top: none;">
          <p>Tu código de verificación es:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; margin: 20px 0; color: #7a3b1e;">
            ${codigo}
          </div>
          <p>Este código expira en 10 minutos. Si no solicitaste este código, puedes ignorar este correo.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Envía una alerta de stock bajo al administrador (usada por estadisticas.routes.js).
 */
async function enviarCorreoAlertaStock(destinatario, nombreAdmin, productosStockBajo, htmlPersonalizado) {
  const mailOptions = {
    from: `"Buitrón Coffee" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: "⚠️ Alerta de stock bajo - Buitrón Coffee",
    html:
      htmlPersonalizado ||
      `<p>Hola ${nombreAdmin}, hay ${productosStockBajo.length} producto(s) con stock bajo.</p>`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  enviarCodigoVerificacion,
  enviarCorreoAlertaStock,
};