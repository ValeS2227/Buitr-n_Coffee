import "../estilos/realizar.css";
import { Link } from "react-router-dom";

function Realizarpqrs() {
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
          <button>PQRS</button>
        </Link>
      </nav>
      <div className="hero"></div>
      <section className="section">
        <div className="tabs">
          <span className="active">Describe tu PQRS:</span>
        </div>
        <form className="pqrs-form">
          <label htmlFor="tipo">Tipo de PQRS:</label>
          <select id="tipo" name="tipo">
            <option value="queja">Queja</option>
            <option value="reclamo">Reclamo</option>
            <option value="sugerencia">Sugerencia</option>
            <option value="felicitacion">Felicitación</option>
          </select>
        </form>
      </section>
      <section className="section">
        <form className="pqrs-form">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            placeholder="Escribe aquí tu Queja, Reclamo, Sugerencia o Felicitación..."
          ></textarea>
        </form>
        <button className="submit-button">Enviar PQRS</button>
      </section>
      <footer className="footer">
          <p>&copy; 2026 Buitrón Coffee. Todos los derechos reservados</p>
        </footer>
    </div>
  );
}

export default Realizarpqrs;
