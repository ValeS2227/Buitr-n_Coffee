import "../estilos/catalogo.css"
import logob from "../assets/logob.png"
import cafe1 from "../assets/cafe1.jpeg"
import cafe2 from "../assets/cafe2.jpeg"
import cafe3 from "../assets/cafe3.jpeg"

function IndexRegistrado() {
  return (
    <div className="catalogo">

      <div className="topbar">
        ENVÍOS GRATIS DESDE $50.000
      </div>

      <header className="header">

        <img 
          className="logo-img" 
          src={logob}
          alt="logo"
        />

        <div className="logo-header">
          Buitrón Coffee
        </div>

        <div className="icons">

          <div className="search-box">
            <input type="text" placeholder="Buscar producto"/>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          <i className="fa-solid fa-cart-shopping"></i>
          <i className="fa-solid fa-user"></i>

        </div>

      </header>

      <nav className="nav">
        <button>Inicio</button>
        <button>No se q poner</button>
        <button>No se q poner2</button>
      </nav>

      <div className="hero"></div>

      <section className="section">

        <div className="tabs">
          <span className="active">Productos</span>
          <span>Promociones</span>
        </div>

        <div className="cards">

          <div className="card">
            <img src={cafe1} alt="cafe"/>
            <h3>Café Tostado</h3>
            <button>Ver más</button>
          </div>

          <div className="card">
            <img src={cafe1} alt="cafe"/>
            <h3>Café Molido</h3>
            <button>Ver más</button>
          </div>

          <div className="card">
            <img src={cafe1} alt="cafe"/>
            <h3>Cafe Fino</h3>
            <button>Ver más</button>
          </div>

        </div>
      </section>
    </div>
  )
}
export default IndexRegistrado