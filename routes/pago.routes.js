const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secreto123";

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
    req.usuarioId = decoded.id;
    next();
  });
};

function generarReferencia() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `SIM-${Date.now()}-${random}`;
}

function validarTarjetaSimulada({ numeroTarjeta, nombreTitular, fechaExp, cvv }) {
  const errores = [];

  const numeroLimpio = (numeroTarjeta || "").replace(/\s+/g, "");
  if (!/^\d{13,19}$/.test(numeroLimpio)) {
    errores.push("El número de tarjeta debe tener entre 13 y 19 dígitos");
  }

  if (!nombreTitular || nombreTitular.trim().length < 3) {
    errores.push("El nombre del titular no es válido");
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fechaExp || "")) {
    errores.push("La fecha de expiración debe tener el formato MM/AA");
  } else {
    const [mes, anio] = fechaExp.split("/").map(Number);
    const ahora = new Date();
    const anioActual = ahora.getFullYear() % 100;
    const mesActual = ahora.getMonth() + 1;
    if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
      errores.push("La tarjeta está vencida");
    }
  }

  if (!/^\d{3,4}$/.test(cvv || "")) {
    errores.push("El CVV no es válido");
  }

  return { valido: errores.length === 0, errores, numeroLimpio };
}

router.post("/simular", verificarToken, async (req, res) => {
  console.log("🟦 /pagos/simular llamado. Body:", req.body, "usuarioId:", req.usuarioId);

  const usuarioId = req.usuarioId;
  const { pedidoId, numeroTarjeta, nombreTitular, fechaExp, cvv } = req.body;

  if (!pedidoId) {
    console.log("🟥 Falta pedidoId");
    return res.status(400).json({ aprobado: false, message: "Falta el ID del pedido" });
  }

  const { valido, errores, numeroLimpio } = validarTarjetaSimulada({
    numeroTarjeta,
    nombreTitular,
    fechaExp,
    cvv,
  });

  if (!valido) {
    console.log("🟥 Tarjeta inválida:", errores);
    return res.status(400).json({ aprobado: false, message: errores.join(". ") });
  }

  const { data: pedido, error: errPedido } = await supabase
    .from("pedido")
    .select("id, total, pagado, estado")
    .eq("id", pedidoId)
    .eq("id_usuario", usuarioId)
    .maybeSingle();

  if (errPedido) {
    console.error("🟥 Error al buscar pedido para pago:", errPedido);
    return res.status(500).json({ aprobado: false, message: "Error al procesar el pago", debug: errPedido });
  }

  console.log("🟦 Pedido encontrado:", pedido);

  if (!pedido) {
    console.log("🟥 Pedido no encontrado para id:", pedidoId, "usuarioId:", usuarioId);
    return res.status(404).json({ aprobado: false, message: "Pedido no encontrado" });
  }

  if (pedido.pagado) {
    console.log("🟥 Pedido ya estaba pagado");
    return res.status(400).json({ aprobado: false, message: "Este pedido ya se encuentra pagado" });
  }

  setTimeout(async () => {
    try {
      const rechazada = numeroLimpio.endsWith("0000");

      if (rechazada) {
        console.log("🟥 Tarjeta rechazada (termina en 0000)");
        return res.status(400).json({
          aprobado: false,
          message: "El banco emisor rechazó la transacción. Intenta con otra tarjeta.",
        });
      }

      const referencia = generarReferencia();
      const ultimos4 = numeroLimpio.slice(-4);

      const { error: errUpdate } = await supabase
        .from("pedido")
        .update({
          pagado: true,
          metodo_pago: `Tarjeta **** ${ultimos4}`,
          referencia_pago: referencia,
        })
        .eq("id", pedidoId);

      if (errUpdate) {
        console.error("🟥 Error al marcar pedido como pagado:", errUpdate);
        return res
          .status(500)
          .json({ aprobado: false, message: "Pago simulado pero no se pudo actualizar el pedido", debug: errUpdate });
      }

      console.log("🟩 Pago aprobado y pedido actualizado, referencia:", referencia);

      res.json({
        aprobado: true,
        message: "Pago aprobado",
        referencia,
        ultimos4,
        total: pedido.total,
      });
    } catch (err) {
      console.error("🟥 EXCEPCIÓN dentro del setTimeout:", err);
      res.status(500).json({ aprobado: false, message: "Error inesperado", debug: err.message });
    }
  }, 1200);
});

module.exports = router;