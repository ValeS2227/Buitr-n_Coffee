const supabase = require("../config/supabaseClient");

class PromotionError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "PromotionError";
    this.status = status;
  }
}

const tieneCupo = (promocion) =>
  promocion.stock_limite == null ||
  promocion.usos_actuales < promocion.stock_limite;

async function calcularPromocion({ codigo, subtotal, items }) {
  if (!codigo || typeof codigo !== "string") {
    throw new PromotionError("Código de promoción requerido");
  }
  if (!Number.isFinite(Number(subtotal)) || Number(subtotal) < 0 || !Array.isArray(items)) {
    throw new PromotionError("Subtotal o productos del carrito no válidos");
  }

  const subtotalNumerico = Number(subtotal);
  const ahora = new Date().toISOString();
  const { data: promocion, error } = await supabase
    .from("promociones")
    .select("*")
    .eq("codigo", codigo.trim())
    .eq("estado", true)
    .lte("fecha_inicio", ahora)
    .gte("fecha_fin", ahora)
    .maybeSingle();

  if (error) {
    console.error("Error al validar código:", error);
    throw new PromotionError("Error al validar código", 500);
  }
  if (!promocion || !tieneCupo(promocion)) {
    throw new PromotionError("Código inválido o promoción expirada", 404);
  }
  if (promocion.minimo_compra && subtotalNumerico < promocion.minimo_compra) {
    throw new PromotionError(
      `El pedido debe ser mayor a $${promocion.minimo_compra.toLocaleString()} para aplicar esta promoción`,
    );
  }

  let descuento = 0;
  let mensaje = "";
  const itemPromocional = promocion.id_producto
    ? items.find((item) => String(item.ID_Producto) === String(promocion.id_producto))
    : null;

  switch (promocion.tipo) {
    case "descuento_porcentaje":
      if (promocion.id_producto && !itemPromocional) {
        throw new PromotionError(
          `El producto "${promocion.nombre}" no está en el carrito`,
        );
      }
      descuento = promocion.id_producto
        ? Number(itemPromocional.PrecioUnitario ?? itemPromocional.Precio) *
          Number(itemPromocional.Cantidad) *
          (Number(promocion.valor) / 100)
        : subtotalNumerico * (Number(promocion.valor) / 100);
      mensaje = promocion.id_producto
        ? `Descuento del ${promocion.valor}% aplicado a "${itemPromocional.Nombre_producto}"`
        : `Descuento del ${promocion.valor}% aplicado al total`;
      break;

    case "descuento_fijo":
      descuento = Number(promocion.valor);
      mensaje = `Descuento de $${Number(promocion.valor).toLocaleString()} aplicado`;
      break;

    case "2x1":
      if (!promocion.id_producto) {
        throw new PromotionError("La promoción 2x1 requiere un producto específico");
      }
      if (!itemPromocional || Number(itemPromocional.Cantidad) < 2) {
        throw new PromotionError(
          `Necesitas al menos 2 unidades para aplicar 2x1 en "${promocion.nombre}"`,
        );
      }
      descuento =
        Math.floor(Number(itemPromocional.Cantidad) / 2) *
        Number(itemPromocional.PrecioUnitario ?? itemPromocional.Precio);
      mensaje = `2x1 aplicado: ${Math.floor(Number(itemPromocional.Cantidad) / 2)} producto(s) gratis`;
      break;

    case "puntos_dobles":
      mensaje = "Puntos dobles acumulados por esta compra";
      break;

    case "combo":
      if (promocion.id_producto && !itemPromocional) {
        mensaje = "Promoción combo disponible";
      } else {
        const base = promocion.id_producto
          ? Number(itemPromocional.PrecioUnitario ?? itemPromocional.Precio) *
            Number(itemPromocional.Cantidad)
          : subtotalNumerico;
        descuento = base * (Number(promocion.valor) / 100);
        mensaje = `Descuento combo del ${promocion.valor}% aplicado`;
      }
      break;

    default:
      throw new PromotionError("Tipo de promoción no válido");
  }

  if (!Number.isFinite(descuento) || descuento < 0) {
    throw new PromotionError("El descuento configurado no es válido", 500);
  }

  descuento = Math.min(descuento, subtotalNumerico);

  return {
    descuento: Number(descuento.toFixed(2)),
    total: Number((subtotalNumerico - descuento).toFixed(2)),
    mensaje,
    promocionId: promocion.id,
    promocion: {
      ID_Promocion: promocion.id,
      Nombre: promocion.nombre,
      Tipo: promocion.tipo,
      Codigo: promocion.codigo,
    },
  };
}

async function registrarUsoPromocion(promocionId) {
  const { error } = await supabase.rpc("incrementar_uso_promocion", {
    p_promocion_id: promocionId,
  });
  if (error) {
    console.error("Error al actualizar usos de promoción:", error);
  }
}

module.exports = { PromotionError, calcularPromocion, registrarUsoPromocion };
