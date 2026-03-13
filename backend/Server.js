 const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "buitroncoffee",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.log("Error conectando a MySQL:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

app.post("/registrar", (req, res) => {
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const correo = req.body.correo;
  const documento = req.body.documento;
  const telefono = req.body.telefono;
  const clave = req.body.clave;
  const ID_Rol = 1; // 1 = cliente

  const sql = "INSERT INTO usuario (Nombre_usuario,Apellido,Correo,Documento,Telefono,Clave,ID_Rol) VALUES (?,?,?,?,?,?,?)";

  db.query(sql, [nombre, apellido, correo, documento, telefono, clave, ID_Rol], (err, result) => {
    if (err) {
      console.log("ERROR MYSQL:", err);
      res.send("Error");
    } else {
      console.log("Usuario registrado");
      res.send("Usuario registrado");
    }
  });
});

app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});