import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/estilos_inhabilitar_usuarios.css';
const usuariosIniciales = [
  { id: 1, nombre: 'Jorge Gonzales Gonzales', doc: 'CC 123456789', correo: 'Jgogites202@gmail.com', usuario: 'jorgito', inhabilitado: false },
  { id: 2, nombre: 'Saray Valentina Herrera Prieto', doc: 'CC 123456789', correo: 'saray754@gmail.com', usuario: 'Saray', inhabilitado: false },
  { id: 3, nombre: 'Sharon Valeria Párraga Gómez', doc: 'CC 123377256', correo: 'parragavaleria740@gmail.com', usuario: 'Vale', inhabilitado: false },
];

function InhabilitarUsuarios() {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const navigate = useNavigate();

  function abrirModal(id) {
    setUsuarioSeleccionado(id);
    setModalVisible(true);
  }

  function cerrarModal() {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
  }

  function confirmarInhabilitar() {
    setUsuarios(usuarios.map(u =>
      u.id === usuarioSeleccionado ? { ...u, inhabilitado: true } : u
    ));
    alert('Usuario inhabilitado correctamente');
    cerrarModal();
  }

  return (
    <div>
      <Navbar titulo="INHABILITAR USUARIOS" />

      <main className="vista-usuarios">
        <div className="grilla-usuarios">
          {usuarios.map((u) => (
            <div className={`tarjeta-usuario${u.inhabilitado ? ' inhabilitado' : ''}`} key={u.id}>
              <div className="btn-inhabilitar-contenedor">
                <div className="btn-inhabilitar">INHABILITAR</div>
                <button className="icono-inhabilitar" onClick={() => !u.inhabilitado && abrirModal(u.id)}>
                  <svg viewBox="0 0 24 24" style={{ width: '26px', height: '26px' }}>
                    <circle cx="12" cy="12" r="11" fill="#2E2E2E"/>
                    <rect x="6" y="10.5" width="12" height="3" rx="1.5" fill="white"/>
                  </svg>
                </button>
              </div>
              <div className="info-usuario">
                <p><strong>Nombre:</strong> {u.nombre}</p>
                <p><strong>Número y tipo de doc:</strong> {u.doc}</p>
                <p><strong>Correo:</strong> {u.correo}</p>
                <p><strong>Usuario:</strong> {u.usuario}</p>
                <p><strong>Contraseña:</strong> XXXXX</p>
              </div>
            </div>
          ))}
        </div>
        <center>
          <button className="btn-siguiente" onClick={() => navigate('/inhabilitar-usuarios-2')}>SIGUIENTE PÁGINA</button>
        </center>
      </main>

      {/* MODAL */}
      {modalVisible && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-caja">
            <div className="modal-logo">Buitron Coffee</div>
            <div className="modal-pregunta">¿Estas seguro de Inhabilitar este usuario?</div>
            <button className="modal-btn" onClick={confirmarInhabilitar}>Aceptar</button>
            <button className="modal-btn" onClick={cerrarModal}>Volver</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InhabilitarUsuarios;
