const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const SECRET = "secreto123";


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

// Agregar estas rutas a tu archivo pedido.routes.js existente

// 🟢 OBTENER HISTORIAL DE COMPRAS DEL USUARIO
router.get("/historial", verificarToken, (req, res) => {
  const usuarioId = req.usuarioId;

  const sql = `
    SELECT 
      p.ID_Pedido,
      p.Fecha,
      p.Subtotal,
      p.Envio,
      p.Total,
      p.Estado,
      p.Direccion,
      p.MetodoPago,
      COUNT(dp.ID_Detalle) as CantidadProductos,
      GROUP_CONCAT(DISTINCT pr.Nombre_producto SEPARATOR '||') as Productos
    FROM pedido p
    INNER JOIN detalle_pedido dp ON p.ID_Pedido = dp.ID_Pedido
    INNER JOIN producto pr ON dp.ID_Producto = pr.ID_Producto
    WHERE p.ID_Usuario = ?
    GROUP BY p.ID_Pedido
    ORDER BY p.Fecha DESC
  `;

  db.query(sql, [usuarioId], (err, results) => {
    if (err) return res.status(500).json(err);

    // Formatear los resultados
    const pedidos = results.map(pedido => ({
      ...pedido,
      ProductosLista: pedido.Productos ? pedido.Productos.split('||') : []
    }));

    res.json(pedidos);
  });
});

// 🟢 OBTENER DETALLE DE UN PEDIDO ESPECÍFICO
router.get("/detalle/:pedidoId", verificarToken, (req, res) => {
  const usuarioId = req.usuarioId;
  const pedidoId = req.params.pedidoId;

  const sql = `
    SELECT 
      p.*,
      dp.Cantidad as ProductoCantidad,
      dp.PrecioUnitario,
      pr.Nombre_producto,
      pr.imagen,
      pr.Descripcion
    FROM pedido p
    INNER JOIN detalle_pedido dp ON p.ID_Pedido = dp.ID_Pedido
    INNER JOIN producto pr ON dp.ID_Producto = pr.ID_Producto
    WHERE p.ID_Pedido = ? AND p.ID_Usuario = ?
  `;

  db.query(sql, [pedidoId, usuarioId], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const pedido = {
      ID_Pedido: results[0].ID_Pedido,
      Fecha: results[0].Fecha,
      Subtotal: results[0].Subtotal,
      Envio: results[0].Envio,
      Total: results[0].Total,
      Estado: results[0].Estado,
      Direccion: results[0].Direccion,
      MetodoPago: results[0].MetodoPago,
      items: results.map(item => ({
        ID_Producto: item.ID_Producto,
        Nombre_producto: item.Nombre_producto,
        Cantidad: item.ProductoCantidad,
        PrecioUnitario: item.PrecioUnitario,
        imagen: item.imagen,
        Descripcion: item.Descripcion
      }))
    };

    res.json(pedido);
  });
});

