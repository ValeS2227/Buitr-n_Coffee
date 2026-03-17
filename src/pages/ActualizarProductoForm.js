import { useRef } from 'react';
import Navbar from '../components/Navbar';
import '../css/estilos-actualizar_from.css';
const IconoEditar = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function CampoConIcono({ id, type = 'text', placeholder }) {
  return (
    <div className="campo-con-icono">
      <input className="campo-texto" type={type} placeholder={placeholder} id={id} />
      <button className="btn-editar-campo" onClick={() => document.getElementById(id).focus()}>
        <IconoEditar />
      </button>
    </div>
  );
}

function ActualizarProductoForm() {
  const inputImagenRef = useRef(null);

  return (
    <div className="pagina-crear">
      <Navbar titulo="ACTUALIZAR PRODUCTOS" />

      <main className="vista-crear">
        <div className="formulario-producto">

          {/* Columna izquierda */}
          <div className="columna-izquierda">
            <div className="caja-imagen">
              <span className="texto-imagen">Insertar Imagen Png...</span>
              <input type="file" accept="image/png" style={{ display: 'none' }} ref={inputImagenRef} />
            </div>
            <div className="campo-con-icono">
              <button className="campo-unidades" onClick={() => inputImagenRef.current.click()}>
                Insertar<br />Imagen
              </button>
              <button className="btn-editar-campo" onClick={() => inputImagenRef.current.click()}>
                <IconoEditar />
              </button>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="columna-derecha">
            <CampoConIcono id="campo-nombre" placeholder="Ingrese el nombre del Café" />
            <CampoConIcono id="campo-tostado" placeholder="Nivel de Tostado" />
            <CampoConIcono id="campo-estado" placeholder="Estado" />
            <CampoConIcono id="campo-precio" placeholder="Precio" />
            <CampoConIcono id="campo-descripcion" placeholder="Ingrese descripción" />
            <CampoConIcono id="campo-unidades-disp" type="number" placeholder="Unidades disponibles" />
            <button className="btn-crear-producto">ACTUALIZAR</button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ActualizarProductoForm;
