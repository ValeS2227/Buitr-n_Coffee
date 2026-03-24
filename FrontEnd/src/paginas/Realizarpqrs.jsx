import "../estilos/realizar.css";
import { Link } from "react-router-dom";
import HeaderGlobal from "../components/HeaderGlobal";

function Realizarpqrs() {
  return (
    <div className="catalogo">
      <HeaderGlobal />
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
