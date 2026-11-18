import axios from "axios";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { API_URL } from "./config";

// CONTEXT Y SERVICIOS
import { CarritoProvider } from "./context/CarritoContext";

// COMPONENTES DE PROTECCIÓN
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";

// USUARIOS PAGINAS
import Index from "./paginas/Index";
import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import OlvidoContrasena from "./paginas/OlvidoContrasena";
import Catalogo from "./paginas/catalogo";
import Usuario from "./paginas/usuario";
import MisPqrs from "./paginas/MisPqrs";
import PQRS from "./paginas/PQRS";
import Realizarpqrs from "./paginas/Realizarpqrs";
import Consultarpqrs from "./paginas/Consultarpqrs";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./paginas/Carrito";
import ConfirmacionCompra from "./paginas/ConfirmacionCompra";
import Nosotros from "./paginas/Nosotros";

// ADMIN PAGINAS
import IndexAdmin from "./Admin-paginas/IndexAdmin";
import VerProductos from "./Admin-paginas/VerProductos";
import ActualizarProducto from "./Admin-paginas/ActualizarProducto";
import CrearProducto from "./Admin-paginas/CrearProducto";
import InhabilitarProducto from "./Admin-paginas/InhabilitarProducto";
import VerUsuarios from "./Admin-paginas/VerUsuarios";
import InhabilitarUsuarios from "./Admin-paginas/InhabilitarUsuarios";
import CambiarRolUsuario from "./Admin-paginas/CambiarRolUsuario";
import VerPqrs from "./Admin-paginas/VerPqrs";
import GestionResenas from "./Admin-paginas/GestionResenas";
import GestionPedidos from "./Admin-paginas/GestionPedidos";

function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/index" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroRoute />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/olvido-contrasena" element={<OlvidoContrasena />} />

          <Route
            path="/usuario"
            element={
              <PrivateRoute>
                <Usuario />
              </PrivateRoute>
            }
          />
          <Route
            path="/resenas/ver"
            element={
              <AdminPage>
                <GestionResenas />
              </AdminPage>
            }
          />
          <Route
            path="/mis-pqrs"
            element={
              <PrivateRoute>
                <MisPqrs />
              </PrivateRoute>
            }
          />
          <Route
            path="/carrito"
            element={
              <PrivateRoute>
                <Carrito />
              </PrivateRoute>
            }
          />
          <Route
            path="/confirmacion"
            element={
              <PrivateRoute>
                <ConfirmacionCompra />
              </PrivateRoute>
            }
          />
          <Route
            path="/pqrs"
            element={
              <PrivateRoute>
                <PQRS />
              </PrivateRoute>
            }
          />
          <Route
            path="/realizarpqrs"
            element={
              <PrivateRoute>
                <Realizarpqrs />
              </PrivateRoute>
            }
          />
          <Route
            path="/consultarpqrs"
            element={
              <PrivateRoute>
                <Consultarpqrs />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminPage>
                <IndexAdmin />
              </AdminPage>
            }
          />
          <Route
            path="/productos/crear"
            element={
              <AdminPage>
                <CrearProducto />
              </AdminPage>
            }
          />
          <Route
            path="/productos/actualizar"
            element={
              <AdminPage>
                <ActualizarProducto />
              </AdminPage>
            }
          />
          <Route
            path="/productos/ver"
            element={
              <AdminPage>
                <VerProductos />
              </AdminPage>
            }
          />
          <Route
            path="/productos/inhabilitar"
            element={
              <AdminPage>
                <InhabilitarProducto />
              </AdminPage>
            }
          />
          <Route
            path="/usuarios/ver"
            element={
              <AdminPage>
                <VerUsuarios />
              </AdminPage>
            }
          />
          <Route
            path="/usuarios/inhabilitar"
            element={
              <AdminPage>
                <InhabilitarUsuarios />
              </AdminPage>
            }
          />
          <Route
            path="/usuarios/cambiar-rol"
            element={
              <AdminPage>
                <CambiarRolUsuario />
              </AdminPage>
            }
          />
          <Route
            path="/pqrs/ver"
            element={
              <AdminPage>
                <VerPqrs />
              </AdminPage>
            }
          />
          <Route
            path="/resenas/ver"
            element={
              <AdminPage>
                <GestionResenas />
              </AdminPage>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <AdminPage>
                <GestionPedidos />
              </AdminPage>
            }
          />
        </Routes>
      </BrowserRouter>
    </CarritoProvider>
  );
}

function AdminPage({ children }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}

function RegistroRoute() {
  const navigate = useNavigate();

  return (
    <Registro
      onEnviarCodigo={(correo) =>
        axios.post(`${API_URL}/api/verificacion-email/enviar-codigo`, {
          Correo: correo,
        })
      }
      onVerificar={(codigo, correo) =>
        axios.post(`${API_URL}/api/verificacion-email/verificar-codigo`, {
          Correo: correo,
          Codigo: codigo,
        })
      }
      onReenviarCodigo={(correo) =>
        axios.post(`${API_URL}/api/verificacion-email/reenviar-codigo`, {
          Correo: correo,
        })
      }
      onRegistrar={(datos) =>
        axios.post(`${API_URL}/api/auth/register`, {
          Nombre_usuario: datos.nombreUsuario,
          Apellido: datos.apellido,
          Correo: datos.correo,
          Documento: datos.documento,
          Telefono: datos.telefono,
          Clave: datos.clave,
        })
      }
      onVolverLogin={() => navigate("/login")}
      onVerificacionExitosa={() => navigate("/login")}
    />
  );
}

export default App;
