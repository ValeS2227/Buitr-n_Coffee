import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexBienvenida from "./pages/IndexBienvenida"
import IndexRegistrado from "./pages/IndexRegistrado";
import Producto from "./pages/Producto";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<IndexRegistrado />} />

        {/* ESTA RUTA ES LA QUE TE FALTA */}
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/bienvenida" element={<IndexBienvenida />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;