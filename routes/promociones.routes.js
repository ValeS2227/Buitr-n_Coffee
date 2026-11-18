const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const jwt = require("jsonwebtoken");
const {
  PromotionError,
  calcularPromocion,
} = require("../utils/promotionService");

const SECRET = process.env.JWT_SECRET || "secreto123";

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token requerido" });
  }
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Token inválido" });
    }
    req.usuarioId = decoded.id;
    req.usuarioRol = Number(decoded.rol);
    next();
  });
};

const verificarAdmin = (req, res, next) => {
  if (req.usuarioRol !== 2) {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Solo administradores.",
    });
  }
  next();
};

// Traduce una fila de promociones (snake_case + producto anidado) al formato original
const mapPromocion = (p, extra = {}) => ({
  ID_Promocion: p.id,
  Nombre: p.nombre,
  Descripcion: p.descripcion,
  Tipo: p.tipo,
  Valor: p.valor,
  Codigo: p.codigo,
  ID_Producto: p.id_producto,
  Producto_Nombre: p.producto?.nombre_producto ?? null,
  Minimo_Compra: p.minimo_compra,
  Fecha_Inicio: p.fecha_inicio,
  Fecha_Fin: p.fecha_fin,
  Stock_Limite: p.stock_limite,
  Usos_Actuales: p.usos_actuales,
  ...(p.estado !== undefined && { Estado: p.estado }),
  ...(p.fecha_creacion !== undefined && { Fecha_Creacion: p.fecha_creacion }),
  ...extra,
});

// Verifica si una promoción todavía tiene cupo (Stock_Limite es nullable)
const tieneCupo = (p) => p.stock_limite == null || p.usos_actuales < p.stock_limite;

// =============================================
//  OBTENER PROMOCIONES ACTIVAS (Público)
// =============================================
router.get("/activas", async (req, res) => {
  const ahora = new Date().toISOString();

  const { data, error } = await supabase
    .from("promociones")
    .select(
      "id, nombre, descripcion, tipo, valor, codigo, id_producto, minimo_compra, fecha_inicio, fecha_fin, stock_limite, usos_actuales, producto(nombre_producto)"
    )
    .eq("estado", true)
    .lte("fecha_inicio", ahora)
    .gte("fecha_fin", ahora)
    .order("fecha_fin", { ascending: true });

  if (error) {
    console.error("Error al obtener promociones:", error);
    return res.status(500).json({ success: false, message: "Error al obtener promociones" });
  }

  // El WHERE ya garantiza que están vigentes; solo falta el chequeo de cupo (columna vs columna)
  const disponibles = data.filter(tieneCupo);

  res.json({ success: true, data: disponibles.map((p) => mapPromocion(p, { Disponible: 1 })) });
});

// =============================================
//  OBTENER TODAS LAS PROMOCIONES (Admin)
// =============================================
router.get("/admin/todas", verificarToken, verificarAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("promociones")
    .select(
      "id, nombre, descripcion, tipo, valor, codigo, id_producto, minimo_compra, fecha_inicio, fecha_fin, stock_limite, usos_actuales, estado, fecha_creacion, producto(nombre_producto)"
    )
    .order("fecha_creacion", { ascending: false });

  if (error) {
    console.error("Error al obtener promociones:", error);
    return res.status(500).json({ success: false, message: "Error al obtener promociones" });
  }

  const ahora = new Date();

  const resultado = data.map((p) => {
    let estadoTexto;
    if (p.stock_limite != null && p.usos_actuales >= p.stock_limite) estadoTexto = "Agotado";
    else if (new Date(p.fecha_fin) < ahora) estadoTexto = "Expirada";
    else if (p.estado === false) estadoTexto = "Inactiva";
    else estadoTexto = "Activa";

    return mapPromocion(p, { Estado_Texto: estadoTexto });
  });

  res.json({ success: true, data: resultado });
});

// =============================================
//  OBTENER PROMOCIÓN POR CÓDIGO
// =============================================
router.get("/codigo/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const ahora = new Date().toISOString();

  const { data, error } = await supabase
    .from("promociones")
    .select(
      "id, nombre, descripcion, tipo, valor, codigo, id_producto, minimo_compra, fecha_inicio, fecha_fin, stock_limite, usos_actuales, producto(nombre_producto)"
    )
    .eq("codigo", codigo)
    .eq("estado", true)
    .lte("fecha_inicio", ahora)
    .gte("fecha_fin", ahora)
    .maybeSingle();

  if (error) {
    console.error("Error al verificar código:", error);
    return res.status(500).json({ success: false, message: "Error al verificar código" });
  }

  if (!data || !tieneCupo(data)) {
    return res.status(404).json({
      success: false,
      message: "Código inválido o promoción expirada",
    });
  }

  res.json({ success: true, data: mapPromocion(data) });
});

