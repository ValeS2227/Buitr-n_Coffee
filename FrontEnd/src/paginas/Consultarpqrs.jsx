import { useEffect, useState } from "react";
import "../estilos/consulta.css";
import { Link } from "react-router-dom";

function Consultarpqrs() {
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
          <span className="active">Bienvenido a tu Consulta PQRS</span>
        </div>
        <p>Ingresa tu número de referencia para consultar el estado de tu PQRS:</p>
        <form className="pqrs-form">
          <label htmlFor="referencia">Número de referencia:</label>
            <input type="text" id="referencia" name="referencia" placeholder="0856391325" />
            <button type="submit">Consultar</button>
        </form>
      </section>
      <section className="section">
        <div className="tabs">
          <span className="active">Estado de tu PQRS:</span>
        </div>
        <p>Aquí podrás ver el estado actual de tu PQRS una vez que hayas ingresado tu número de referencia.</p>
      </section>

      <footer className="footer">
          <p>&copy; 2026 Buitrón Coffee. Todos los derechos reservados</p>
        </footer>
    </div>
  );
}

export default Consultarpqrs;
