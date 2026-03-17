import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [pantalla, setPantalla] = useState('inicio'); // inicio | login | bienvenida
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('mostrarLogin') === 'true') {
      sessionStorage.removeItem('mostrarLogin');
      setPantalla('login');
    }
  }, []);

  const iniciarSesion = () => {
    if (usuario === 'admin' && password === '1234') {
      setPantalla('bienvenida');
    } else {
      alert('Usuario o contraseña incorrectos.\nDemo: usuario "admin" / contraseña "1234"');
    }
  };

  const cerrarSesion = () => {
    setUsuario(''); setPassword('');
    setPantalla('inicio');
  };

  return (
    <div className="auth-body">
      <div className="card">
        {pantalla === 'inicio' && (
          <>
            <h1>Buitrón Coffee</h1>
            <button onClick={() => setPantalla('login')}>Inicia sesión</button>
            <button className="btn-secondary" onClick={() => navigate('/registro')}>Regístrate</button>
            <button className="btn-secondary" onClick={() => navigate('/')}>Volver al inicio</button>
          </>
        )}

        {pantalla === 'login' && (
          <>
            <h1>Buitrón Coffee</h1>
            <h2>Bienvenido al inicio de sesión</h2>
            <label>Usuario</label>
            <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} placeholder="Ingrese usuario" onKeyDown={e => e.key === 'Enter' && iniciarSesion()} />
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && iniciarSesion()} />
            <button onClick={iniciarSesion}>Ingresar</button>
            <button className="btn-secondary" onClick={() => setPantalla('inicio')}>Volver</button>
            <div className="links-login">
              <p>¿Olvidaste tu contraseña? <a onClick={() => navigate('/recuperar')}>Recuperar</a></p>
            </div>
            <div className="links-login">
              <p>¿No tienes cuenta? <a onClick={() => navigate('/registro')}>Regístrate</a></p>
            </div>
          </>
        )}

        {pantalla === 'bienvenida' && (
          <>
            <h1>Buitrón Coffee</h1>
            <div className="big">Bienvenido a<br />Buitrón Coffee</div>
            <button onClick={() => navigate('/')}>Ir al inicio</button>
            <button className="btn-secondary" onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        )}
      </div>
    </div>
  );
}
