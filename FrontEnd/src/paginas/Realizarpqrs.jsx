import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/realizar.css";
import HeaderGlobal from "../components/HeaderGlobal";
import Footer from "../components/Footer";

function Realizarpqrs() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [codigoReferencia, setCodigoReferencia] = useState("");
  
  const [usuario, setUsuario] = useState({
    estaAutenticado: true, 
    nombre: "Elkin Camargo",
    email: "elkinl1023@msn.com",
    telefono: "3147854962"
  });

  const [formData, setFormData] = useState({
    tipo: "queja",
    descripcion: ""
  });

  // Generar código de referencia único
  const generarCodigoReferencia = () => {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const aleatorio = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `PQRS-${anio}${mes}${dia}-${aleatorio}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensajeError("");
    setMensajeExito("");

    // Validaciones
    if (!formData.descripcion.trim()) {
      setMensajeError("Por favor escribe una descripción de tu PQRS");
      setEnviando(false);
      return;
    }

    if (formData.descripcion.length < 10) {
      setMensajeError("La descripción debe tener al menos 10 caracteres");
      setEnviando(false);
      return;
    }

    // Generar código de referencia
    const nuevoCodigo = generarCodigoReferencia();
    setCodigoReferencia(nuevoCodigo);

    try {
      // Preparar datos para enviar al backend
      const datosEnvio = {
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        codigo_referencia: nuevoCodigo,
        fecha: new Date().toISOString(),
        estado: "Pendiente",
        ...(usuario.estaAutenticado && {
          nombre: usuario.nombre,
          email: usuario.email,
          telefono: usuario.telefono
        })
      };

      // Aquí iría la llamada real a la API
      // const response = await fetch("http://localhost:3001/api/pqrs", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(datosEnvio)
      // });
      
      // Simulación de envío exitoso
      setTimeout(() => {
        setMensajeExito(`¡Tu PQRS ha sido enviada con éxito!`);
        setFormData({
          tipo: "queja",
          descripcion: ""
        });
        setEnviando(false);
      }, 1500);
      
    } catch (error) {
      setMensajeError("Ocurrió un error al enviar tu PQRS. Por favor intenta nuevamente.");
      setEnviando(false);
    }
  };

  // Función para copiar el código al portapapeles
  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoReferencia);
    alert("Código copiado al portapapeles");
  };

  return (
    <div className="realizar-pqrs-page">
      <HeaderGlobal />

      <div className="pqrs-hero-small">
        <div className="pqrs-hero-content">
          <h1>Realizar PQRS</h1>
          <p>Cuéntanos tu experiencia</p>
        </div>
      </div>

      <section className="form-section">
        <div className="container">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Formulario de PQRS</h2>
              {usuario.estaAutenticado ? (
                <div className="user-info-badge">
                  <i className="fas fa-user-circle"></i>
                  <span>Estás realizando esta PQRS como: <strong>{usuario.nombre}</strong></span>
                </div>
              ) : (
                <p>Por favor inicia sesión para realizar tu PQRS</p>
              )}
            </div>

            {mensajeExito && (
              <div className="alert alert-success">
                <i className="fas fa-check-circle"></i>
                <div className="alert-content">
                  <p>{mensajeExito}</p>
                  {codigoReferencia && (
                    <div className="codigo-container">
                      <p className="codigo-label">Tu código de referencia es:</p>
                      <div className="codigo-box">
                        <strong className="codigo">{codigoReferencia}</strong>
                        <button 
                          className="btn-copiar" 
                          onClick={copiarCodigo}
                          title="Copiar código"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>
                      <p className="codigo-ayuda">
                        Guarda este código para consultar el estado de tu PQRS
                      </p>
                      <button 
                        className="btn-consultar-ahora"
                        onClick={() => navigate("/consultarpqrs")}
                      >
                        Consultar estado ahora
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {mensajeError && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i>
                {mensajeError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="pqrs-formulario">
              <div className="form-group">
                <label htmlFor="tipo">Tipo de PQRS *</label>
                <select 
                  id="tipo" 
                  name="tipo" 
                  value={formData.tipo}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="pregunta">❓ Pregunta</option>
                  <option value="queja">⚠️ Queja</option>
                  <option value="reclamo">📝 Reclamo</option>
                  <option value="sugerencia">💡 Sugerencia</option>
                  <option value="felicitacion">🎉 Felicitación</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción *</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows="6"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Cuéntanos detalladamente tu queja, reclamo, sugerencia o felicitación..."
                  className="form-control"
                  disabled={!usuario.estaAutenticado}
                ></textarea>
                <small className="char-count">
                  {formData.descripcion.length} caracteres (mínimo 10)
                </small>
              </div>

              {!usuario.estaAutenticado && (
                <div className="alert alert-info">
                  <i className="fas fa-info-circle"></i>
                  <p>
                    Para realizar una PQRS debes <button 
                      type="button" 
                      className="link-button"
                      onClick={() => navigate("/login")}
                    >iniciar sesión</button> o 
                    <button 
                      type="button" 
                      className="link-button"
                      onClick={() => navigate("/registro")}
                    > registrarte</button>
                  </p>
                </div>
              )}

              <div className="form-buttons">
                <button 
                  type="button" 
                  onClick={() => navigate("/pqrs")}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={enviando || !usuario.estaAutenticado}
                >
                  {enviando ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Enviando...
                    </>
                  ) : (
                    "Enviar PQRS"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
<Footer />
    </div>
  );
}

export default Realizarpqrs;