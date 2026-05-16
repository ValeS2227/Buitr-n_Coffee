import { useEffect, useState, useRef } from "react";
import "../estilos/puntosrecogida.css";
import HeaderGlobal from "../components/HeaderGlobal";
import Footer from "../components/Footer";

// Colores por estado del punto
const COLORES = {
  abierto: "#28a745",
  ocupado: "#ffc107",
  cerrado: "#dc3545",
};

function PuntosRecogida() {
  const [puntos, setPuntos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [puntoActivo, setPuntoActivo] = useState(null);

  const mapaRef = useRef(null);
  const marcadoresRef = useRef([]);

  // ── Cargar puntos desde la API ──────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/puntos-recogida`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo conectar con el servidor");
        return res.json();
      })
      .then((data) => {
        setPuntos(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  // ── Inicializar el mapa Leaflet una vez que lleguen los puntos ───────────
  useEffect(() => {
    if (cargando || error || puntos.length === 0) return;

    // Cargar Leaflet CSS dinámicamente (por si no está en index.html)
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Cargar Leaflet JS dinámicamente
    const cargarLeaflet = () => {
      return new Promise((resolve) => {
        if (window.L) { resolve(window.L); return; }
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => resolve(window.L);
        document.head.appendChild(script);
      });
    };

    cargarLeaflet().then((L) => {
      // Evitar doble inicialización
      if (mapaRef.current) {
        mapaRef.current.remove();
        mapaRef.current = null;
      }

      const contenedor = document.getElementById("mapa-recogida");
      if (!contenedor) return;

      // Centro inicial: promedio de coordenadas
      const latPromedio = puntos.reduce((s, p) => s + parseFloat(p.lat), 0) / puntos.length;
      const lngPromedio = puntos.reduce((s, p) => s + parseFloat(p.lng), 0) / puntos.length;

      const mapa = L.map("mapa-recogida").setView([latPromedio, lngPromedio], 6);
      mapaRef.current = mapa;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa);

      // Agregar marcadores
      marcadoresRef.current = puntos.map((punto) => {
        const color = COLORES[punto.estado] || "#888";

        const icono = L.divIcon({
          className: "",
          html: `<div style="
            width:22px; height:22px; border-radius:50%;
            background:${color}; border:3px solid white;
            box-shadow:0 2px 6px rgba(0,0,0,0.4);
          "></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          popupAnchor: [0, -14],
        });

        const popup = `
          <div style="min-width:180px; font-family:sans-serif;">
            <strong style="font-size:1rem; color:#2c1a0e;">${punto.nombre}</strong><br/>
            <span style="font-size:0.82rem; color:#555;">📍 ${punto.direccion}</span><br/>
            ${punto.horario ? `<span style="font-size:0.78rem; color:#777;">🕐 ${punto.horario}</span><br/>` : ""}
            ${punto.telefono ? `<span style="font-size:0.78rem; color:#777;">📞 ${punto.telefono}</span><br/>` : ""}
            <span style="
              display:inline-block; margin-top:6px;
              padding:2px 10px; border-radius:12px; font-size:0.72rem; font-weight:600;
              background:${color}22; color:${color === "#ffc107" ? "#856404" : color};
              text-transform:uppercase;
            ">${punto.estado}</span>
          </div>`;

        const marcador = L.marker([punto.lat, punto.lng], { icon: icono })
          .addTo(mapa)
          .bindPopup(popup);

        marcador.on("click", () => setPuntoActivo(punto.ID_Punto));
        return { id: punto.ID_Punto, marcador };
      });
    });

    // Cleanup al desmontar
    return () => {
      if (mapaRef.current) {
        mapaRef.current.remove();
        mapaRef.current = null;
      }
    };
  }, [puntos, cargando, error]);

  // ── Volar al marcador cuando se selecciona una tarjeta ───────────────────
  const seleccionarPunto = (punto) => {
    setPuntoActivo(punto.ID_Punto);
    if (mapaRef.current) {
      mapaRef.current.setView([punto.lat, punto.lng], 14, { animate: true });
      const ref = marcadoresRef.current.find((m) => m.id === punto.ID_Punto);
      if (ref) ref.marcador.openPopup();
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="puntos-recogida">
      <HeaderGlobal />

      <div className="puntos-hero">
        <h1>☕ Puntos de Recogida</h1>
        <p>Encuentra el punto más cercano para recoger tu café Buitrón</p>
      </div>

      {cargando && (
        <div className="puntos-loading">Cargando puntos de recogida...</div>
      )}

      {error && (
        <div className="puntos-error">
          Error al cargar los puntos: {error}
        </div>
      )}

      {!cargando && !error && (
        <div className="puntos-container">
          {/* Lista lateral */}
          <div className="puntos-lista">
            <h2>📋 Listado de puntos</h2>

            {puntos.length === 0 ? (
              <p style={{ color: "#888" }}>No hay puntos registrados aún.</p>
            ) : (
              puntos.map((punto) => (
                <div
                  key={punto.ID_Punto}
                  className={`punto-card ${puntoActivo === punto.ID_Punto ? "activo" : ""}`}
                  onClick={() => seleccionarPunto(punto)}
                >
                  <div className="punto-card-header">
                    <span className="punto-nombre">{punto.nombre}</span>
                    <span className={`punto-badge badge-${punto.estado}`}>
                      {punto.estado}
                    </span>
                  </div>
                  <p className="punto-direccion">📍 {punto.direccion}</p>
                  {punto.horario && (
                    <p className="punto-horario">🕐 {punto.horario}</p>
                  )}
                  {punto.telefono && (
                    <p className="punto-telefono">📞 {punto.telefono}</p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Mapa */}
          <div className="puntos-mapa-wrapper">
            <h2>🗺️ Mapa interactivo</h2>
            <div id="mapa-recogida" />

            <div className="puntos-leyenda">
              <div className="leyenda-item">
                <span className="leyenda-circulo abierto" />
                Abierto
              </div>
              <div className="leyenda-item">
                <span className="leyenda-circulo ocupado" />
                Ocupado
              </div>
              <div className="leyenda-item">
                <span className="leyenda-circulo cerrado" />
                Cerrado
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default PuntosRecogida;
