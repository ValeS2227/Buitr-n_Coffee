const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🟢 OBTENER TODOS LOS PRODUCTOS
router.get("/", (req, res) => {
  db.query("SELECT * FROM producto", (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});

router.get("/buscar/:texto", (req, res) => {
  const texto = req.params.texto;

  db.query(
    "SELECT * FROM producto WHERE Nombre_producto LIKE ?",
    [`%${texto}%`],
    (err, results) => {
      if (err) return res.status(500).json(err);

      res.json(results);
    }
  );
});

module.exports = router;