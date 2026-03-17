import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/estilos_inicio_crud.css';

function Inicio() {
  const [modalVisible, setModalVisible] = useState(true);
  const navigate = useNavigate();

  return (
    <div>
      {/* MODAL DE BIENVENIDA */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-logo">Buitron Coffee</div>
            <p className="modal-titulo">Bienvenido a la Administración de Buitrón Coffee</p>
            <button className="btn-gracias" onClick={() => setModalVisible(false)}>GRACIAS</button>
          </div>
        </div>
      )}

      <div className="contenedor-principal">

        {/* Panel izquierdo */}
        <div className="panel-izquierdo">
          <div className="titulo-bienvenida">BIENVENIDO AL INICIO</div>
          <div className="avatar-circulo">
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="5"/>
              <path d="M10 90 Q10 60 50 60 Q90 60 90 90" fill="none" stroke="black" strokeWidth="5"/>
            </svg>
          </div>
          <p className="nombre-usuario">AdminLauris</p>
          <button className="btn-cerrar-sesion" onClick={() => navigate('/')}>Cerrar Sesión</button>
        </div>

        {/* Panel derecho */}
        <div className="panel-derecho">

          {/* Sección Usuarios */}
          <div className="seccion-titulo">USUARIOS</div>
          <div className="fila-botones">

            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="5"/>
                <path d="M10 90 Q10 60 50 60 Q90 60 90 90" fill="none" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion" onClick={() => navigate('/visualizar-usuarios')}>VER</button>
            </div>

            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="35" r="20" fill="none" stroke="black" strokeWidth="5"/>
                <path d="M10 90 Q10 60 50 60 Q90 60 90 90" fill="none" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion" onClick={() => navigate('/inhabilitar-usuarios')}>INHABILITAR</button>
            </div>

          </div>

          {/* Sección Productos */}
          <div className="seccion-titulo">PRODUCTOS</div>
          <div className="fila-botones">

            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="black" strokeWidth="5"/>
                <line x1="10" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="90" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion" onClick={() => navigate('/crear-producto')}>CREAR</button>
            </div>

            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="black" strokeWidth="5"/>
                <line x1="10" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="90" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion" onClick={() => navigate('/ver-producto')}>VER</button>
            </div>

            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="black" strokeWidth="5"/>
                <line x1="10" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="90" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion" onClick={() => navigate('/actualizar-producto')}>ACTUALIZAR</button>
            </div>

            <div className="tarjeta-accion">
              <svg width="65" height="65" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="black" strokeWidth="5"/>
                <line x1="10" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="90" y1="30" x2="50" y2="50" stroke="black" strokeWidth="5"/>
                <line x1="50" y1="50" x2="50" y2="90" stroke="black" strokeWidth="5"/>
              </svg>
              <button className="btn-accion" onClick={() => navigate('/inhabilitar-producto')}>INHABILITAR</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
