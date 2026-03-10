import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/indexregistrado.css";

function IndexRegistrado() {

  const navigate = useNavigate();

  useEffect(() => {

    const boton = document.getElementById("btn-gracias");
    const modal = document.getElementById("bienvenida");

    if (boton && modal) {
      boton.onclick = () => {
        modal.style.display = "none";
      };
    }

  }, []);

  return (

    <div className="pagina">

      {/* MODAL */}
      <div id="bienvenida" className="modal">
        <div className="modal-box">

          <h1>Café Buitrón</h1>

          <p>
            Bienvenido a <br />
            Café Buitrón
          </p>

          <button id="btn-gracias">
            GRACIAS
          </button>

        </div>
      </div>


      {/* HEADER */}
      <header className="header">

        <h1 className="logo">
          Café Buitrón
        </h1>

        <input
          type="text"
          placeholder="Buscar producto..."
          className="buscador"
        />

      </header>


      {/* CATEGORIAS */}
      <section className="categorias">

        <button className="categoria">
          Ideales para ti
        </button>

        <button className="categoria">
          Café por Mayor
        </button>

      </section>


      {/* PRODUCTOS */}
      <section className="productos">

        <div className="card">

          <img
            src="/src/assets/molido.jpg"
            alt="Café Molido"
            className="imagen-producto"
          />

          <h3>Café Molido</h3>
          <p>Desde $60.000</p>

          <button onClick={() => navigate("/producto")}>
            VER
          </button>

        </div>


        <div className="card">

          <img
            src="/src/assets/grano.jpg"
            alt="Café en grano"
            className="imagen-producto"
          />

          <h3>Grano</h3>
          <p>Desde $65.000</p>

          <button onClick={() => navigate("/producto")}>
            VER
          </button>

        </div>


        <div className="card">

          <img
            src="/src/assets/especial.jpg"
            alt="Grano Especial"
            className="imagen-producto"
          />

          <h3>Grano Especial</h3>
          <p>Desde $70.000</p>

          <button onClick={() => navigate("/producto")}>
            VER
          </button>

        </div>

      </section>

    </div>

  );

}

export default IndexRegistrado;