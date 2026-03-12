import "../styles/Index.css"
import "../styles/productos.css"
import React from "react"

function ProductoSinLogin() {

  return (

    <div>

      <div className="top-banner">
        Encontrarás descuentos si te registras, ¡Aprovechalo!
      </div>

      <header>

        <div className="header-logo">
          <h1><i>Buitrón Coffee</i></h1>
        </div>

        <div className="header-icons">
          <button>Inicia Sesión</button>
        </div>

      </header>

      <section className="producto-detalle">

        <div className="producto-container">

          <div className="producto-imagen">
            <img src="/img/cafe1.jpeg" alt=""/>
          </div>

          <div className="producto-info">

            <h1 className="producto-titulo">
              Café Molido
            </h1>

            <div className="producto-precio">
              Desde $60.000
            </div>

            <button className="btn-regresar">
              ← Regresar
            </button>

          </div>

        </div>

      </section>

    </div>

  )
}

export default ProductoSinLogin