require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.log("Error conectando a MySQL:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

app.post("/registrar", (req, res) => {
  const { nombre, apellido, correo, documento, telefono, clave } = req.body;
  const ID_Rol = 1;

  const sql = "INSERT INTO usuario (Nombre_usuario,Apellido,Correo,Documento,Telefono,Clave,ID_Rol) VALUES (?,?,?,?,?,?,?)";

  db.query(sql, [nombre, apellido, correo, documento, telefono, clave, ID_Rol], (err, result) => {
    if (err) {
      console.log("ERROR MYSQL:", err);
      res.status(500).send("Error");
    } else {
      console.log("Usuario registrado");
      res.status(201).send("Usuario registrado");
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});