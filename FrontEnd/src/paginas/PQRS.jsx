import { useEffect, useState } from "react";
import "../estilos/pqrs.css";
import { Link } from "react-router-dom";
import HeaderGlobal from "../components/HeaderGlobal";

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
      <HeaderGlobal />

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
