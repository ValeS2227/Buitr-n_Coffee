const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

const mapProducto = (producto) => ({
  ID_Producto: producto.id,
  Nombre_producto: producto.nombre_producto,
  Descripcion: producto.descripcion,
  Categoria: producto.categoria,
  Precio: producto.precio,
  Stock: producto.stock,
  imagen: producto.imagen,
  Estado: producto.estado,
  ID_Proveedor: producto.id_proveedor,
  calificacion_promedio: producto.calificacion_promedio,
  total_resenas: producto.total_resenas,
  ...(producto.usuario !== undefined && {
    Nombre_Proveedor: producto.usuario?.nombre_usuario ?? null,
    Apellido_Proveedor: producto.usuario?.apellido ?? null,
  }),
});

const validarProducto = (body) => {
  const nombre = typeof body.Nombre_producto === "string" ? body.Nombre_producto.trim() : "";
  const categoria = typeof body.Categoria === "string" ? body.Categoria.trim() : "";
  const precio = Number(body.Precio);
  const stock = Number(body.Stock);

  if (!nombre || !categoria) return "Nombre y categoría son obligatorios";
  if (!Number.isFinite(precio) || precio <= 0) return "El precio debe ser mayor a 0";
  if (!Number.isInteger(stock) || stock < 0) {
    return "El stock debe ser un entero mayor o igual a 0";
  }

  return null;
};

const responderError = (res, accion, error) => {
  console.error(`Error al ${accion}:`, error);
  return res.status(500).json({ message: `Error al ${accion}` });
};

// Lista completa para administración, incluye productos inactivos.
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("producto")
    .select("*, usuario(nombre_usuario, apellido)")
    .order("id", { ascending: false });

  if (error) return responderError(res, "obtener productos", error);
  return res.json((data || []).map(mapProducto));
});

// Lista pública de productos activos.
router.get("/activos", async (req, res) => {
  const { data, error } = await supabase
    .from("producto")
    .select("*, usuario(nombre_usuario, apellido)")
    .eq("estado", true)
    .order("id", { ascending: false });

  if (error) return responderError(res, "obtener productos activos", error);
  return res.json((data || []).map(mapProducto));
});

router.get("/buscar/:texto", async (req, res) => {
  const texto = req.params.texto.trim();
  const { data, error } = await supabase
    .from("producto")
    .select("*")
    .ilike("nombre_producto", `%${texto}%`);

  if (error) return responderError(res, "buscar productos", error);
  return res.json((data || []).map(mapProducto));
});

router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("producto")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (error) return responderError(res, "obtener producto", error);
  if (!data) return res.status(404).json({ message: "Producto no encontrado" });
  return res.json(mapProducto(data));
});

router.post("/", async (req, res) => {
  const errorValidacion = validarProducto(req.body || {});
  if (errorValidacion) return res.status(400).json({ message: errorValidacion });

  const { Nombre_producto, Descripcion, Categoria, Precio, Stock, imagen, ID_Proveedor } = req.body;
  const { data, error } = await supabase
    .from("producto")
    .insert({
      nombre_producto: Nombre_producto.trim(),
      descripcion: typeof Descripcion === "string" ? Descripcion.trim() || null : null,
      categoria: Categoria.trim(),
      precio: Number(Precio),
      stock: Number(Stock),
      imagen: typeof imagen === "string" ? imagen.trim() || null : null,
      estado: true,
      id_proveedor: ID_Proveedor || null,
    })
    .select("id")
    .single();

  if (error) return responderError(res, "crear producto", error);
  return res.status(201).json({
    message: "Producto creado correctamente",
    id: data.id,
  });
});

router.put("/:id", async (req, res) => {
  const errorValidacion = validarProducto(req.body || {});
  if (errorValidacion) return res.status(400).json({ message: errorValidacion });

  const { Nombre_producto, Descripcion, Categoria, Precio, Stock, imagen, ID_Proveedor } = req.body;
  const { data, error } = await supabase
    .from("producto")
    .update({
      nombre_producto: Nombre_producto.trim(),
      descripcion: typeof Descripcion === "string" ? Descripcion.trim() || null : null,
      categoria: Categoria.trim(),
      precio: Number(Precio),
      stock: Number(Stock),
      imagen: typeof imagen === "string" ? imagen.trim() || null : null,
      id_proveedor: ID_Proveedor || null,
    })
    .eq("id", req.params.id)
    .select("id");

  if (error) return responderError(res, "actualizar producto", error);
  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  return res.json({ message: "Producto actualizado correctamente" });
});

router.patch("/:id/inhabilitar", async (req, res) => {
  const { data, error } = await supabase
    .from("producto")
    .update({ estado: false })
    .eq("id", req.params.id)
    .select("id");

  if (error) return responderError(res, "inhabilitar producto", error);
  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  return res.json({ message: "Producto inhabilitado correctamente" });
});

router.patch("/:id/habilitar", async (req, res) => {
  const { data, error } = await supabase
    .from("producto")
    .update({ estado: true })
    .eq("id", req.params.id)
    .select("id");

  if (error) return responderError(res, "habilitar producto", error);
  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  return res.json({ message: "Producto habilitado correctamente" });
});

router.delete("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("producto")
    .delete()
    .eq("id", req.params.id)
    .select("id");

  if (error) return responderError(res, "eliminar producto", error);
  if (!data || data.length === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  return res.json({ message: "Producto eliminado correctamente" });
});

module.exports = router;
