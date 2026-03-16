const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Obtener todos los productos
router.get("/", (req, res) => {

  const sql = "SELECT * FROM producto";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

module.exports = router;