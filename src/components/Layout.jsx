import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Producción', to: '/produccion' },
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Exportaciones', to: '/exportaciones' },
    { label: 'Café por Mayor', to: '/cafemayor' },
  ];

  return (
    <>
      <div className="top-banner">Encontrarás descuentos por el día de hoy</div>
      <header>
        <div className="header-spacer" />
        <div className="header-logo">
          <h1 onClick={() => navigate('/')}><i>Buitron Coffee</i></h1>
        </div>
        <div className="header-icons">
          <a onClick={() => navigate('/login')} title="Usuario">&#128100;</a>
          <a onClick={() => navigate('/productos')} title="Buscar productos">&#128269;</a>
          <a onClick={() => navigate('/login')} title="Carrito">&#128722;</a>
        </div>
      </header>
      <nav>
        {navLinks.map(link => (
          <a
            key={link.to}
            className={path === link.to ? 'active' : ''}
            onClick={() => navigate(link.to)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {children}

      <footer>
        <p>© 2024 Buitrón Coffee — Pitalito, Huila, Colombia | Finca Las Brisas Montecristo</p>
        <p>
          <a onClick={() => navigate('/login')} style={{cursor:'pointer'}}>Iniciar sesión</a>
          {' · '}
          <a onClick={() => navigate('/cafemayor')} style={{cursor:'pointer'}}>Distribuidores</a>
          {' · '}
          <a onClick={() => navigate('/nosotros')} style={{cursor:'pointer'}}>Nosotros</a>
        </p>
      </footer>

      <a className="whatsapp-btn" href="https://wa.me/573001234567" target="_blank" rel="noreferrer" title="WhatsApp">
        <img src="/img/whatsapp.jpeg" alt="WhatsApp" />
      </a>
    </>
  );
}
