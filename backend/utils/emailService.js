const nodemailer = require("nodemailer");

// Configuración del transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "diego.guerrero.dg1747@gmail.com",     // ← CAMBIA ESTO
    pass: "zbcp ntrx pjrz rchu"      // ← CAMBIA ESTO (contraseña de aplicación)
  }
});

// Enviar correo de recuperación
const enviarCorreoRecuperacion = async (email, nombre, codigo) => {
  const mailOptions = {
    from: '"Buitrón Coffee" <tucorreo@gmail.com>',
    to: email,
    subject: "Recuperación de contraseña - Buitrón Coffee",
    html: `
      <div style="font-family: Arial; max-width: 600px;">
        <div style="background: #c0392b; padding: 20px; text-align: center;">
          <h1 style="color: white;">Buitrón Coffee</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd;">
          <h2>Hola, ${nombre}</h2>
          <p>Tu código de verificación es:</p>
          <div style="background: #f5f5f5; padding: 15px; font-size: 24px; text-align: center;">
            <strong>${codigo}</strong>
          </div>
          <p>Este código expirará en <strong> 5 minutos</strong>.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { enviarCorreoRecuperacion };