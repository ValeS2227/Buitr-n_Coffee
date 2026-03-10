import "../styles/producto.css";

function Producto() {

  return (

    <div className="producto-container">

      <div className="producto-card">

        <img
          src="/src/assets/molido.jpg"
          alt="Café Molido"
          className="producto-img"
        />

        <div className="producto-info">

          <h1>Café Molido</h1>

          <h2>$60.000</h2>

          <p>
            Café molido 100% colombiano de alta calidad.
          </p>

          <button className="btn-carrito">
            Agregar al carrito
          </button>

        </div>

      </div>

    </div>

  );

}

export default Producto;