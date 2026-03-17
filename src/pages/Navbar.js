import { useNavigate } from 'react-router-dom';
import '../css/estilos_navbar.css';
function Navbar({ titulo }) {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <button className="btn-back" onClick={() => navigate('/inicio')}>Volver al Inicio</button>
      <div className="navbar-titulo">{titulo}</div>
      <div className="navbar-usuario">
        <span>AdminLauris</span>
        <div className="navbar-avatar">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="14" r="8" stroke="#2E2E2E" strokeWidth="2.5"/>
            <path d="M4 36c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#2E2E2E" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
