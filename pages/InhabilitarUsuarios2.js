import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const usuariosIniciales = [
  { id: 4, nombre: 'Laura Valentina Marroquin Rodriguez', doc: 'CC 123456789', correo: 'laurisv007@gmail.com', usuario: 'lauris', inhabilitado: false },
  { id: 5, nombre: 'Josue Alexander Prieto Buitron', doc: 'CC 1024480716', correo: 'josueprieto302006@gmail.com', usuario: 'Alex', inhabilitado: false },
  { id: 6, nombre: 'Diego Sebastian Guerrero Niño', doc: 'CC 123456789', correo: 'diegoguerrero@gmail.com', usuario: 'Diego', inhabilitado: false },
];

function InhabilitarUsuarios2() {
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
                <p><strong>Número:</strong> {u.doc}</p>
                <p><strong>Correo:</strong> {u.correo}</p>
                <p><strong>Usuario:</strong> {u.usuario}</p>
                <p><strong>Contraseña:</strong> XXXXX</p>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-siguiente" onClick={() => navigate('/inhabilitar-usuarios')}>PÁGINA ANTERIOR</button>
      </main>

      {/* MODAL */}
      {modalVisible && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-caja">
            <div className="modal-logo">Buitron Coffee</div>
            <div className="modal-pregunta">¿Estas seguro de Inhabilitar este usuario?</div>
            <button className="modal-btn" onClick={confirmarInhabilitar}>Aceptar</button>
            <button className="modal-btn" onClick={cerrarModal}>Volver al Inicio</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InhabilitarUsuarios2;
