const axios = require("axios");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v20.0";

/**
 * Normaliza un número de teléfono colombiano a formato internacional (sin '+').
 * Si el número ya trae indicativo (ej. 57...) lo deja igual.
 * Ej: "3196160291" -> "573196160291"
 */
function normalizarTelefono(telefono) {
  let limpio = (telefono || "").replace(/[^\d]/g, "");

  if (limpio.length === 10) {
    // Número local colombiano (celular) -> agregar indicativo 57
    limpio = `57${limpio}`;
  }

  return limpio;
}

/**
 * Construye el texto de la factura/pedido para enviar por WhatsApp.
 */
function construirMensajeFactura({ pedido, usuario, items }) {
  const fecha = new Date(pedido.Fecha).toLocaleString("es-CO");
  const numeroFactura = `F-${pedido.ID_Pedido.toString().padStart(6, "0")}`;

  let lineasProductos = "";
  if (items && items.length > 0) {
    lineasProductos = items
      .map((item) => {
        const subtotalItem = item.Cantidad * item.PrecioUnitario;
        return `• ${item.Nombre_producto} x${item.Cantidad} — $${subtotalItem.toLocaleString("es-CO")}`;
      })
      .join("\n");
  }

  return (
    `*Buitrón Coffee* ☕\n` +
    `Factura ${numeroFactura}\n` +
    `Fecha: ${fecha}\n\n` +
    `Hola ${usuario.Nombre_usuario}, este es el resumen de tu pedido #${pedido.ID_Pedido}:\n\n` +
    `${lineasProductos}\n\n` +
    `Subtotal: $${Number(pedido.Subtotal).toLocaleString("es-CO")}\n` +
    `*Total: $${Number(pedido.Total).toLocaleString("es-CO")}*\n` +
    `Estado del pedido: ${pedido.Estado}\n` +
    `Estado del pago: ${pedido.Pagado ? "Pagado ✅" : "Pendiente de pago ⏳"}\n\n` +
    `¡Gracias por tu compra!`
  );
}

/**
 * Envía la factura de un pedido al número de WhatsApp indicado
 * usando la API oficial de Meta (WhatsApp Cloud API).
 */
async function enviarFacturaWhatsApp({ telefono, pedido, usuario, items }) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error(
      "WhatsApp no está configurado. Define WHATSAPP_TOKEN y WHATSAPP_PHONE_NUMBER_ID en el archivo .env"
    );
  }

  const telefonoDestino = normalizarTelefono(telefono);

  if (telefonoDestino.length < 11) {
    throw new Error("El número de teléfono no es válido");
  }

  const mensaje = construirMensajeFactura({ pedido, usuario, items });

  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const respuesta = await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: telefonoDestino,
      type: "text",
      text: { body: mensaje, preview_url: false },
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  return respuesta.data;
}

module.exports = { enviarFacturaWhatsApp, normalizarTelefono, construirMensajeFactura };