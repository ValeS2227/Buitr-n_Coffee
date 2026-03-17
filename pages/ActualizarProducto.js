import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const productos = [
  { id: 1, nombre: 'Café Molido', descripcion: 'Café Molido con un exquisito aroma para iniciar el dia con un buen animo.', precio: '$60.000', img: '/img/producto1.png' },
  { id: 2, nombre: 'Grano', descripcion: 'Delicioso Grano de café para tener la mejor energía en el día.', precio: '$65.000', img: '/img/producto2.png' },
  { id: 3, nombre: 'Grano Especial', descripcion: 'Delicioso Grano ahora en su version especial por un excelente precio.', precio: '$70.000', img: '/img/producto3.png' },
  { id: 4, nombre: 'Café Supremo Geisha', descripcion: 'Café Supremo Geisha fino con un exquisito toque de picante para tus días', precio: '$32.000', img: '/img/producto4.png' },
  { id: 5, nombre: 'Café al por mayor', descripcion: 'Ya disponible café al por mayor. ¡Adquierelo ahora!', precio: '$250.000', img: '/img/producto5.png' },
];

const IconoEditar = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function ActualizarProducto() {
  const navigate = useNavigate();

  return (
    <div className="pagina-productos">
      <Navbar titulo="ACTUALIZAR PRODUCTOS" />

      <main className="vista-productos">
        <div className="grilla-productos">
          {productos.map((p) => (
            <div className="tarjeta-producto" key={p.id}>
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
                    <span className="producto-actualizar">ACTUALIZAR</span>
                    <button className="btn-editar-icono" onClick={() => navigate('/actualizar-producto-form')}>
                      <IconoEditar />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ActualizarProducto;
