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

// 🟢 OBTENER CARRITO DEL USUARIO
router.get("/", verificarToken, async (req, res) => {
  const usuarioId = req.usuarioId;

  const { data: results, error } = await supabase
    .from("carrito")
    .select("id, cantidad, producto(id, nombre_producto, precio, imagen, descripcion)")
    .eq("id_usuario", usuarioId);

  if (error) return res.status(500).json(error);

  // Aplana la relación producto(...) al mismo formato plano que ya devolvía MySQL
  const items = results.map((c) => ({
    ID_Carrito: c.id,
    Cantidad: c.cantidad,
    ID_Producto: c.producto.id,
    Nombre_producto: c.producto.nombre_producto,
    Precio: c.producto.precio,
    imagen: c.producto.imagen,
    Descripcion: c.producto.descripcion,
  }));

  // Calcular total
  const total = items.reduce((sum, item) => sum + item.Precio * item.Cantidad, 0);

  res.json({ items, total });
});

// 🟢 AGREGAR PRODUCTO AL CARRITO
router.post("/agregar", verificarToken, async (req, res) => {
  const usuarioId = req.usuarioId;
  const { productoId, cantidad = 1 } = req.body;

  if (!productoId) {
    return res.status(400).json({ message: "ID de producto requerido" });
  }

  // Verificar si el producto ya está en el carrito
  const { data: existente, error: errCheck } = await supabase
    .from("carrito")
    .select("id, cantidad")
    .eq("id_usuario", usuarioId)
    .eq("id_producto", productoId)
    .maybeSingle();

  if (errCheck) return res.status(500).json(errCheck);

  if (existente) {
    // Actualizar cantidad
    const nuevaCantidad = existente.cantidad + cantidad;

    const { error: errUpdate } = await supabase
      .from("carrito")
      .update({ cantidad: nuevaCantidad })
      .eq("id", existente.id);

    if (errUpdate) return res.status(500).json(errUpdate);

    return res.json({ message: "Cantidad actualizada" });
  }

  // Insertar nuevo producto
  const { error: errInsert } = await supabase
    .from("carrito")
    .insert({ id_usuario: usuarioId, id_producto: productoId, cantidad });

  if (errInsert) return res.status(500).json(errInsert);

  res.json({ message: "Producto agregado al carrito" });
});

// 🟢 ACTUALIZAR CANTIDAD
router.put("/actualizar/:itemId", verificarToken, async (req, res) => {
  const itemId = req.params.itemId;
  const { cantidad } = req.body;

  if (cantidad < 1) {
    return res.status(400).json({ message: "La cantidad debe ser al menos 1" });
  }

  const { error } = await supabase
    .from("carrito")
    .update({ cantidad })
    .eq("id", itemId)
    .eq("id_usuario", req.usuarioId);

  if (error) return res.status(500).json(error);

  res.json({ message: "Cantidad actualizada" });
});

// 🟢 ELIMINAR PRODUCTO DEL CARRITO
router.delete("/eliminar/:itemId", verificarToken, async (req, res) => {
  const itemId = req.params.itemId;

  const { error } = await supabase
    .from("carrito")
    .delete()
    .eq("id", itemId)
    .eq("id_usuario", req.usuarioId);

  if (error) return res.status(500).json(error);

  res.json({ message: "Producto eliminado del carrito" });
});

// 🟢 VACIAR CARRITO
router.delete("/vaciar", verificarToken, async (req, res) => {
  const { error } = await supabase.from("carrito").delete().eq("id_usuario", req.usuarioId);

  if (error) return res.status(500).json(error);

  res.json({ message: "Carrito vaciado" });
});

module.exports = router;