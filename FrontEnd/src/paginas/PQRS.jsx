import { useEffect, useState } from "react";
import "../estilos/pqrs.css";
import { Link } from "react-router-dom";

function PQRS() {
  const [productos, setProductos] = useState([]);

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

        <div className="logo-header">Buitrón Coffee</div>

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
          <button >PQRS</button>
        </Link>
      </nav>

      <div className="hero"></div>

      <section className="section">
        <div className="tabs">
          <span className="active">¿Qué quieres hacer?</span>
        </div>
        <div className="cards">
            <div className="card">
                <h3>Realizar una PQRS</h3>
                <p>Si tienes alguna queja, reclamo, sugerencia o felicitación, no dudes en contactarnos.
                    Estamos aquí para escucharte y mejorar tu experiencia con Buitrón Coffee.</p>
                <Link to="/realizarpqrs">
                  <button>Realizar PQRS</button>
                </Link>
            </div>
            <div className="card">
                <h3>Consultar estado de PQRS</h3>
                <p>Si ya has realizado una PQRS y deseas conocer su estado, puedes hacerlo aquí. 
                    Ingresa tu número de referencia para obtener información actualizada sobre tu solicitud.</p>
                <Link to="/consultarpqrs">
                  <button>Consultar estado</button>
                </Link>
            </div>
        </div>
      </section>
      <footer className="footer">
      <p>&copy; 2026 Buitrón Coffee. Todos los derechos reservados.</p>
    </footer>
    </div>
  );
}

export default PQRS;
