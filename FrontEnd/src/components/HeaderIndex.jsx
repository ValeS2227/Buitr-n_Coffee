import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../config.js";
import "../estilos/header.css";

function HeaderIndex() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const handleUserClick = () => {
    navigate("/login");
  };

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

          <div onClick={handleUserClick} style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
      </header>

      <nav className="nav">
        <Link to="/">
          <button>Inicio</button>
        </Link>
      </nav>
    </>
  );
}

export default HeaderIndex;