import { useState } from 'react';
import './estilos_inicio_crud.css';

export default function Dashboard({ onCerrarSesion }) {
  const [modalVisible, setModalVisible] = useState(true);

  function cerrarModal() {
    setModalVisible(false);
  }

  return (
    <div>
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-logo">Buitron Coffee</div>
            <p className="modal-titulo">Bienvenido a la Administración de Buitrón Coffee</p>
            <button className="btn-gracias" onClick={cerrarModal}>GRACIAS</button>
          </div>
        </div>
      )}

      <div className="contenedor-principal">
        <div className="panel-izquierdo">
          <div className="titulo-bienvenida">BIENVENIDO AL INICIO</div>
          <div className="avatar-circulo">
            <center>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="5"/>
                <path d="M10 90 Q10 60 50 60 Q90 60 90 90" fill="none" stroke="black" strokeWidth="5"/>
              </svg>
            </center>
          </div>
          <p className="nombre-usuario">AdminLauris</p>
          <button className="btn-cerrar-sesion" onClick={onCerrarSesion}>Cerrar Sesión</button>
        </div>

        <div className="panel-derecho">
          <div className="seccion-titulo">USUARIOS</div>
          <div className="fila-botones">
            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100">
                <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="5"/>
                <path d="M10 90 Q10 60 50 60 Q90 60 90 90" fill="none" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion">VER</button>
            </div>
            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100">
                <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="5"/>
                <path d="M10 90 Q10 60 50 60 Q90 60 90 90" fill="none" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion">INHABILITAR</button>
            </div>
          </div>

          <div className="seccion-titulo">PRODUCTOS</div>
          <div className="fila-botones">
            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="black" strokeWidth="5"/>
                <line x1="10" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="90" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion">CREAR</button>
            </div>
            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="black" strokeWidth="5"/>
                <line x1="10" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="90" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion">VER</button>
            </div>
            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="black" strokeWidth="5"/>
                <line x1="10" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="90" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion">ACTUALIZAR</button>
            </div>
            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="black" strokeWidth="5"/>
                <line x1="10" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="90" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion">INHABILITAR</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}