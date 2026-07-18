const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { enviarFacturaWhatsApp } = require("../utils/whatsappService");

const SECRET = "secreto123";

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

const verificarAdmin = (req, res, next) => {
  const checkAdminSql = "SELECT ID_Rol FROM usuario WHERE ID_Usuario = ?";
  db.query(checkAdminSql, [req.usuarioId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error al verificar permisos" });
    if (result.length === 0 || result[0].ID_Rol !== 1) {
      return res.status(403).json({ message: "No tienes permisos de administrador" });
    }
    next();
  });
};

/**
 * @swagger
 * tags:
 *   name: WhatsApp
 *   description: Envío de facturas de pedidos por WhatsApp (Admin)
 */

/**
 * @swagger
 * /whatsapp/enviar-factura/{pedidoId}:
 *   post:
 *     summary: Enviar la factura de un pedido por WhatsApp (Admin)
 *     description: >
 *       Envía un resumen/factura del pedido al número de WhatsApp indicado,
 *       usando la API oficial de Meta (WhatsApp Cloud API). Solo administradores.
 *     tags: [WhatsApp]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [telefono]
 *             properties:
 *               telefono:
 *                 type: string
 *                 example: "3196160291"
 *     responses:
 *       200:
 *         description: Factura enviada correctamente
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al enviar el mensaje de WhatsApp
 */
router.post("/enviar-factura/:pedidoId", verificarToken, verificarAdmin, async (req, res) => {
  const { pedidoId } = req.params;
  const { telefono } = req.body;

  if (!telefono) {
    return res.status(400).json({ message: "Debes indicar un número de teléfono" });
  }

  const sqlPedido = `
    SELECT p.ID_Pedido, p.Fecha, p.Subtotal, p.Total, p.Estado, p.Pagado,
           u.Nombre_usuario, u.Apellido, u.Correo
    FROM pedido p
    JOIN usuario u ON p.ID_Usuario = u.ID_Usuario
    WHERE p.ID_Pedido = ?
  `;

  db.query(sqlPedido, [pedidoId], (err, pedidoResult) => {
    if (err) {
      console.error("Error al obtener pedido:", err);
      return res.status(500).json({ message: "Error al obtener el pedido" });
    }

    if (pedidoResult.length === 0) {
      return res.status(404).json({ message: `El pedido #${pedidoId} no existe` });
    }

    const pedido = pedidoResult[0];
    const usuario = { Nombre_usuario: pedido.Nombre_usuario, Apellido: pedido.Apellido };

    const sqlItems = `
      SELECT dp.Cantidad, dp.PrecioUnitario, pr.Nombre_producto
      FROM detalle_pedido dp
      INNER JOIN producto pr ON dp.ID_Producto = pr.ID_Producto
      WHERE dp.ID_Pedido = ?
    `;

    db.query(sqlItems, [pedidoId], async (err2, items) => {
      if (err2) {
        console.error("Error al obtener items del pedido:", err2);
        return res.status(500).json({ message: "Error al obtener los productos del pedido" });
      }

      try {
        await enviarFacturaWhatsApp({ telefono, pedido, usuario, items });
        res.json({ message: `Factura del pedido #${pedidoId} enviada por WhatsApp correctamente` });
      } catch (error) {
        console.error("Error al enviar WhatsApp:", error.response?.data || error.message);
        res.status(500).json({
          message:
            error.response?.data?.error?.message ||
            error.message ||
            "Error al enviar el mensaje de WhatsApp",
        });
      }
    });
  });
});

module.exports = router;