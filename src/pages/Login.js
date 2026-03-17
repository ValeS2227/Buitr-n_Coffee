import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/estilos_inicio_admin.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, clave })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        navigate('/inicio');
      } else {
        setError(data.mensaje);
      }
    } catch (err) {
      setError('Error conectando al servidor');
    }
  }

  return (
    <div className="card">
      <h1>Buitrón Coffee</h1>
      <h2>Bienvenido al inicio de sesión Admin</h2>

      <label>Correo</label>
      <input
        type="text"
        placeholder="Ingrese correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      <label>Contraseña</label>
      <input
        type="password"
        placeholder="Ingrese Contraseña"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
}

export default Login;