import React, { useState } from "react";
import "../estilos/carrito.css";

const Carrito = () => {
  const [productos, setProductos] = useState([
    // Ejemplo de productos (puedes traerlos de tu backend)
    { id: 1, nombre: "Café Espresso", precio: 5000, cantidad: 1, imagen: "https://via.placeholder.com/100x170" },
    { id: 2, nombre: "Capuccino", precio: 7000, cantidad: 1, imagen: "https://via.placeholder.com/100x170" }
  ]);

  const [resultado, setResultado] = useState("");

  const cambiarCantidad = (id, nuevaCantidad) => {
    setProductos(productos.map(p =>
      p.id === id ? { ...p, cantidad: nuevaCantidad } : p
    ));
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  const generarRecibo = () => {
    let total = 0;

    const detalle = productos.map(p => {
      const subtotal = p.precio * p.cantidad;
      total += subtotal;
      return `${p.nombre} x${p.cantidad} = $${subtotal}`;
    }).join("\n");

    setResultado(`${detalle}\n\nTotal: $${total}`);
  };

  return (
    <>
      <header className="nav">
        <button onClick={() => window.location.href = "/catalogo"}>
          Regresar al Inicio
        </button>
        <h2>Buitrón Coffee</h2>
      </header>

      <main className="container">
        <h2 className="titulo">Bienvenido al carrito</h2>

        <div className="productos">
          {productos.map(producto => (
            <div key={producto.id} className="card">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="imagen-producto"
              />
              <h3>{producto.nombre}</h3>
              <p>${producto.precio}</p>

              <input
                type="number"
                value={producto.cantidad}
                min="1"
                onChange={(e) =>
                  cambiarCantidad(producto.id, parseInt(e.target.value))
                }
              />

              <div>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="recibo">
          <button onClick={generarRecibo}>Obtener recibo</button>
          <div id="resultado" style={{ whiteSpace: "pre-line" }}>
            {resultado}
          </div>
        </div>
      </main>
    </>
  );
};

export default Carrito;