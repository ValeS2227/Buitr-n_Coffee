const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔐 CLAVE JWT (mejor usar .env en producción)
const SECRET = "secreto123";


// =========================
// 🟢 REGISTRO
// =========================
router.post("/register", async (req, res) => {
  const { Nombre_usuario, Apellido, Correo, Documento, Telefono, Clave } = req.body;

  if (!Nombre_usuario || !Apellido || !Correo || !Clave) {
    return res.status(400).json({ message: "Campos obligatorios faltantes" });
  }

  try {
    // 🔍 Verificar si el usuario ya existe
    const checkSql = "SELECT * FROM usuario WHERE Correo = ?";
    db.query(checkSql, [Correo], async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.status(400).json({ message: "El correo ya está registrado" });
      }

      // 🔐 Encriptar contraseña
      const hashedPassword = await bcrypt.hash(Clave, 10);

      const sql = `
        INSERT INTO usuario 
        (Nombre_usuario, Apellido, Correo, Documento, Telefono, Clave, ID_Rol)
        VALUES (?,?,?,?,?,?,2)
      `;

      db.query(
        sql,
        [Nombre_usuario, Apellido, Correo, Documento, Telefono, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json(err);

          res.status(201).json({ message: "Usuario registrado correctamente" });
        }
      );
    });

  } catch (error) {
    res.status(500).json(error);
  }
});


// =========================
// 🔵 LOGIN
// =========================
router.post("/login", (req, res) => {
  const { Correo, Clave } = req.body;

  if (!Correo || !Clave) {
    return res.status(400).json({ message: "Correo y contraseña requeridos" });
  }

  const sql = "SELECT * FROM usuario WHERE Correo = ?";

  db.query(sql, [Correo], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "Usuario no existe" });
    }

    const user = result[0];

    // 🔐 Validar contraseña
    const validPassword = await bcrypt.compare(Clave, user.Clave);

    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 🎟 Token
    const token = jwt.sign(
      { id: user.ID_Usuario },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        ID_Usuario: user.ID_Usuario,
        Nombre_usuario: user.Nombre_usuario,
        Apellido: user.Apellido,
        Correo: user.Correo,
        Documento: user.Documento,
        Telefono: user.Telefono
      }
    });
  });
});


// =========================
// 🟡 PERFIL (GET)
// =========================
router.get("/perfil", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const sql = "SELECT * FROM usuario WHERE ID_Usuario=?";

    db.query(sql, [decoded.id], (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result[0]);
    });
  });
});


// =========================
// 🟠 PERFIL (PUT)
// =========================
router.put("/perfil", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const { Nombre_usuario, Correo, Documento, Telefono } = req.body;

    const sql = `
      UPDATE usuario
      SET Nombre_usuario=?, Correo=?, Documento=?, Telefono=?
      WHERE ID_Usuario=?
    `;

    db.query(
      sql,
      [Nombre_usuario, Correo, Documento, Telefono, decoded.id],
      (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Usuario actualizado correctamente" });
      }
    );
  });
});

module.exports = router;