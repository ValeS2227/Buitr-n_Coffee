const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { enviarCorreoAlertaStock } = require("../utils/emailService");

// Middleware para verificar token
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const jwt = require("jsonwebtoken");
  const SECRET = process.env.JWT_SECRET || "secreto123";

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
    req.usuarioId = decoded.id;
    req.usuarioRol = decoded.rol;
    next();
  });
};

// =============================================
// GET: Resumen productos (más vendidos + stock bajo)
// =============================================
router.get("/resumen-productos", verificarToken, (req, res) => {
  const esAdmin = req.usuarioRol === 1;

  if (!esAdmin) {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Solo administradores."
    });
  }

  const sqlTopVendidos = `
    SELECT 
      p.ID_Producto,
      p.Nombre_producto,
      p.Precio,
      p.imagen,
      SUM(dp.Cantidad) AS TotalVendido
    FROM detalle_pedido dp
    INNER JOIN producto p ON dp.ID_Producto = p.ID_Producto
    INNER JOIN pedido pe ON dp.ID_Pedido = pe.ID_Pedido
    WHERE pe.Estado = 'Entregado'
    GROUP BY p.ID_Producto
    ORDER BY TotalVendido DESC
    LIMIT 10
  `;

  const sqlStockBajo = `
    SELECT 
      ID_Producto,
      Nombre_producto,
      Stock,
      Precio,
      imagen,
      CASE 
        WHEN Stock <= 0 THEN 'Crítico - Sin stock'
        WHEN Stock <= 5 THEN 'Muy bajo'
        ELSE 'Bajo'
      END AS nivel_stock
    FROM producto
    WHERE Stock <= 10
    ORDER BY Stock ASC
  `;

  Promise.all([
    new Promise((resolve, reject) => {
      db.query(sqlTopVendidos, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(sqlStockBajo, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    })
  ])
  .then(([productosMasVendidos, productosStockBajo]) => {

    if (productosStockBajo.length > 0) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@buitroncoffee.com";
      const adminNombre = "Administrador Buitrón Coffee";

      const alertaHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <div style="background: #e67e22; padding: 20px; text-align: center;">
            <h1 style="color: white;">⚠️ Alerta de Stock Bajo</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd;">
            <h2>Productos con stock bajo:</h2>
            <ul>
              ${productosStockBajo.map(p => `
                <li><strong>${p.Nombre_producto}</strong> - Stock: ${p.Stock} (${p.nivel_stock})</li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;

      enviarCorreoAlertaStock(adminEmail, adminNombre, productosStockBajo, alertaHtml)
        .catch(err => console.error("Error al enviar correo:", err));
    }

    res.json({
      success: true,
      data: {
        productos_mas_vendidos: productosMasVendidos,
        productos_stock_bajo: productosStockBajo,
        total_mas_vendidos: productosMasVendidos.length,
        total_stock_bajo: productosStockBajo.length
      }
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas"
    });
  });
});

// =============================================
// GET: Top productos
// =============================================
router.get("/top-productos", verificarToken, (req, res) => {
  const sql = `
    SELECT 
      p.ID_Producto,
      p.Nombre_producto,
      p.Precio,
      p.imagen,
      SUM(dp.Cantidad) AS TotalVendido
    FROM detalle_pedido dp
    INNER JOIN producto p ON dp.ID_Producto = p.ID_Producto
    INNER JOIN pedido pe ON dp.ID_Pedido = pe.ID_Pedido
    WHERE pe.Estado = 'Entregado' AND p.Estado = 1
    GROUP BY p.ID_Producto
    ORDER BY TotalVendido DESC
    LIMIT 10
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener estadísticas"
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});


// =============================================
// 🔥 POST NUEVO: Alerta de stock (DIFERENTE AL GET)
// =============================================
router.post("/alerta-stock", verificarToken, (req, res) => {
  const esAdmin = req.usuarioRol === 1;

  if (!esAdmin) {
    return res.status(403).json({
      success: false,
      message: "Solo administradores"
    });
  }

  const sql = `
    SELECT ID_Producto, Nombre_producto, Stock
    FROM producto
    WHERE Stock <= 10
    ORDER BY Stock ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error consultando stock"
      });
    }

    if (results.length === 0) {
      return res.json({
        success: true,
        message: "No hay productos con stock bajo"
      });
    }

    const alertas = results.map(p =>
      `${p.Nombre_producto} tiene solo ${p.Stock} unidades`
    );

    res.json({
      success: true,
      message: "Alerta generada correctamente",
      alertas
    });
  });
});

module.exports = router;