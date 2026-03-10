const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let productos = [
  { id: 1, nombre: "Cafe Molido", precio: 60000 },
  { id: 2, nombre: "Cafe en Grano", precio: 65000 },
  { id: 3, nombre: "Cafe Especial", precio: 70000 }
]

let pedidos = []

app.get("/api/productos", (req, res) => {
  res.json(productos)
})

app.post("/api/pedidos", (req, res) => {

  const pedido = req.body

  pedidos.push(pedido)

  res.json({
    mensaje: "Pedido guardado correctamente"
  })

})

app.get("/api/pedidos", (req, res) => {
  res.json(pedidos)
})

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000")
})