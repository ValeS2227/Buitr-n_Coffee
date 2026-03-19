import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../estilos/detalle.css";

function ProductoDetalle() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState("");

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

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className="catalogo">

      <div className="topbar">
        ENVÍOS GRATIS DESDE $50.000
      </div>

      <header className="header">
        <img
          className="logo-img"
          src="http://localhost:3001/imagenes/logob.png"
          alt="logo"
        />

        <div 
          className="logo-header" 
          onClick={() => navigate("/catalogo")} 
          style={{ cursor: "pointer" }}
        >
          Buitrón Coffee
        </div>

        <div className="icons">
          <div className="search-box">
            <input type="text" placeholder="Buscar producto" />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          <Link to="/usuario">
            <i className="fa-solid fa-user"></i>
          </Link>

          <i className="fa-solid fa-cart-shopping"></i>
        </div>
      </header>

      <nav className="nav">
        <Link to="/catalogo">
          <button>Inicio</button>
        </Link>
        <Link to="/pqrs">
          <button>PQRS</button>
        </Link>
      </nav>

      {/* 🔥 HERO CORRECTO */}
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
            Desde ${producto.Precio}
          </div>

          <button onClick={() => navigate(-1)}>
            ← Regresar
          </button>
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

    </div>
  );
}

export default ProductoDetalle;