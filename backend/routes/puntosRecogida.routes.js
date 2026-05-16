const express = require("express");
const router = express.Router();
const connection = require("../config/db");

// GET — Todos los puntos de recogida (opcionalmente filtrar por estado)
router.get("/", (req, res) => {
  const { estado } = req.query;

  let sql = "SELECT * FROM puntos_recogida";
  const params = [];

  if (estado) {
    sql += " WHERE estado = ?";
    params.push(estado);
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error al obtener puntos de recogida:", err);
      return res.status(500).json({ message: "Error interno del servidor", error: err });
    }
    res.json(results);
  });
});

// GET — Un punto de recogida por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "SELECT * FROM puntos_recogida WHERE ID_Punto = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener punto de recogida:", err);
        return res.status(500).json({ message: "Error interno del servidor", error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Punto de recogida no encontrado" });
      }
      res.json(results[0]);
    }
  );
});

// POST — Crear un nuevo punto de recogida
router.post("/", (req, res) => {
  const { nombre, direccion, lat, lng, horario, telefono, estado } = req.body;

  if (!nombre || !direccion || !lat || !lng) {
    return res.status(400).json({ message: "nombre, direccion, lat y lng son obligatorios" });
  }

  connection.query(
    "INSERT INTO puntos_recogida (nombre, direccion, lat, lng, horario, telefono, estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nombre, direccion, lat, lng, horario || null, telefono || null, estado || "abierto"],
    (err, result) => {
      if (err) {
        console.error("Error al crear punto de recogida:", err);
        return res.status(500).json({ message: "Error interno del servidor", error: err });
      }
      res.status(201).json({ message: "Punto de recogida creado exitosamente", id: result.insertId });
    }
  );
});

// PUT — Actualizar estado u otros datos de un punto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, lat, lng, horario, telefono, estado } = req.body;

  const campos = [];
  const valores = [];

  if (nombre !== undefined)    { campos.push("nombre = ?");    valores.push(nombre); }
  if (direccion !== undefined) { campos.push("direccion = ?"); valores.push(direccion); }
  if (lat !== undefined)       { campos.push("lat = ?");       valores.push(lat); }
  if (lng !== undefined)       { campos.push("lng = ?");       valores.push(lng); }
  if (horario !== undefined)   { campos.push("horario = ?");   valores.push(horario); }
  if (telefono !== undefined)  { campos.push("telefono = ?");  valores.push(telefono); }
  if (estado !== undefined)    { campos.push("estado = ?");    valores.push(estado); }

  if (campos.length === 0) {
    return res.status(400).json({ message: "No se enviaron campos para actualizar" });
  }

  valores.push(id);

  connection.query(
    `UPDATE puntos_recogida SET ${campos.join(", ")} WHERE ID_Punto = ?`,
    valores,
    (err, result) => {
      if (err) {
        console.error("Error al actualizar punto de recogida:", err);
        return res.status(500).json({ message: "Error interno del servidor", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Punto de recogida no encontrado" });
      }
      res.json({ message: "Punto de recogida actualizado exitosamente" });
    }
  );
});

// DELETE — Eliminar un punto de recogida
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM puntos_recogida WHERE ID_Punto = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error al eliminar punto de recogida:", err);
        return res.status(500).json({ message: "Error interno del servidor", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Punto de recogida no encontrado" });
      }
      res.json({ message: "Punto de recogida eliminado exitosamente" });
    }
  );
});

module.exports = router;