// 🟢 REGISTRAR COMPRA (mover productos del carrito a pedido)
router.post("/registrar", verificarToken, (req, res) => {
  const usuarioId = req.usuarioId;
  const { direccion, metodoPago = "Efectivo" } = req.body;

  // Primero obtener los items del carrito
  const getCarritoSql = `
    SELECT c.ID_Carrito, c.Cantidad, p.ID_Producto, p.Precio, p.Nombre_producto
    FROM carrito c
    INNER JOIN producto p ON c.ID_Producto = p.ID_Producto
    WHERE c.ID_Usuario = ?
  `;

  db.query(getCarritoSql, [usuarioId], (err, carritoItems) => {
    if (err) return res.status(500).json(err);

    if (carritoItems.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    const subtotal = carritoItems.reduce((sum, item) => sum + (item.Precio * item.Cantidad), 0);
    const envio = subtotal >= 50000 ? 0 : 5000;
    const total = subtotal + envio;
    const fecha = new Date();

    // Crear el pedido
    const insertPedidoSql = `
      INSERT INTO pedido (ID_Usuario, Fecha, Subtotal, Envio, Total, Estado, Direccion, MetodoPago)
      VALUES (?, ?, ?, ?, ?, 'Pendiente', ?, ?)
    `;

    db.query(insertPedidoSql, [usuarioId, fecha, subtotal, envio, total, direccion || 'No especificada', metodoPago], (err, result) => {
      if (err) return res.status(500).json(err);

      const pedidoId = result.insertId;

      // Insertar los detalles del pedido
      const detalles = carritoItems.map(item => [
        pedidoId,
        item.ID_Producto,
        item.Cantidad,
        item.Precio
      ]);

      const insertDetalleSql = `
        INSERT INTO detalle_pedido (ID_Pedido, ID_Producto, Cantidad, PrecioUnitario)
        VALUES ?
      `;

      db.query(insertDetalleSql, [detalles], (err) => {
        if (err) return res.status(500).json(err);

        // Vaciar el carrito
        const vaciarCarritoSql = "DELETE FROM carrito WHERE ID_Usuario = ?";
        db.query(vaciarCarritoSql, [usuarioId], (err) => {
          if (err) return res.status(500).json(err);

          // Obtener datos completos para el recibo
          const getPedidoCompletoSql = `
            SELECT p.*, u.Nombre_usuario, u.Apellido, u.Correo, u.Documento, u.Telefono,
                   dp.Cantidad as DetalleCantidad, dp.PrecioUnitario,
                   pr.Nombre_producto, pr.imagen
            FROM pedido p
            INNER JOIN usuario u ON p.ID_Usuario = u.ID_Usuario
            INNER JOIN detalle_pedido dp ON p.ID_Pedido = dp.ID_Pedido
            INNER JOIN producto pr ON dp.ID_Producto = pr.ID_Producto
            WHERE p.ID_Pedido = ?
          `;

          db.query(getPedidoCompletoSql, [pedidoId], (err, detallesPedido) => {
            if (err) return res.status(500).json(err);

            // Agrupar los items
            const items = detallesPedido.map(detalle => ({
              ID_Producto: detalle.ID_Producto,
              Nombre_producto: detalle.Nombre_producto,
              Cantidad: detalle.DetalleCantidad,
              Precio: detalle.PrecioUnitario,
              imagen: detalle.imagen
            }));

            const usuario = {
              ID_Usuario: detallesPedido[0].ID_Usuario,
              Nombre_usuario: detallesPedido[0].Nombre_usuario,
              Apellido: detallesPedido[0].Apellido,
              Correo: detallesPedido[0].Correo,
              Documento: detallesPedido[0].Documento,
              Telefono: detallesPedido[0].Telefono
            };

            res.json({
              message: "Compra registrada exitosamente",
              pedido: {
                id: pedidoId,
                fecha: fecha,
                subtotal: subtotal,
                envio: envio,
                total: total,
                items: items,
                usuario: usuario
              }
            });
          });
        });
      });
    });
  });
});
// =========================
// 🔵 OBTENER TODOS LOS PEDIDOS (SOLO ADMIN)
// =========================
router.get("/admin/todos", verificarToken, (req, res) => {
  // Verificar que es admin
  const checkAdminSql = "SELECT ID_Rol FROM usuario WHERE ID_Usuario = ?";
  
  db.query(checkAdminSql, [req.usuarioId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].ID_Rol !== 1) {
      return res.status(403).json({ message: "No tienes permisos" });
    }

    const sql = `
      SELECT p.*, u.Nombre_usuario, u.Apellido, u.Correo, u.Telefono,
             (SELECT COUNT(*) FROM detalle_pedido WHERE ID_Pedido = p.ID_Pedido) as CantidadProductos
      FROM pedido p
      JOIN usuario u ON p.ID_Usuario = u.ID_Usuario
      ORDER BY p.Fecha DESC
    `;

    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });
});

// =========================
// 🔵 OBTENER DETALLE DE UN PEDIDO (SOLO ADMIN)
// =========================
router.get("/admin/detalle/:pedidoId", verificarToken, (req, res) => {
  const { pedidoId } = req.params;

  // Verificar que es admin
  const checkAdminSql = "SELECT ID_Rol FROM usuario WHERE ID_Usuario = ?";
  
  db.query(checkAdminSql, [req.usuarioId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].ID_Rol !== 1) {
      return res.status(403).json({ message: "No tienes permisos" });
    }

    const sql = `
      SELECT dp.*, p.Nombre_producto, p.imagen, p.Descripcion
      FROM detalle_pedido dp
      JOIN producto p ON dp.ID_Producto = p.ID_Producto
      WHERE dp.ID_Pedido = ?
    `;

    db.query(sql, [pedidoId], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  });
});

// =========================
// 🟡 ACTUALIZAR ESTADO DE PEDIDO (SOLO ADMIN)
// =========================
router.patch("/admin/estado/:pedidoId", verificarToken, (req, res) => {
  const { pedidoId } = req.params;
  const { estado } = req.body;

  // Verificar que es admin
  const checkAdminSql = "SELECT ID_Rol FROM usuario WHERE ID_Usuario = ?";
  
  db.query(checkAdminSql, [req.usuarioId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].ID_Rol !== 1) {
      return res.status(403).json({ message: "No tienes permisos" });
    }

    const estadosValidos = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    const sql = "UPDATE pedido SET Estado = ? WHERE ID_Pedido = ?";
    db.query(sql, [estado, pedidoId], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      res.json({ message: "Estado actualizado correctamente" });
    });
  });
});

module.exports = router;