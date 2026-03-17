import Navbar from '../components/Navbar';
import '../css/estilos_ver_producto.css';
const productos = [
  { id: 1, nombre: 'Café Molido', descripcion: 'Café Molido con un exquisito aroma para iniciar el dia con un buen animo.', precio: '$60.000', img: '/img/producto1.png' },
  { id: 2, nombre: 'Grano', descripcion: 'Delicioso Grano de café para tener la mejor energía en el día.', precio: '$65.000', img: '/img/producto2.png' },
  { id: 3, nombre: 'Grano Especial', descripcion: 'Delicioso Grano ahora en su version especial por un excelente precio.', precio: '$70.000', img: '/img/producto3.png' },
  { id: 4, nombre: 'Café Supremo Geisha', descripcion: 'Café Molido fino con un exquisito toque de picante para tus días', precio: '$32.000', img: '/img/producto4.png' },
  { id: 5, nombre: 'Café al por mayor', descripcion: 'Ya disponible café al por mayor. ¡Adquierelo ahora!', precio: '$250.000', img: '/img/producto5.png' },
];

function VerProducto() {
  return (
    <div className="pagina-productos">
      <Navbar titulo="VER PRODUCTOS" />

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
                  <button className="btn-ver-producto">VER</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default VerProducto;
