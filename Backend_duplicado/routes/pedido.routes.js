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

// 🟢 OBTENER HISTORIAL DE COMPRAS DEL USUARIO
router.get("/historial", verificarToken, async (req, res) => {
  const usuarioId = req.usuarioId;

  // GROUP_CONCAT no existe en supabase-js: se trae el detalle anidado
  // (detalle_pedido -> producto) y se agrupa/formatea en JS.
  const { data: results, error } = await supabase
    .from("pedido")
    .select(
      "id, fecha, subtotal, envio, total, estado, direccion, metodo_pago, detalle_pedido(id, producto(nombre_producto))"
    )
    .eq("id_usuario", usuarioId)
    .order("fecha", { ascending: false });

  if (error) return res.status(500).json(error);

  const pedidos = results.map((p) => ({
    ID_Pedido: p.id,
    Fecha: p.fecha,
    Subtotal: p.subtotal,
    Envio: p.envio,
    Total: p.total,
    Estado: p.estado,
    Direccion: p.direccion,
    MetodoPago: p.metodo_pago,
    CantidadProductos: p.detalle_pedido.length,
    ProductosLista: p.detalle_pedido.map((d) => d.producto.nombre_producto),
  }));

  res.json(pedidos);
});

// 🟢 OBTENER DETALLE DE UN PEDIDO ESPECÍFICO
router.get("/detalle/:pedidoId", verificarToken, async (req, res) => {
  const usuarioId = req.usuarioId;
  const pedidoId = req.params.pedidoId;

  const { data: p, error } = await supabase
    .from("pedido")
    .select(
      "id, fecha, subtotal, envio, total, estado, direccion, metodo_pago, detalle_pedido(cantidad, precio_unitario, producto(id, nombre_producto, imagen, descripcion))"
    )
    .eq("id", pedidoId)
    .eq("id_usuario", usuarioId)
    .maybeSingle();

  if (error) return res.status(500).json(error);

  if (!p) {
    return res.status(404).json({ message: "Pedido no encontrado" });
  }

  const pedido = {
    ID_Pedido: p.id,
    Fecha: p.fecha,
    Subtotal: p.subtotal,
    Envio: p.envio,
    Total: p.total,
    Estado: p.estado,
    Direccion: p.direccion,
    MetodoPago: p.metodo_pago,
    items: p.detalle_pedido.map((item) => ({
      ID_Producto: item.producto.id,
      Nombre_producto: item.producto.nombre_producto,
      Cantidad: item.cantidad,
      PrecioUnitario: item.precio_unitario,
      imagen: item.producto.imagen,
      Descripcion: item.producto.descripcion,
    })),
  };

  res.json(pedido);
});

