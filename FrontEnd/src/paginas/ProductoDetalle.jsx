
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL, getImagen } from "../config.js";
import HeaderGlobal from "../components/HeaderGlobal";
import Footer from "../components/Footer";
import ResenasProducto from "../components/ResenasProducto";
import { useCarrito } from "../context/CarritoContext";
import "../estilos/productodetalle.css";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    fetch(`${API_URL}/api/productos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo cargar el producto");
        }
        return res.json();
      })
      .then((data) => {
        console.log("PRODUCTO RECIBIDO:", data);
        console.log("IMAGEN RECIBIDA:", data.imagen);

        setProducto(data);
      })
      .catch((err) => {
        console.error("Error al cargar producto:", err);
      });
  }, [id]);

  const renderEstrellas = (calificacion) => {
    const estrellas = [];
    const num = Number(calificacion) || 0;

    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span
          key={i}
          className={
            i <= Math.round(num)
              ? "estrella-llena"
              : "estrella-vacia"
          }
        >
          ★
        </span>
      );
    }

    return estrellas;
  };

  if (!producto) {
    return (
      <div className="producto-detalle">
        <HeaderGlobal />
        <div className="loading">Cargando producto...</div>
        <Footer />
      </div>
    );
  }

  // Obtener el nombre o ruta de la imagen
  const imagenProducto =
    producto.imagen ||
    producto.Imagen ||
    producto.imagen_url ||
    producto.url_imagen;

  // Construir URL de Supabase
  const urlImagen = getImagen(imagenProducto);

  console.log("URL FINAL DE LA IMAGEN:", urlImagen);

  return (
    <div className="producto-detalle">
      <HeaderGlobal />

      <div className="detalle-container">
        <div className="detalle-imagen">
          <img
            src={urlImagen}
            alt={producto.Nombre_producto || "Imagen del producto"}
            onError={(e) => {
              console.error("ERROR AL CARGAR IMAGEN:", e.target.src);
              e.target.onerror = null;
              e.target.src = "/sin-imagen.png";
            }}
          />
        </div>

        <div className="detalle-info">
          <h1>{producto.Nombre_producto}</h1>

          <div className="producto-calificacion">
            <div className="estrellas">
              {renderEstrellas(producto.calificacion_promedio)}
            </div>

            <span className="calificacion-numero">
              {Number(producto.calificacion_promedio || 0).toFixed(1)}
            </span>

            <span className="total-resenas">
              ({producto.total_resenas || 0} reseñas)
            </span>
          </div>

          <p className="detalle-descripcion">
            {producto.Descripcion || "Sin descripción disponible"}
          </p>

          <p className="detalle-categoria">
            📂 Categoría: {producto.Categoria}
          </p>

          <p className="detalle-stock">
            📦 Stock disponible: {producto.Stock} unidades
          </p>

          <p className="detalle-precio">
            ${Number(producto.Precio).toLocaleString("es-CO")}
          </p>

          <div className="detalle-cantidad">
            <label>Cantidad:</label>

            <input
              type="number"
              min="1"
              max={producto.Stock}
              value={cantidad}
              onChange={(e) => {
                const valor = Number(e.target.value);

                if (valor >= 1 && valor <= producto.Stock) {
                  setCantidad(valor);
                }
              }}
            />
          </div>

          <button
            type="button"
            className="btn-agregar-carrito"
            onClick={() =>
              agregarAlCarrito(producto.ID_Producto, cantidad)
            }
            disabled={!producto.Stock || producto.Stock < 1}
          >
            {producto.Stock > 0
              ? "Agregar al carrito"
              : "Producto agotado"}
          </button>
        </div>
      </div>

      <ResenasProducto productoId={producto.ID_Producto} />

      <Footer />
    </div>
  );
}

export default ProductoDetalle;
