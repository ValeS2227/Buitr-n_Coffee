import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Administrador() {
  const [pantalla, setPantalla] = useState('login');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginAdmin = () => {
    if (usuario === 'admin' && password === 'admin123') {
      setPantalla('bienvenida');
    } else {
      alert('Credenciales incorrectas.\nDemo: usuario "admin" / contraseña "admin123"');
    }
  };

  const cerrarSesion = () => {
    setUsuario(''); setPassword('');
    setPantalla('login');
  };

  return (
    <div className="auth-body">
      <div className="card">
        {pantalla === 'login' && (
          <>
            <div className="logo">Buitrón Coffee</div>
            <h2>Acceso Administrador</h2>
            <div className="mensaje">
              Esta área es exclusiva para el administrador del sitio.<br />
              Credenciales demo: usuario "admin" / contraseña "admin123"
            </div>
            <label>Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Ingrese usuario admin"
              onKeyDown={e => e.key === 'Enter' && loginAdmin()}
            />
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingrese contraseña"
              onKeyDown={e => e.key === 'Enter' && loginAdmin()}
            />
            <button onClick={loginAdmin}>Iniciar sesión</button>
            <button className="btn-secondary" onClick={() => navigate('/')}>Volver al sitio</button>
          </>
        )}

        {pantalla === 'bienvenida' && (
          <>
            <div className="logo">Buitrón Coffee</div>
            <div className="big">Bienvenido a la<br />Administración</div>
            <div className="mensaje">Panel de gestión del sitio Buitrón Coffee. Desde aquí puedes administrar los contenidos del sitio.</div>
            <button onClick={() => navigate('/productos')}>Ver productos</button>
            <button onClick={() => navigate('/')}>Ir al sitio</button>
            <button className="btn-secondary" onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        )}
      </div>
    </div>
  );
}
