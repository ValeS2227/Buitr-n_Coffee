import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/consulta.css";
import HeaderGlobal from "../components/HeaderGlobal";
import Footer from "../components/Footer";

function Consultarpqrs() {
  const [referencia, setReferencia] = useState("");
  const [consultado, setConsultado] = useState(false);
  const [estado, setEstado] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!referencia.trim()) {
      setError("Por favor ingresa un número de referencia");
      return;
    }

    // Simulación de consulta
    // Aquí iría la llamada real a tu API
    setTimeout(() => {
      // Simulación de respuesta
      const estadosSimulados = {
        "0856391325": {
          estado: "En proceso",
          fecha: "2026-03-20",
          detalle: "Tu PQRS está siendo revisada por nuestro equipo",
          tipo: "Queja"
        },
        "0856391326": {
          estado: "Resuelta",
          fecha: "2026-03-22", 
          detalle: "Tu PQRS ha sido resuelta satisfactoriamente",
          tipo: "Sugerencia"
        },
        "0856391327": {
          estado: "Pendiente",
          fecha: "2026-03-23",
          detalle: "Esperando respuesta del área correspondiente",
          tipo: "Reclamo"
        }
      };

      const resultado = estadosSimulados[referencia];
      if (resultado) {
        setEstado(resultado);
        setConsultado(true);
      } else {
        setError("No se encontró ninguna PQRS con ese número de referencia");
        setConsultado(false);
      }
    }, 1000);
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case "En proceso": return "warning";
      case "Resuelta": return "success";
      case "Pendiente": return "info";
      default: return "default";
    }
  };

  return (
    <div className="consultar-pqrs-page">
      <HeaderGlobal />

      <div className="pqrs-hero-small">
        <div className="pqrs-hero-content">
          <h1>Consultar PQRS</h1>
          <p>Conoce el estado de tu solicitud</p>
        </div>
      </div>

      <section className="consulta-section">
        <div className="container">
          <div className="consulta-wrapper">
            <div className="consulta-form">
              <h2>Consulta tu PQRS</h2>
              <p>Ingresa el número de referencia que recibiste al realizar tu PQRS</p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="referencia">Número de referencia</label>
                  <input
                    type="text"
                    id="referencia"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Ej: 0856391325"
                    className="form-control"
                  />
                </div>
                
                {error && (
                  <div className="alert alert-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                  </div>
                )}
                
                <button type="submit" className="btn-consultar">
                  <i className="fas fa-search"></i>
                  Consultar
                </button>
              </form>
            </div>

            {consultado && estado && (
              <div className="consulta-resultado">
                <h3>Estado de tu PQRS</h3>
                <div className={`estado-card estado-${getEstadoColor(estado.estado)}`}>
                  <div className="estado-header">
                    <div className="estado-icon">
                      {estado.estado === "Resuelta" ? "✅" : 
                       estado.estado === "En proceso" ? "⏳" : "📋"}
                    </div>
                    <div className="estado-info">
                      <span className="estado-label">Estado actual:</span>
                      <span className={`estado-valor ${getEstadoColor(estado.estado)}`}>
                        {estado.estado}
                      </span>
                    </div>
                  </div>
                  
                  <div className="estado-detalle">
                    <div className="detalle-item">
                      <strong>Tipo:</strong>
                      <span>{estado.tipo}</span>
                    </div>
                    <div className="detalle-item">
                      <strong>Fecha de registro:</strong>
                      <span>{estado.fecha}</span>
                    </div>
                    <div className="detalle-item">
                      <strong>Descripción:</strong>
                      <span>{estado.detalle}</span>
                    </div>
                  </div>
                </div>

                <div className="info-adicional">
                  <i className="fas fa-info-circle"></i>
                  <p>¿Necesitas más información? Contáctanos al correo <strong>pqrs@buitroncoffee.com</strong></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
<Footer />
    </div>
  );
}

export default Consultarpqrs;