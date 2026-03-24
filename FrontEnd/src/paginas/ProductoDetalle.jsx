import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import "../estilos/detalle.css";
import HeaderGlobal from "../components/HeaderGlobal";
import Footer from "../components/Footer";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState("");
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:3001/api/productos/${id}`)
      .then(res => res.json())
      .then(data => setProducto(data));
  }, [id]);

  const cargarResenas = () => {
    fetch(`http://localhost:3001/api/resenas/${id}`)
      .then(res => res.json())
      .then(data => setResenas(data));
  };

  useEffect(() => {
    cargarResenas();
  }, [id]);

  const enviarResena = () => {
    if (!nombre || !comentario) return;

    fetch("http://localhost:3001/api/resenas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        producto_id: id,
        nombre,
        comentario
      })
    })
    .then(res => res.json())
    .then(() => {
      setNombre("");
      setComentario("");
      cargarResenas();
    });
  };

  const handleAgregarCarrito = async () => {
    await agregarAlCarrito(id, cantidad);
  };

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="catalogo">
      
      <HeaderGlobal />

      <div className="hero"></div>

      <div className="detalle-card">
        <img
          src={`http://localhost:3001/imagenes/${producto.imagen}`}
          alt={producto.Nombre_producto}
        />

        <div>
          <h1>{producto.Nombre_producto}</h1>

          <p>Estado: <span className="activo">ACTIVO</span></p>

          <p>Nivel tostado: {producto.Categoria}</p>

          <p>⭐⭐⭐⭐☆ 4.5</p>

          <div className="precio">
            ${producto.Precio}
          </div>

          {/* Selector de cantidad */}
          <div className="cantidad-selector">
            <label>Cantidad: </label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              style={{ width: "60px", marginRight: "10px" }}
            />
          </div>

          {/* Botones */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={handleAgregarCarrito} style={{ marginRight: "10px" }}>
              🛒 Añadir al carrito
            </button>
            <button onClick={() => navigate(-1)}>
              ← Regresar
            </button>
          </div>
        </div>
      </div>

      <div className="reseñas">
        <h2>Reseñas</h2>
        {resenas.map((r) => (
          <div key={r.id} className="review">
            <strong>{r.nombre}</strong>
            <p>{r.comentario}</p>
          </div>
        ))}
      </div>

      <div className="form">
        <h3>Deja tu reseña</h3>
        <input
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          placeholder="Escribe tu opinión..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
        <button onClick={enviarResena}>
          Comentar
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default ProductoDetalle;