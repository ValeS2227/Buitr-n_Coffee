import { useEffect, useState } from "react";
import "../estilos/catalogo.css";
import { Link, useNavigate } from "react-router-dom";
import HeaderGlobal from "../components/HeaderGlobal";
import Footer from "../components/Footer";

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate(); // ✅ agregado

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
          <span className="active">Productos</span>
        </div>

        <div className="cards">
          {productos.map((producto) => (
            <div key={producto.ID_Producto} className="card">
              <img
                src={`http://localhost:3001/imagenes/${producto.imagen}`}
                alt={producto.Nombre_producto}
              />

              <h3>{producto.Nombre_producto}</h3>

              <p>{producto.Descripcion}</p>

              <strong>${producto.Precio}</strong>

              {/* ✅ CORREGIDO */}
              <button onClick={() => navigate(`/producto/${producto.ID_Producto}`)}>
                Ver más
              </button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Catalogo;