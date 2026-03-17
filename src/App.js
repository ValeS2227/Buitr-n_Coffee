<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import CrearProducto from './pages/CrearProducto';
import VerProducto from './pages/VerProducto';
import ActualizarProducto from './pages/ActualizarProducto';
import ActualizarProductoForm from './pages/ActualizarProductoForm';
import InhabilitarProducto from './pages/InhabilitarProducto';
import VisualizarUsuarios from './pages/VisualizarUsuarios';
import VisualizarUsuarios2 from './pages/VisualizarUsuarios2';
import InhabilitarUsuarios from './pages/InhabilitarUsuarios';
import InhabilitarUsuarios2 from './pages/InhabilitarUsuarios2';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/crear-producto" element={<CrearProducto />} />
        <Route path="/ver-producto" element={<VerProducto />} />
        <Route path="/actualizar-producto" element={<ActualizarProducto />} />
        <Route path="/actualizar-producto-form" element={<ActualizarProductoForm />} />
        <Route path="/inhabilitar-producto" element={<InhabilitarProducto />} />
        <Route path="/visualizar-usuarios" element={<VisualizarUsuarios />} />
        <Route path="/visualizar-usuarios-2" element={<VisualizarUsuarios2 />} />
        <Route path="/inhabilitar-usuarios" element={<InhabilitarUsuarios />} />
        <Route path="/inhabilitar-usuarios-2" element={<InhabilitarUsuarios2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
=======
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
>>>>>>> e89bac0eccd5d91e7d4183e6fb7b1a1eb9c0e58c
