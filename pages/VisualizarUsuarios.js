import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const usuarios = [
  { id: 1, nombre: 'Jorge Gonzales Gonzales', doc: 'CC 123456789', correo: 'Jgogites202@gmail.com', usuario: 'jorgito' },
  { id: 2, nombre: 'Saray Valentina Herrera Prieto', doc: 'CC 123456789', correo: 'saray754@gmail.com', usuario: 'Saray' },
  { id: 3, nombre: 'Sharon Valeria Párraga Gómez', doc: 'CC 123377256', correo: 'parragavaleria740@gmail.com', usuario: 'Vale' },
];

const AvatarSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '80px', height: '80px', display: 'block', margin: 'auto', marginTop: '20px' }}>
    <circle cx="50" cy="35" r="20" fill="#4B2E2B" stroke="#4B2E2B" strokeWidth="2"/>
    <path d="M10 90 Q10 60 50 60 Q90 60 90 90" fill="#4B2E2B" stroke="#4B2E2B" strokeWidth="2"/>
  </svg>
);

function VisualizarUsuarios() {
  const navigate = useNavigate();

  return (
    <div className="pagina-usuarios">
      <Navbar titulo="VISUALIZACIÓN DE USUARIOS" />

      <main className="vista-usuarios">
        <div className="grilla-usuarios">
          {usuarios.map((u) => (
            <div className="tarjeta-usuario" key={u.id}>
              <div className="foto-usuario">
                <AvatarSVG />
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
        <button className="btn-siguiente" onClick={() => navigate('/visualizar-usuarios-2')}>SIGUIENTE PÁGINA</button>
      </main>
    </div>
  );
}

export default VisualizarUsuarios;
