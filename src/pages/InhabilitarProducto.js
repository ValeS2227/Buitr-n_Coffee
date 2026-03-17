import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../css/estilos_inhabilitar_productos.css';
const productosIniciales = [
  { id: 1, nombre: 'Café Molido', descripcion: 'Café Molido con un exquisito aroma para iniciar el dia con un buen animo.', precio: '$60.000', img: '/img/producto1.png', inhabilitado: false },
  { id: 2, nombre: 'Grano', descripcion: 'Delicioso Grano de café para tener la mejor energía en el día.', precio: '$65.000', img: '/img/producto2.png', inhabilitado: false },
  { id: 3, nombre: 'Grano Especial', descripcion: 'Delicioso Grano ahora en su version especial por un excelente precio.', precio: '$70.000', img: '/img/producto3.png', inhabilitado: false },
  { id: 4, nombre: 'Café Bourbon Rosado', descripcion: 'Café Molido fino con un exquisito toque de picante para tus días', precio: '$32.000', img: '/img/producto4.png', inhabilitado: false },
  { id: 5, nombre: 'Café al por mayor', descripcion: 'Ya disponible café al por mayor. ¡Adquierelo ahora!', precio: '$250.000', img: '/img/producto5.png', inhabilitado: false },
];

function InhabilitarProducto() {
  const [productos, setProductos] = useState(productosIniciales);
  const [modalVisible, setModalVisible] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  function abrirModal(id) {
    setProductoSeleccionado(id);
    setModalVisible(true);
  }

  function cerrarModal() {
    setModalVisible(false);
    setProductoSeleccionado(null);
  }

  function confirmarInhabilitar() {
    setProductos(productos.map(p =>
      p.id === productoSeleccionado ? { ...p, inhabilitado: true } : p
    ));
    cerrarModal();
    alert('Producto inhabilitado correctamente');
  }

  return (
    <div className="pagina-productos">
      <Navbar titulo="INHABILITAR PRODUCTOS" />

      <main className="vista-productos">
        <div className="grilla-productos">
          {productos.map((p) => (
            <div className={`tarjeta-producto${p.inhabilitado ? ' inhabilitado' : ''}`} key={p.id}>
              <div className="producto-imagen">
                <img src={p.img} alt={p.nombre} onError={(e) => e.target.style.display = 'none'} />
              </div>
              <div className="producto-info">
                <h3 className="producto-nombre">{p.nombre}</h3>
                <p className="producto-descripcion">{p.descripcion}</p>
                <div className="producto-footer">
                  <div className="precio-carrito">
                    <span className="producto-precio">{p.precio}</span>
                  </div>
                  <div className="btn-accion-fila">
                    <span className="producto-actualizar">INHABILITAR</span>
                    <button
                      className="btn-menos-icono"
                      onClick={() => !p.inhabilitado && abrirModal(p.id)}
                      style={{ opacity: p.inhabilitado ? 0.4 : 1, cursor: p.inhabilitado ? 'not-allowed' : 'pointer' }}
                    >
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px' }}>
                        <circle cx="12" cy="12" r="10" fill="#2E2E2E"/>
                        <rect x="6" y="11" width="12" height="2.5" rx="1.2" fill="white"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      {modalVisible && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-caja">
            <div className="modal-logo">Buitron Coffee</div>
            <div className="modal-pregunta">¿Estás seguro de inhabilitar este producto?</div>
            <button className="modal-btn" onClick={confirmarInhabilitar}>Aceptar</button>
            <button className="modal-btn" onClick={cerrarModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InhabilitarProducto;
