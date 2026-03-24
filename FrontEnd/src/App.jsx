import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import Catalogo from "./paginas/catalogo";
import Usuario from "./paginas/Usuario";
import PQRS from "./paginas/PQRS";
import Realizarpqrs from "./paginas/Realizarpqrs";
import Consultarpqrs from "./paginas/Consultarpqrs";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./paginas/Carrito";
import ConfirmacionCompra from "./paginas/ConfirmacionCompra";


function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pqrs" element={<PQRS />} />
          <Route path="/realizarpqrs" element={<Realizarpqrs />} />
          <Route path="/consultarpqrs" element={<Consultarpqrs />} />
          <Route path="/confirmacion" element={<ConfirmacionCompra />} />
        </Routes>
      </BrowserRouter>
    </CarritoProvider>
  );
}

export default App;