// 🟢 REGISTRAR COMPRA (mover productos del carrito a pedido)
// Se registra en dos rutas porque el frontend llama a la raíz "/api/pedidos"
router.post(["/", "/registrar"], verificarToken, async (req, res) => {
  const usuarioId = req.usuarioId;
  const { direccion, metodoPago = "Efectivo" } = req.body;

  try {
    // Primero obtener los items del carrito
    const { data: carritoItems, error: errCarrito } = await supabase
      .from("carrito")
      .select("id, cantidad, producto(id, precio, nombre_producto)")
      .eq("id_usuario", usuarioId);

    if (errCarrito) return res.status(500).json(errCarrito);

    if (!carritoItems || carritoItems.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    const subtotal = carritoItems.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
    const envio = subtotal >= 50000 ? 0 : 5000;
    const total = subtotal + envio;
    const fecha = new Date();
    const fechaLimite = new Date(fecha.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 días, igual que el resto de tus pedidos

    // Crear el pedido
    const { data: nuevoPedido, error: errPedido } = await supabase
      .from("pedido")
      .insert({
        id_usuario: usuarioId,
        fecha: fecha.toISOString(),
        subtotal,
        envio,
        total,
        estado: "Pendiente",
        direccion: direccion || "No especificada",
        metodo_pago: metodoPago,
        fecha_limite: fechaLimite.toISOString(),
      })
      .select("id")
      .single();

    if (errPedido) return res.status(500).json(errPedido);

    const pedidoId = nuevoPedido.id;

    // Insertar los detalles del pedido
    const detalles = carritoItems.map((item) => ({
      id_pedido: pedidoId,
      id_producto: item.producto.id,
      cantidad: item.cantidad,
      precio_unitario: item.producto.precio,
    }));

    const { error: errDetalle } = await supabase.from("detalle_pedido").insert(detalles);

    if (errDetalle) return res.status(500).json(errDetalle);

    // Vaciar el carrito
    const { error: errVaciar } = await supabase.from("carrito").delete().eq("id_usuario", usuarioId);

    if (errVaciar) return res.status(500).json(errVaciar);

    // Obtener datos completos para el recibo
    const { data: pedidoCompleto, error: errCompleto } = await supabase
      .from("pedido")
      .select(
        "id, fecha, subtotal, envio, total, usuario(id, nombre_usuario, apellido, correo, documento, telefono), detalle_pedido(cantidad, precio_unitario, producto(id, nombre_producto, imagen))"
      )
      .eq("id", pedidoId)
      .single();

    if (errCompleto) return res.status(500).json(errCompleto);

    const items = pedidoCompleto.detalle_pedido.map((detalle) => ({
      ID_Producto: detalle.producto.id,
      Nombre_producto: detalle.producto.nombre_producto,
      Cantidad: detalle.cantidad,
      Precio: detalle.precio_unitario,
      imagen: detalle.producto.imagen,
    }));

    const usuario = {
      ID_Usuario: pedidoCompleto.usuario.id,
      Nombre_usuario: pedidoCompleto.usuario.nombre_usuario,
      Apellido: pedidoCompleto.usuario.apellido,
      Correo: pedidoCompleto.usuario.correo,
      Documento: pedidoCompleto.usuario.documento,
      Telefono: pedidoCompleto.usuario.telefono,
    };

    res.json({
      message: "Compra registrada exitosamente",
      ID_Pedido: pedidoId,
      fecha_limite: fechaLimite.toISOString(),
      pedido: {
        id: pedidoId,
        fecha: fecha.toISOString(),
        subtotal,
        envio,
        total,
        items,
        usuario,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// =========================
// 🔵 ADMIN: OBTENER TODOS LOS PEDIDOS
// =========================
router.get("/admin/todos", verificarToken, async (req, res) => {
  const { data: admin, error: errAdmin } = await supabase
    .from("usuario")
    .select("id_rol")
    .eq("id", req.usuarioId)
    .maybeSingle();

  if (errAdmin) return res.status(500).json(errAdmin);
  if (!admin || admin.id_rol !== 2) {
    return res.status(403).json({ message: "No tienes permisos" });
  }

  const { data, error } = await supabase
    .from("pedido")
    .select(
      "id, fecha, total, estado, fecha_limite, usuario(nombre_usuario, apellido, correo, telefono), detalle_pedido(id)"
    )
    .order("fecha", { ascending: false });

  if (error) return res.status(500).json(error);

  const pedidos = data.map((p) => ({
    ID_Pedido: p.id,
    Nombre_usuario: p.usuario?.nombre_usuario,
    Apellido: p.usuario?.apellido,
    Correo: p.usuario?.correo,
    Telefono: p.usuario?.telefono,
    Fecha: p.fecha,
    CantidadProductos: p.detalle_pedido.length,
    Total: p.total,
    Estado: p.estado,
    Fecha_Limite: p.fecha_limite,
  }));

  res.json(pedidos);
});

// =========================
// 🔵 ADMIN: VER DETALLE DE UN PEDIDO (lista plana de items)
// =========================
router.get("/admin/detalle/:pedidoId", verificarToken, async (req, res) => {
  const { data: admin, error: errAdmin } = await supabase
    .from("usuario")
    .select("id_rol")
    .eq("id", req.usuarioId)
    .maybeSingle();

  if (errAdmin) return res.status(500).json(errAdmin);
  if (!admin || admin.id_rol !== 2) {
    return res.status(403).json({ message: "No tienes permisos" });
  }

  const { data, error } = await supabase
    .from("detalle_pedido")
    .select("cantidad, precio_unitario, producto(nombre_producto, descripcion, imagen)")
    .eq("id_pedido", req.params.pedidoId);

  if (error) return res.status(500).json(error);

  const items = data.map((d) => ({
    Nombre_producto: d.producto.nombre_producto,
    Descripcion: d.producto.descripcion,
    imagen: d.producto.imagen,
    Cantidad: d.cantidad,
    PrecioUnitario: d.precio_unitario,
  }));

  res.json(items);
});

// =========================
// 🟡 ADMIN: CAMBIAR ESTADO DE UN PEDIDO
// =========================
router.patch("/admin/estado/:pedidoId", verificarToken, async (req, res) => {
  const { data: admin, error: errAdmin } = await supabase
    .from("usuario")
    .select("id_rol")
    .eq("id", req.usuarioId)
    .maybeSingle();

  if (errAdmin) return res.status(500).json(errAdmin);
  if (!admin || admin.id_rol !== 2) {
    return res.status(403).json({ message: "No tienes permisos" });
  }

  const { estado } = req.body;

  const { error } = await supabase.from("pedido").update({ estado }).eq("id", req.params.pedidoId);

  if (error) return res.status(500).json(error);

  res.json({ message: "Estado actualizado correctamente" });
});

module.exports = router;