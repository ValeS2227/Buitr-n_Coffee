import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [pantalla, setPantalla] = useState('login');
  const navigate = useNavigate();

  return (
    <div className="card">

      {pantalla === 'login' && (
        <div id="pantallaLogin">
          <h1>Buitrón Coffee</h1>
          <h2>Bienvenido al inicio de sesión Admin</h2>

          <label>Usuario</label>
          <input type="text" placeholder="Ingrese usuario" />

          <label>Contraseña</label>
          <input type="password" placeholder="Ingrese Contraseña" />

          <button onClick={() => navigate('/inicio')}>Iniciar Sesión</button>
        </div>
      )}

      {pantalla === 'bienvenida' && (
        <div id="pantallaBienvenida">
          <h1>Buitrón Coffee</h1>
          <h2>Bienvenido a la Administración de Buitrón Coffee</h2>
          <button onClick={() => setPantalla('login')}>Gracias</button>
        </div>
      )}

    </div>
  );
}

export default Login;
