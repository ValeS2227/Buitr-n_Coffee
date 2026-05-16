// ============================================================
// 📱 whatsappService.js
// Servicio de WhatsApp con Twilio para Buitrón Coffee
// ============================================================

const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM; // whatsapp:+14155238886

const client = twilio(accountSid, authToken);

/**
 * Envía un WhatsApp al cliente confirmando su pedido.
 *
 * @param {string} telefonoCliente  - Ej: "+573001234567"
 * @param {string} nombreCliente    - Nombre del usuario
 * @param {number} pedidoId         - ID del pedido creado
 * @param {number} total            - Total en pesos colombianos
 * @param {string} fechaLimite      - Fecha límite formateada, ej: "13/05/2026"
 */
async function enviarConfirmacionWhatsApp(
  telefonoCliente,
  nombreCliente,
  pedidoId,
  total,
  fechaLimite
) {
  const totalFormateado = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(total);

  const mensaje =
    `☕ *¡Hola, ${nombreCliente}!*\n\n` +
    `Tu pedido en *Buitrón Coffee* ha sido confirmado exitosamente. ✅\n\n` +
    `📦 *Pedido #${pedidoId}*\n` +
    `💰 *Total:* ${totalFormateado}\n` +
    `📅 *Fecha límite de pago:* ${fechaLimite}\n\n` +
    `Recuerda realizar tu pago antes de la fecha límite para que podamos procesar tu pedido.\n\n` +
    `Si tienes alguna pregunta, contáctanos. ¡Gracias por elegirnos! 🙌`;

  const response = await client.messages.create({
    from: fromNumber,
    to: `whatsapp:${telefonoCliente}`,
    body: mensaje,
  });

  console.log(`✅ WhatsApp enviado a ${telefonoCliente} — SID: ${response.sid}`);
  return response;
}

module.exports = { enviarConfirmacionWhatsApp };
