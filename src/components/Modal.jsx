import { useNavigate } from 'react-router-dom';

export default function Modal({ show, onClose }) {
  const navigate = useNavigate();
  return (
    <div className={`modal ${show ? 'show' : ''}`} onClick={(e) => { if (e.target.classList.contains('modal')) onClose(); }}>
      <div className="modal-content">
        <h3>Inicia sesión</h3>
        <p>Para agregar productos al carrito necesitas iniciar sesión o crear una cuenta.</p>
        <button onClick={() => navigate('/login')}>Iniciar sesión</button>
      </div>
    </div>
  );
}
