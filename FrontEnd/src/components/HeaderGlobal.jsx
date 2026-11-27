import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useState } from "react";
import { API_URL } from "../config.js";
import "../estilos/header.css";

function GlobalHeader() {
  const navigate = useNavigate();
  const { carrito } = useCarrito();
  const [busqueda, setBusqueda] = useState("");

  const totalItems = carrito.items.reduce((sum, item) => sum + item.Cantidad, 0);

  const handleBuscar = (event) => {
    event.preventDefault();

    if (busqueda.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(busqueda)}`);
      setBusqueda("");
    }
  };

  return (
    <>
      <div className="topbar">ENVÍOS GRATIS DESDE $50.000</div>

      <header className="header">
        <img
          className="logo-img"
          src={`${API_URL}/imagenes/logob.png`}
          alt="logo"
        />

        <div 
          className="logo-header"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Buitrón Coffee
        </div>

        <div className="icons">
          <form className="search-box" onSubmit={handleBuscar}>
            <input 
              type="search" 
              placeholder="Buscar producto" 
              aria-label="Buscar producto"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button type="submit" className="search-submit" aria-label="Buscar">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            </button>
          </form>

          <Link to="/usuario">
            <i className="fa-solid fa-user"></i>
          </Link>

          <Link to="/carrito" className="carrito-icon">
            <i className="fa-solid fa-cart-shopping"></i>
            {totalItems > 0 && (
              <span className="carrito-contador">{totalItems}</span>
            )}
          </Link>
        </div>
      </header>

      <nav className="nav">
        <Link to="/catalogo">
          <button>Inicio</button>
        </Link>
        <Link to="/nosotros">
          <button>Nosotros</button>
        </Link>
        <Link to="/pqrs">
          <button>PQRS</button>
        </Link>
      </nav>
    </>
  );
}

export default GlobalHeader;