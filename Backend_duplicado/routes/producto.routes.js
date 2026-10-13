const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secreto123";

// Middleware para verificar token
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

// Traduce una fila (snake_case, con el join opcional a usuario) al formato PascalCase original
const mapProducto = (p) => ({
  ID_Producto: p.id,
  Nombre_producto: p.nombre_producto,
  Descripcion: p.descripcion,
  Categoria: p.categoria,
  Precio: p.precio,
  Stock: p.stock,
  imagen: p.imagen,
  Estado: p.estado,
  ID_Proveedor: p.id_proveedor,
  calificacion_promedio: p.calificacion_promedio,
  total_resenas: p.total_resenas,
  ...(p.usuario !== undefined && {
    Nombre_Proveedor: p.usuario?.nombre_usuario ?? null,
    Apellido_Proveedor: p.usuario?.apellido ?? null,
  }),
});

// 🟢 OBTENER TODOS LOS PRODUCTOS (para admin - incluye inhabilitados)
router.get("/", async (req, res) => {
  // id_proveedor es nullable -> Supabase resuelve el "usuario(...)" como LEFT JOIN
  const { data, error } = await supabase
    .from("producto")
    .select("*, usuario(nombre_usuario, apellido)")
    .order("id", { ascending: false });

  if (error) return res.status(500).json(error);

  res.json(data.map(mapProducto));
});

// 🟢 OBTENER PRODUCTOS ACTIVOS (para el catálogo público)
router.get("/activos", async (req, res) => {
  const { data, error } = await supabase
    .from("producto")
    .select("*, usuario(nombre_usuario, apellido)")
    .eq("estado", true)
    .order("id", { ascending: false });

  if (error) return res.status(500).json(error);

  res.json(data.map(mapProducto));
});

// 🟢 OBTENER UN PRODUCTO POR ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase.from("producto").select("*").eq("id", id).maybeSingle();

  if (error) return res.status(500).json(error);

  if (!data) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json(mapProducto(data));
});

// 🟢 CREAR NUEVO PRODUCTO
router.post("/", async (req, res) => {
  const { Nombre_producto, Descripcion, Categoria, Precio, Stock, imagen, ID_Proveedor } = req.body;

  if (!Nombre_producto || !Categoria || !Precio || Stock === undefined) {
    return res.status(400).json({
      message: "Faltan campos obligatorios: Nombre_producto, Categoria, Precio, Stock",
    });
  }

  const { data, error } = await supabase
    .from("producto")
    .insert({
      nombre_producto: Nombre_producto,
      descripcion: Descripcion || null,
      categoria: Categoria,
      precio: Precio,
      stock: Stock,
      imagen: imagen || null,
      estado: true,
      id_proveedor: ID_Proveedor || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error al crear producto:", error);
    return res.status(500).json({ message: "Error al crear producto" });
  }

  res.status(201).json({
    message: "Producto creado correctamente",
    id: data.id,
  });
});

// 🟡 ACTUALIZAR PRODUCTO
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { Nombre_producto, Descripcion, Categoria, Precio, Stock, imagen, ID_Proveedor } = req.body;

  const { data, error } = await supabase
    .from("producto")
    .update({
      nombre_producto: Nombre_producto,
      descripcion: Descripcion,
      categoria: Categoria,
      precio: Precio,
      stock: Stock,
      imagen: imagen,
      id_proveedor: ID_Proveedor || null,
    })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({ message: "Error al actualizar producto" });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json({ message: "Producto actualizado correctamente" });
});

// 🟠 INHABILITAR PRODUCTO
router.patch("/:id/inhabilitar", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase.from("producto").update({ estado: false }).eq("id", id).select("id");

  if (error) {
    console.error("Error al inhabilitar producto:", error);
    return res.status(500).json({ message: "Error al inhabilitar producto" });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json({ message: "Producto inhabilitado correctamente" });
});

// 🟢 HABILITAR PRODUCTO
router.patch("/:id/habilitar", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase.from("producto").update({ estado: true }).eq("id", id).select("id");

  if (error) {
    console.error("Error al habilitar producto:", error);
    return res.status(500).json({ message: "Error al habilitar producto" });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json({ message: "Producto habilitado correctamente" });
});

// 🔴 ELIMINAR PRODUCTO
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase.from("producto").delete().eq("id", id).select("id");

  if (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({ message: "Error al eliminar producto" });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  res.json({ message: "Producto eliminado correctamente" });
});

router.get("/buscar/:texto", async (req, res) => {
  const texto = req.params.texto;

  // ilike = LIKE case-insensitive, igual que la collation utf8mb4_general_ci de MySQL
  const { data, error } = await supabase.from("producto").select("*").ilike("nombre_producto", `%${texto}%`);

  if (error) return res.status(500).json(error);

  res.json(data.map(mapProducto));
});

module.exports = router;