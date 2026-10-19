const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secreto123";

// Middleware para verificar token
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token requerido" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.usuarioId = decoded.id;
    req.usuarioRol = decoded.rol;
    next();
  });
};

// =========================
// 🟢 CREAR PQRS (Público con autenticación opcional)
// =========================
router.post("/", async (req, res) => {
  const { nombre, email, telefono, tipo, descripcion, codigo_referencia, id_usuario } = req.body;

  if (!nombre || !email || !tipo || !descripcion || !codigo_referencia) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const { data, error } = await supabase
    .from("pqrs")
    .insert({
      codigo_referencia,
      id_usuario: id_usuario || null,
      nombre,
      email,
      telefono: telefono || null,
      tipo,
      descripcion,
      estado: "pendiente",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error al crear PQRS:", error);
    return res.status(500).json({ message: "Error al crear PQRS" });
  }

  res.status(201).json({
    message: "PQRS creada correctamente",
    id: data.id,
    codigo_referencia,
  });
});

// =========================
// 🔵 CONSULTAR PQRS POR CÓDIGO (Público)
// =========================
router.get("/consultar/:codigo", async (req, res) => {
  const codigo = req.params.codigo;

  const { data, error } = await supabase
    .from("pqrs")
    .select("codigo_referencia, tipo, descripcion, estado, fecha_creacion, respuesta")
    .eq("codigo_referencia", codigo)
    .maybeSingle();

  if (error) return res.status(500).json(error);

  if (!data) {
    return res.status(404).json({ message: "No se encontró ninguna PQRS con ese código" });
  }

  res.json({
    Codigo_Referencia: data.codigo_referencia,
    Tipo: data.tipo,
    Descripcion: data.descripcion,
    Estado: data.estado,
    Fecha_Creacion: data.fecha_creacion,
    Respuesta: data.respuesta,
  });
});

// =========================
// 🔵 OBTENER PQRS POR USUARIO (Usuario autenticado)
// =========================
router.get("/mis-pqrs", verificarToken, async (req, res) => {
  const usuarioId = req.usuarioId;

  const { data, error } = await supabase
    .from("pqrs")
    .select("id, codigo_referencia, tipo, descripcion, estado, fecha_creacion, respuesta")
    .eq("id_usuario", usuarioId)
    .order("fecha_creacion", { ascending: false });

  if (error) {
    console.error("Error al obtener PQRS del usuario:", error);
    return res.status(500).json({ message: "Error al obtener tus PQRS" });
  }

  res.json(
    data.map((p) => ({
      ID_PQRS: p.id,
      Codigo_Referencia: p.codigo_referencia,
      Tipo: p.tipo,
      Descripcion: p.descripcion,
      Estado: p.estado,
      Fecha_Creacion: p.fecha_creacion,
      Respuesta: p.respuesta,
    }))
  );
});

// =========================
// 🔵 OBTENER TODAS LAS PQRS (SOLO ADMIN)
// =========================
router.get("/admin", verificarToken, async (req, res) => {
  // Verificar que es admin
  if (req.usuarioRol !== 2) {
    return res.status(403).json({ message: "No tienes permisos para ver PQRS" });
  }

  // FK id_usuario es nullable -> Supabase hace el equivalente a un LEFT JOIN
  const { data, error } = await supabase
    .from("pqrs")
    .select("*, usuario(nombre_usuario, correo)")
    .order("fecha_creacion", { ascending: false });

  if (error) return res.status(500).json(error);

  res.json(
    data.map((p) => ({
      ID_PQRS: p.id,
      Codigo_Referencia: p.codigo_referencia,
      ID_Usuario: p.id_usuario,
      Nombre: p.nombre,
      Email: p.email,
      Telefono: p.telefono,
      Tipo: p.tipo,
      Descripcion: p.descripcion,
      Estado: p.estado,
      Fecha_Creacion: p.fecha_creacion,
      Fecha_Actualizacion: p.fecha_actualizacion,
      Respuesta: p.respuesta,
      UsuarioNombre: p.usuario?.nombre_usuario ?? null,
      UsuarioCorreo: p.usuario?.correo ?? null,
    }))
  );
});

// =========================
// 🟡 ACTUALIZAR ESTADO DE PQRS (SOLO ADMIN)
// =========================
router.patch("/admin/:id", verificarToken, async (req, res) => {
  if (req.usuarioRol !== 2) {
    return res.status(403).json({ message: "No tienes permisos" });
  }

  const { id } = req.params;
  const { estado, respuesta } = req.body;

  const { data, error } = await supabase
    .from("pqrs")
    .update({ estado, respuesta: respuesta || null })
    .eq("id", id)
    .select("id");

  if (error) return res.status(500).json(error);

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "PQRS no encontrada" });
  }

  res.json({ message: "PQRS actualizada correctamente" });
});

module.exports = router;