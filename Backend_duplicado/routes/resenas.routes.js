const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secreto123";

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token requerido" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.usuarioId = decoded.id;
    next();
  });
};

// AVG/COUNT no necesitan un RPC aparte aquí: con pocas reseñas por producto,
// se traen las calificaciones y se promedian en JS.
const actualizarCalificacionProducto = async (productoId) => {
  const { data: reseñas, error } = await supabase
    .from("reseñas")
    .select("calificacion")
    .eq("producto_id", productoId)
    .eq("estado", "aprobada");

  if (error) {
    console.error("Error al calcular promedio:", error);
    return;
  }

  const total = reseñas.length;
  const promedio = total > 0 ? reseñas.reduce((sum, r) => sum + r.calificacion, 0) / total : 0;

  const { error: errUpdate } = await supabase
    .from("producto")
    .update({ calificacion_promedio: promedio, total_resenas: total })
    .eq("id", productoId);

  if (errUpdate) console.error("Error al actualizar producto:", errUpdate);
};

// =========================
// 🟢 OBTENER RESEÑAS DE UN PRODUCTO
// =========================
router.get("/producto/:productoId", async (req, res) => {
  const { productoId } = req.params;

  const { data, error } = await supabase
    .from("reseñas")
    .select("*, usuario(nombre_usuario)")
    .eq("producto_id", productoId)
    .eq("estado", "aprobada")
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error en GET /producto/:productoId:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(
    data.map((r) => ({
      ...r,
      Nombre_usuario: r.usuario?.nombre_usuario,
      usuario: undefined,
    }))
  );
});

// =========================
// 🟢 OBTENER PROMEDIO
// =========================
router.get("/producto/:productoId/promedio", async (req, res) => {
  const { productoId } = req.params;

  const { data, error } = await supabase
    .from("reseñas")
    .select("calificacion")
    .eq("producto_id", productoId)
    .eq("estado", "aprobada");

  if (error) {
    console.error("Error en GET /producto/:productoId/promedio:", error);
    return res.status(500).json({ error: error.message });
  }

  const total = data.length;
  const promedio = total > 0 ? data.reduce((sum, r) => sum + r.calificacion, 0) / total : 0;

  res.json({
    promedio: parseFloat(promedio.toFixed(2)) || 0,
    total,
  });
});

// =========================
// 🟢 CREAR RESEÑA
// =========================
router.post("/", verificarToken, async (req, res) => {
  const { producto_id, calificacion, comentario } = req.body;
  const usuario_id = req.usuarioId;

  if (!producto_id || !calificacion || !comentario) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const { data: usuario, error: errUsuario } = await supabase
    .from("usuario")
    .select("nombre_usuario")
    .eq("id", usuario_id)
    .maybeSingle();

  if (errUsuario) return res.status(500).json({ error: errUsuario.message });

  const { error } = await supabase.from("reseñas").insert({
    producto_id,
    usuario_id,
    nombre_usuario: usuario.nombre_usuario,
    calificacion,
    comentario,
    estado: "pendiente",
  });

  if (error) {
    console.error("Error en POST /:", error);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Reseña enviada, esperando aprobación" });
});

// =========================
// 🔵 OBTENER TODAS LAS RESEÑAS (ADMIN)
// =========================
router.get("/admin", verificarToken, async (req, res) => {
  console.log("Usuario ID:", req.usuarioId);

  const { data: admin, error: errAdmin } = await supabase
    .from("usuario")
    .select("id_rol")
    .eq("id", req.usuarioId)
    .maybeSingle();

  if (errAdmin) {
    console.error("Error verificando admin:", errAdmin);
    return res.status(500).json({ error: errAdmin.message });
  }

  console.log("Resultado admin check:", admin);

  if (!admin || admin.id_rol !== 2) {
    return res.status(403).json({ message: "No tienes permisos" });
  }

  const { data, error } = await supabase
    .from("reseñas")
    .select("*, producto(nombre_producto)")
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error obteniendo reseñas:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(
    data.map((r) => ({
      ...r,
      producto_nombre: r.producto?.nombre_producto,
      producto: undefined,
    }))
  );
});

// =========================
// 🟡 APROBAR/RECHAZAR RESEÑA
// =========================
router.patch("/admin/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const { data: admin, error: errAdmin } = await supabase
    .from("usuario")
    .select("id_rol")
    .eq("id", req.usuarioId)
    .maybeSingle();

  if (errAdmin) return res.status(500).json({ error: errAdmin.message });
  if (!admin || admin.id_rol !== 2) {
    return res.status(403).json({ message: "No tienes permisos" });
  }

  const { data: reseña, error: errReseña } = await supabase
    .from("reseñas")
    .select("producto_id")
    .eq("id", id)
    .maybeSingle();

  if (errReseña) return res.status(500).json({ error: errReseña.message });
  if (!reseña) {
    return res.status(404).json({ message: "Reseña no encontrada" });
  }

  const { error } = await supabase.from("reseñas").update({ estado }).eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  await actualizarCalificacionProducto(reseña.producto_id);

  res.json({ message: "Reseña actualizada correctamente" });
});

module.exports = router;