import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import CafeMayor from './pages/CafeMayor';
import Nosotros from './pages/Nosotros';
import Exportaciones from './pages/Exportaciones';
import Produccion from './pages/Produccion';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RecuperarContrasena from './pages/RecuperarContrasena';
import Administrador from './pages/Administrador';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/cafemayor" element={<CafeMayor />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/exportaciones" element={<Exportaciones />} />
        <Route path="/produccion" element={<Produccion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<RecuperarContrasena />} />
        <Route path="/admin" element={<Administrador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
