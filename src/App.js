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
