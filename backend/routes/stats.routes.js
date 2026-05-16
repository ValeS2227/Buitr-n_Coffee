const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

const SECRET = "secreto123";

// Middleware para verificar token y rol de admin
const verificarAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    // Verificar que sea administrador (ID_Rol = 1)
    const sql = "SELECT ID_Rol FROM usuario WHERE ID_Usuario = ?";
    db.query(sql, [decoded.id], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0 || result[0].ID_Rol !== 1) {
        return res.status(403).json({ message: "No tienes permisos" });
      }
      req.usuarioId = decoded.id;
      next();
    });
  });
};

// =============================================
// 1. ESTADÍSTICAS GENERALES
// =============================================
router.get("/stats", verificarAdmin, (req, res) => {
  const sql = {
    // Total de usuarios
    totalUsuarios: "SELECT COUNT(*) as total FROM usuario",
    // Total de productos activos
    totalProductos: "SELECT COUNT(*) as total FROM producto WHERE Estado = 1",
    // Total de pedidos
    totalPedidos: "SELECT COUNT(*) as total FROM pedido",
    // Total de pedidos pendientes
    pedidosPendientes: "SELECT COUNT(*) as total FROM pedido WHERE Estado = 'Pendiente'",
    // Total de PQRS pendientes
    pqrsPendientes: "SELECT COUNT(*) as total FROM pqrs WHERE Estado = 'pendiente'",
    // Ventas totales
    ventasTotales: "SELECT SUM(Total) as total FROM pedido WHERE Estado = 'Entregado'"
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.query(sql.totalUsuarios, (err, result) => {
        if (err) reject(err);
        else resolve(result[0].total);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sql.totalProductos, (err, result) => {
        if (err) reject(err);
        else resolve(result[0].total);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sql.totalPedidos, (err, result) => {
        if (err) reject(err);
        else resolve(result[0].total);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sql.pedidosPendientes, (err, result) => {
        if (err) reject(err);
        else resolve(result[0].total);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sql.pqrsPendientes, (err, result) => {
        if (err) reject(err);
        else resolve(result[0].total);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sql.ventasTotales, (err, result) => {
        if (err) reject(err);
        else resolve(result[0].total || 0);
      });
    })
  ]).then(([usuarios, productos, pedidos, pendientes, pqrs, ventas]) => {
    res.json({
      success: true,
      data: {
        usuarios,
        productos,
        pedidos,
        pedidos_pendientes: pendientes,
        pqrs_pendientes: pqrs,
        ventas_totales: ventas
      }
    });
  }).catch(err => {
    console.error("Error:", err);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  });
});

// =============================================
// 2. VENTAS POR MES (últimos 6 meses)
// =============================================
router.get("/stats/ventas", verificarAdmin, (req, res) => {
  const sql = `
    SELECT 
      DATE_FORMAT(Fecha, '%Y-%m') as mes,
      COUNT(*) as total_pedidos,
      SUM(Total) as total_ventas
    FROM pedido
    WHERE Estado = 'Entregado'
      AND Fecha >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(Fecha, '%Y-%m')
    ORDER BY mes ASC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({
      success: true,
      data: results
    });
  });
});

// =============================================
// 3. PRODUCTOS MÁS VENDIDOS
// =============================================
router.get("/stats/productos", verificarAdmin, (req, res) => {
  const sql = `
    SELECT 
      p.ID_Producto,
      p.Nombre_producto,
      p.imagen,
      SUM(dp.Cantidad) as total_vendidos,
      SUM(dp.Cantidad * dp.PrecioUnitario) as total_generado
    FROM detalle_pedido dp
    INNER JOIN producto p ON dp.ID_Producto = p.ID_Producto
    INNER JOIN pedido pe ON dp.ID_Pedido = pe.ID_Pedido
    WHERE pe.Estado = 'Entregado'
    GROUP BY p.ID_Producto
    ORDER BY total_vendidos DESC
    LIMIT 10
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({
      success: true,
      data: results
    });
  });
});

module.exports = router;