// =============================================
//  CREAR PROMOCIÓN (Admin)
// =============================================
router.post("/admin/crear", verificarToken, verificarAdmin, async (req, res) => {
  const { Nombre, Descripcion, Tipo, Valor, Codigo, ID_Producto, Minimo_Compra, Fecha_Inicio, Fecha_Fin, Stock_Limite } =
    req.body;

  if (!Nombre || !Tipo || !Fecha_Inicio || !Fecha_Fin) {
    return res.status(400).json({
      success: false,
      message: "Nombre, Tipo, Fecha_Inicio y Fecha_Fin son obligatorios",
    });
  }

  const tiposValidos = ["descuento_porcentaje", "descuento_fijo", "2x1", "puntos_dobles", "combo"];
  if (!tiposValidos.includes(Tipo)) {
    return res.status(400).json({
      success: false,
      message: `Tipo no válido. Tipos permitidos: ${tiposValidos.join(", ")}`,
    });
  }

  if (ID_Producto) {
    const { data: producto, error: errProducto } = await supabase
      .from("producto")
      .select("id")
      .eq("id", ID_Producto)
      .maybeSingle();

    if (errProducto || !producto) {
      return res.status(400).json({
        success: false,
        message: "El producto especificado no existe",
      });
    }
  }

  const { data, error } = await supabase
    .from("promociones")
    .insert({
      nombre: Nombre,
      descripcion: Descripcion || null,
      tipo: Tipo,
      valor: Valor || null,
      codigo: Codigo || null,
      id_producto: ID_Producto || null,
      minimo_compra: Minimo_Compra || null,
      fecha_inicio: Fecha_Inicio,
      fecha_fin: Fecha_Fin,
      stock_limite: Stock_Limite || null,
      estado: true,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error al crear promoción:", error);
    if (error.code === "23505") {
      // unique_violation en Postgres (equivalente a ER_DUP_ENTRY en MySQL)
      return res.status(400).json({
        success: false,
        message: "El código de promoción ya existe",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error al crear la promoción",
    });
  }

  res.json({
    success: true,
    message: "Promoción creada correctamente",
    ID_Promocion: data.id,
  });
});

// =============================================
//  ACTUALIZAR PROMOCIÓN (Admin)
// =============================================
router.put("/admin/actualizar/:id", verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    Nombre,
    Descripcion,
    Tipo,
    Valor,
    Codigo,
    ID_Producto,
    Minimo_Compra,
    Fecha_Inicio,
    Fecha_Fin,
    Stock_Limite,
    Estado,
  } = req.body;

  const { data: existente, error: errCheck } = await supabase
    .from("promociones")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (errCheck || !existente) {
    return res.status(404).json({
      success: false,
      message: "Promoción no encontrada",
    });
  }

  const { error } = await supabase
    .from("promociones")
    .update({
      nombre: Nombre,
      descripcion: Descripcion,
      tipo: Tipo,
      valor: Valor,
      codigo: Codigo,
      id_producto: ID_Producto || null,
      minimo_compra: Minimo_Compra || null,
      fecha_inicio: Fecha_Inicio,
      fecha_fin: Fecha_Fin,
      stock_limite: Stock_Limite || null,
      estado: Estado ?? true,
    })
    .eq("id", id);

  if (error) {
    console.error("Error al actualizar promoción:", error);
    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "El código de promoción ya existe",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la promoción",
    });
  }

  res.json({
    success: true,
    message: "Promoción actualizada correctamente",
  });
});

// =============================================
//  ELIMINAR PROMOCIÓN (Admin)
// =============================================
router.delete("/admin/eliminar/:id", verificarToken, verificarAdmin, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase.from("promociones").delete().eq("id", id).select("id");

  if (error) {
    console.error("Error al eliminar promoción:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la promoción",
    });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Promoción no encontrada",
    });
  }

  res.json({
    success: true,
    message: "Promoción eliminada correctamente",
  });
});

// =============================================
//  APLICAR PROMOCIÓN (SIN ENVÍO)
// =============================================
router.post("/aplicar", verificarToken, async (req, res) => {
  const { codigo, subtotal, items } = req.body;

  try {
    const resultado = await calcularPromocion({ codigo, subtotal, items });
    const { promocionId, ...data } = resultado;
    res.json({ success: true, data });
  } catch (error) {
    if (!(error instanceof PromotionError)) {
      console.error("Error inesperado al aplicar promoción:", error);
      return res.status(500).json({
        success: false,
        message: "Error al validar código",
      });
    }
    res.status(error.status).json({ success: false, message: error.message });
  }
});

module.exports = router;