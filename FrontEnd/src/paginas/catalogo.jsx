
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL, getImagen } from "../config.js";
import "../estilos/catalogo.css";
import HeaderGlobal from "../components/HeaderGlobal";
import Footer from "../components/Footer";

const normalizarTexto = (valor) =>
  String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [errorPromociones, setErrorPromociones] = useState("");
  const [cargando, setCargando] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParam = new URLSearchParams(location.search).get("search") || "";
  const productosFiltrados = useMemo(() => {
    const termino = normalizarTexto(searchParam);

    if (!termino) return productos;

    return productos.filter((producto) =>
      [
        producto.Nombre_producto,
        producto.Descripcion,
        producto.Categoria,
      ].some((campo) => normalizarTexto(campo).includes(termino))
    );
  }, [productos, searchParam]);

  const renderEstrellas = (calificacion) => {
    const estrellas = [];

    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span
          key={i}
          className={
            i <= Math.round(calificacion || 0)
              ? "estrella-llena"
              : "estrella-vacia"
          }
        >
          ★
        </span>
      );
    }

    return estrellas;
  };

  // Cargar productos activos
  useEffect(() => {
    setCargando(true);

    fetch(`${API_URL}/api/productos/activos`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudieron cargar los productos");
        }
        return res.json();
      })
      .then((data) => {
        console.log("PRODUCTOS RECIBIDOS:", data);

        if (!Array.isArray(data)) {
          throw new Error("La respuesta de productos no es válida");
        }

        setProductos(data);

        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setCargando(false);
      });
  }, []);

  // Cargar promociones activas
  useEffect(() => {
    fetch(`${API_URL}/api/promociones/activas`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("No se pudieron cargar las promociones.");
        }

        return response.json();
      })
      .then((result) => {
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error(
            result.message || "Respuesta inválida al cargar promociones."
          );
        }

        setPromociones(result.data);
      })
      .catch((error) => {
        console.error("Error al cargar promociones activas:", error);

        setErrorPromociones(
          error.message || "No se pudieron cargar las promociones."
        );
      });
  }, []);

  if (cargando) {
    return (
      <div className="catalogo">
        <HeaderGlobal />
        <div className="loading">Cargando productos...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="catalogo">
      <HeaderGlobal />

      <div className="pqrs-hero">
        <div className="pqrs-hero-content">
          <h1>Productos</h1>
          <p>
            Encontrarás nuestros productos de la mejor calidad para tu mesa
          </p>
        </div>
      </div>

      {errorPromociones && (
        <p className="catalogo-promociones-error" role="status">
          {errorPromociones}
        </p>
      )}

      {promociones.length > 0 && (
        <section
          className="catalogo-promociones"
          aria-label="Promociones activas"
        >
          <div className="catalogo-promociones-heading">
            <span>OFERTAS VIGENTES</span>
            <h2>Promociones para disfrutar</h2>
          </div>

          <div className="catalogo-promociones-list">
            {promociones.map((promocion) => (
              <article
                className="catalogo-promocion-card"
                key={promocion.ID_Promocion}
              >
                <div className="catalogo-promocion-badge">
                  {promocion.Tipo === "descuento_porcentaje"
                    ? `${promocion.Valor}% OFF`
                    : promocion.Tipo === "descuento_fijo"
                      ? `$${Number(promocion.Valor).toLocaleString()} OFF`
                      : promocion.Tipo === "2x1"
                        ? "2x1"
                        : promocion.Tipo === "puntos_dobles"
                          ? "Puntos dobles"
                          : "Combo"}
                </div>

                <div>
                  <h3>{promocion.Nombre}</h3>

                  {promocion.Descripcion && (
                    <p>{promocion.Descripcion}</p>
                  )}

                  {promocion.Producto_Nombre && (
                    <small>
                      Aplica para: {promocion.Producto_Nombre}
                    </small>
                  )}

                  {promocion.Codigo && (
                    <span className="catalogo-promocion-code">
                      Código: <strong>{promocion.Codigo}</strong>
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="cards">
          {productosFiltrados.length === 0 ? (
            <div className="sin-resultados">
              <p>No se encontraron productos</p>
            </div>
          ) : (
            productosFiltrados.map((producto) => {
              const imagen =
                producto.imagen ||
                producto.Imagen ||
                producto.imagen_url ||
                producto.url_imagen;

              return (
                <div key={producto.ID_Producto} className="card">
                  <img
                    src={getImagen(imagen)}
                    alt={producto.Nombre_producto || "Imagen del producto"}
                    onError={(e) => {
                      console.error(
                        "Error al cargar imagen:",
                        e.target.src
                      );

                      e.target.onerror = null;
                      e.target.src = "/sin-imagen.png";
                    }}
                  />

                  <h3>{producto.Nombre_producto}</h3>

                  <p>{producto.Descripcion}</p>

                  <div className="card-calificacion">
                    {renderEstrellas(producto.calificacion_promedio)}
                  </div>

                  <strong>
                    ${Number(producto.Precio).toLocaleString("es-CO")}
                  </strong>

                  <button
                    onClick={() =>
                      navigate(`/producto/${producto.ID_Producto}`)
                    }
                  >
                    Ver más
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Catalogo;
