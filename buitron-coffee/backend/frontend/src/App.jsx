import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexRegistrado from "./pages/IndexRegistrado";
import Producto from "./pages/Producto";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexRegistrado />} />
        <Route path="/producto" element={<Producto />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;