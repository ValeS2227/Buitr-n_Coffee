import { useRef } from 'react';
import Navbar from '../components/Navbar';
import '../css/estilos_crear_producto.css';
function CrearProducto() {
  const inputImagenRef = useRef(null);

  return (
    <div className="pagina-crear">
      <Navbar titulo="CREAR PRODUCTO" />

      <main className="vista-crear">
        <div className="formulario-producto">

          {/* Columna izquierda */}
          <div className="columna-izquierda">
            <div className="caja-imagen">
              <span className="texto-imagen">Insertar Imagen Png...</span>
              <input type="file" accept="image/png" style={{ display: 'none' }} ref={inputImagenRef} />
            </div>
            <button className="campo-unidades" onClick={() => inputImagenRef.current.click()}>
              Insertar<br />Imagen
            </button>
          </div>

          {/* Columna derecha */}
          <div className="columna-derecha">
            <input className="campo-texto" type="text" placeholder="Ingrese el nombre del Café" />
            <input className="campo-texto" type="text" placeholder="Nivel de Tostado" />
            <input className="campo-texto" type="text" placeholder="Estado" />
            <input className="campo-texto" type="text" placeholder="Precio" />
            <input className="campo-texto" type="text" placeholder="Ingrese descripción" />
            <input className="campo-texto" type="number" placeholder="Unidades disponibles" />
            <button className="btn-crear-producto">Crear Producto</button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default CrearProducto;
