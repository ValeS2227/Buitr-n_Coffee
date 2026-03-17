import './App.css';
import './estilos_inicio_crud.css';
import { useState } from 'react';
import Dashboard from './Crub_Admin_Inicio';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'cafe123';

export default function App() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  function iniciarSesion() {
    if (usuario === ADMIN_USER && contrasena === ADMIN_PASS) {
      setError('');
      setLoggedIn(true);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') iniciarSesion();
  }

  function cerrarSesion() {
    setLoggedIn(false);
    setUsuario('');
    setContrasena('');
  }

  if (loggedIn) {
    return <Dashboard onCerrarSesion={cerrarSesion} />;
  }

  return (
    <div>
      <h1>Buitrón Coffee</h1>
      <h2>Inicio de Sesión Admin</h2>

      <label>Usuario</label>
      <input
        type="text"
        placeholder="Ingrese usuario"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <label>Contraseña</label>
      <input
        type="password"
        placeholder="Ingrese contraseña"
        value={contrasena}
        onChange={e => setContrasena(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {error && <p>{error}</p>}

      <button onClick={iniciarSesion}>Iniciar Sesión</button>
    </div>
  );
}