import "../estilos/usuario.css"
import { useNavigate } from "react-router-dom"
import perfil from "../assets/perfil.jpg"

function Usuario() {

  const navigate = useNavigate()

  return (
    <div className="usuario-page">

      <header className="nav">
        <button onClick={() => navigate("/catalogo")}>
          Regresar al Inicio
        </button>
      </header>

      <div className="perfil-container">

        <h1>Mi Perfil</h1>

        <div className="perfil-card">

          <div className="foto-section">

            <img
              src={perfil}
              className="foto-perfil"
              alt="perfil"
            />

            <input type="file" accept="image/*"/>

            <button onClick={() => navigate("/")}>
              Cerrar Sesión
            </button>

          </div>

          <div className="info-section">

            <label>Nombre de Usuario</label>
            <input type="text" defaultValue="elkin"/>

            <label>Número de Documento</label>
            <input type="text" defaultValue="1023864852"/>

            <label>Número de Teléfono</label>
            <input type="text" defaultValue="3118597822"/>

            <label>Correo Electrónico</label>
            <input type="email" defaultValue="elkinl1023@msn.com"/>

            <label>Contraseña</label>
            <input type="password" defaultValue="*********"/>

            <button className="btn-guardar">
              Guardar Cambios
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Usuario