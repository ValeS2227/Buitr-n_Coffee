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


// 🟢 CREAR PEDIDO
router.post("/", verificarToken, async (req, res) => {
  const usuarioId = req.usuarioId;
  const { items, subtotal, total } = req.body;

  console.log("📦 Creando pedido para usuario:", usuarioId);
  console.log("Items:", items?.length || 0);
  console.log("Subtotal:", subtotal);
  console.log("Total:", total);

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "El pedido no tiene productos" });
  }

  const fecha = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + 2);

  const sqlPedido = `
    INSERT INTO pedido (ID_Usuario, Fecha, Subtotal, Total, Estado, Fecha_Limite, Pagado)
    VALUES (?, ?, ?, ?, 'Pendiente', ?, 0)
  `;

  db.query(sqlPedido, [usuarioId, fecha, subtotal, total, fechaLimite], (err, result) => {
    if (err) {
      console.error("Error al crear pedido:", err);
      return res.status(500).json({ message: "Error al crear pedido", error: err.message });
    }

    const pedidoId = result.insertId;

    const detalles = items.map(item => [
      pedidoId,
      item.ID_Producto,
      item.Cantidad,
      item.PrecioUnitario || item.Precio
    ]);

    const sqlDetalle = `
      INSERT INTO detalle_pedido (ID_Pedido, ID_Producto, Cantidad, PrecioUnitario)
      VALUES ?
    `;

    db.query(sqlDetalle, [detalles], (err) => {
      if (err) {
        console.error("Error al crear detalles:", err);
        return res.status(500).json({ message: "Error al crear detalles del pedido" });
      }

      const updateStock = items.map(item => {
        return new Promise((resolve, reject) => {
          const sqlStock = "UPDATE producto SET Stock = Stock - ? WHERE ID_Producto = ?";
          db.query(sqlStock, [item.Cantidad, item.ID_Producto], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });

      Promise.all(updateStock)
        .then(() => {
          res.status(201).json({
            message: "Pedido creado correctamente",
            ID_Pedido: pedidoId,
            fecha: fecha,
            fecha_limite: fechaLimite
          });
        })
        .catch(err => {
          console.error("Error al actualizar stock:", err);
          res.status(500).json({ message: "Error al actualizar stock" });
        });
    });
  });
});

// =========================
//  CANCELAR PEDIDOS VENCIDOS (CRON JOB)
// =========================
router.post("/cancelar-vencidos", (req, res) => {
  const sql = `
    SELECT p.ID_Pedido, p.ID_Usuario, 
           GROUP_CONCAT(dp.ID_Producto, ':', dp.Cantidad SEPARATOR ',') as productos
    FROM pedido p
    INNER JOIN detalle_pedido dp ON p.ID_Pedido = dp.ID_Pedido
    WHERE p.Estado = 'Pendiente' 
      AND p.Fecha_Limite < NOW()
      AND p.Pagado = 0
    GROUP BY p.ID_Pedido
  `;

  db.query(sql, (err, pedidosVencidos) => {
    if (err) {
      console.error("Error al buscar pedidos vencidos:", err);
      return res.status(500).json({ message: "Error al procesar" });
    }

    let actualizados = 0;

    if (pedidosVencidos.length === 0) {
      return res.json({ message: "No hay pedidos vencidos", actualizados: 0 });
    }

    // Procesar cada pedido vencido
    pedidosVencidos.forEach(pedido => {
      // Cambiar estado a Cancelado
      const updateSql = "UPDATE pedido SET Estado = 'Cancelado' WHERE ID_Pedido = ?";
      db.query(updateSql, [pedido.ID_Pedido], (err) => {
        if (err) console.error("Error al cancelar pedido:", err);
      });

      // Devolver stock
      const productos = pedido.productos.split(',');
      productos.forEach(item => {
        const [productoId, cantidad] = item.split(':');
        const stockSql = "UPDATE producto SET Stock = Stock + ? WHERE ID_Producto = ?";
        db.query(stockSql, [parseInt(cantidad), productoId], (err) => {
          if (err) console.error("Error al devolver stock:", err);
        });
      });

      actualizados++;
    });

    res.json({ 
      message: "Pedidos vencidos cancelados", 
      actualizados: actualizados 
    });
  });
});

// 🟢 OBTENER HISTORIAL DE PEDIDOS DEL USUARIO
router.get("/historial", verificarToken, (req, res) => {
  const usuarioId = req.usuarioId;

  const sql = `
    SELECT 
      p.ID_Pedido,
      p.Fecha,
      p.Fecha_Limite,
      p.Subtotal,
      p.Total,
      p.Estado,
      p.Pagado,
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
    if (err) {
      console.error("Error en historial:", err);
      return res.status(500).json({ message: "Error al obtener historial", error: err.message });
    }

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

  // Primero obtener información del pedido
  const sqlPedido = `
    SELECT ID_Pedido, Fecha, Subtotal, Total, Estado, Fecha_Limite, Pagado
    FROM pedido
    WHERE ID_Pedido = ? AND ID_Usuario = ?
  `;

  db.query(sqlPedido, [pedidoId, usuarioId], (err, pedidoResult) => {
    if (err) {
      console.error("Error al obtener pedido:", err);
      return res.status(500).json({ message: "Error al obtener pedido" });
    }

    if (pedidoResult.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const pedido = pedidoResult[0];

    // Obtener productos del pedido
    const sqlProductos = `
      SELECT 
        dp.ID_Producto,
        dp.Cantidad,
        dp.PrecioUnitario,
        pr.Nombre_producto,
        pr.imagen,
        pr.Descripcion
      FROM detalle_pedido dp
      INNER JOIN producto pr ON dp.ID_Producto = pr.ID_Producto
      WHERE dp.ID_Pedido = ?
    `;

    db.query(sqlProductos, [pedidoId], (err, productosResult) => {
      if (err) {
        console.error("Error al obtener productos:", err);
        return res.status(500).json({ message: "Error al obtener productos del pedido" });
      }

      const items = productosResult.map(item => ({
        ID_Producto: item.ID_Producto,
        Nombre_producto: item.Nombre_producto,
        Cantidad: item.Cantidad,
        PrecioUnitario: item.PrecioUnitario,
        imagen: item.imagen,
        Descripcion: item.Descripcion
      }));

      res.json({
        ID_Pedido: pedido.ID_Pedido,
        Fecha: pedido.Fecha,
        Subtotal: pedido.Subtotal,
        Total: pedido.Total,
        Estado: pedido.Estado,
        Fecha_Limite: pedido.Fecha_Limite,
        Pagado: pedido.Pagado,
        items: items
      });
    });
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

// 🟢 OBTENER TODOS LOS PEDIDOS (SOLO ADMIN)
router.get("/admin/todos", verificarToken, (req, res) => {
  const checkAdminSql = "SELECT ID_Rol FROM usuario WHERE ID_Usuario = ?";
  
  db.query(checkAdminSql, [req.usuarioId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0 || result[0].ID_Rol !== 1) {
      return res.status(403).json({ message: "No tienes permisos" });
    }

    const sql = `
      SELECT 
        p.ID_Pedido,
        p.Fecha,
        p.Fecha_Limite,
        p.Subtotal,
        p.Total,
        p.Estado,
        p.Pagado,
        u.Nombre_usuario,
        u.Apellido,
        u.Correo,
        u.Telefono,
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