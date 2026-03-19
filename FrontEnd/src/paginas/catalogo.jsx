import { useEffect, useState } from "react";
import "../estilos/catalogo.css";
import { Link, useNavigate } from "react-router-dom"; // ✅ agregado

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate(); // ✅ agregado

  useEffect(() => {
    fetch("http://localhost:3001/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="catalogo">
      <div className="topbar">ENVÍOS GRATIS DESDE $50.000</div>

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

      <div className="hero"></div>

      <section className="section">
        <div className="tabs">
          <span className="active">Productos</span>
        </div>

        <div className="cards">
          {productos.map((producto) => (
            <div key={producto.ID_Producto} className="card">
              <img
                src={`http://localhost:3001/imagenes/${producto.imagen}`}
                alt={producto.Nombre_producto}
              />

              <h3>{producto.Nombre_producto}</h3>

              <p>{producto.Descripcion}</p>

              <strong>${producto.Precio}</strong>

              {/* ✅ CORREGIDO */}
              <button onClick={() => navigate(`/producto/${producto.ID_Producto}`)}>
                Ver más
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 Buitrón Coffee. Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default Catalogo;