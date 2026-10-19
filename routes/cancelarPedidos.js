const supabase = require("../config/supabaseClient");

const cancelarPedidosVencidos = async () => {
  try {
    // Pedidos pendientes, no pagados, con fecha límite ya vencida.
    // El "embed" detalle_pedido(...) funciona porque detalle_pedido tiene
    // una FK hacia pedido (id_pedido -> pedido.id).
    const { data: pedidosVencidos, error } = await supabase
      .from("pedido")
      .select("id, detalle_pedido(id_producto, cantidad)")
      .eq("estado", "Pendiente")
      .eq("pagado", false)
      .lt("fecha_limite", new Date().toISOString());

    if (error) {
      console.error("Error:", error);
      return;
    }

    if (!pedidosVencidos || pedidosVencidos.length === 0) {
      console.log("No hay pedidos vencidos");
      return;
    }

    for (const pedido of pedidosVencidos) {
      const { error: errUpdate } = await supabase
        .from("pedido")
        .update({ estado: "Cancelado" })
        .eq("id", pedido.id);

      if (errUpdate) {
        console.error(`Error cancelando pedido #${pedido.id}:`, errUpdate);
        continue;
      }

      for (const detalle of pedido.detalle_pedido) {
        const { error: errStock } = await supabase.rpc("incrementar_stock", {
          p_producto_id: detalle.id_producto,
          p_cantidad: detalle.cantidad,
        });

        if (errStock) {
          console.error(
            `Error devolviendo stock del producto ${detalle.id_producto} (pedido #${pedido.id}):`,
            errStock
          );
        }
      }

      console.log(`✅ Pedido #${pedido.id} cancelado y stock devuelto`);
    }

    console.log(`Total: ${pedidosVencidos.length} pedidos cancelados`);
  } catch (error) {
    console.error("Error inesperado:", error);
  }
};

cancelarPedidosVencidos();