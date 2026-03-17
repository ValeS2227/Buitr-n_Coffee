import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Modal from '../components/Modal';

export default function Productos() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const productos = [
    { img: '/img/cafe2.jpeg', name: 'Café Molido', precio: '$60.000', tostado: 'Medio', rating: '⭐⭐⭐⭐⭐', variedad: 'Bourbon Rosado' },
    { img: '/img/cafe3.jpeg', name: 'Grano', precio: '$65.000', tostado: 'Alto', rating: '⭐⭐⭐⭐', variedad: 'Café Supremo' },
    { img: '/img/cafe4.jpeg', name: 'Grano Especial', precio: '$70.000', tostado: 'Medio', rating: '⭐⭐⭐⭐⭐', variedad: 'Bourbon Rosado Premium' },
  ];

  return (
    <Layout>
      <div className="productos-hero">
        <h2>Nuestros Productos</h2>
        <p>Café especial cultivado en la Finca Las Brisas Montecristo, Pitalito, Huila, a 1.750 m.s.n.m. Elige el que más se adapte a tu gusto.</p>
      </div>

      <section className="productos-vertical">
        {productos.map((p, i) => (
          <div className="producto-container" key={i}>
            <div className="producto-card">
              <img src={p.img} alt={p.name} />
              <div className="info">
                <h2>{p.name}</h2>
                <div className="precio-destacado">{p.precio}</div>
                <div className="detalle">Estado: <strong>ACTIVO</strong></div>
                <div className="detalle">Nivel de Tostado: {p.tostado}</div>
                <div className="detalle">Calificación: {p.rating}</div>
                <div className="detalle">Variedad: {p.variedad}</div>
                <button className="btn-carrito" onClick={() => setShowModal(true)}>
                  🛒 Agregar — {p.precio}
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="producto-container">
          <div className="producto-card">
            <img src="/img/cafe1.jpeg" alt="Café por Mayor" />
            <div className="info">
              <h2>Café por Mayor</h2>
              <div className="precio-destacado">Desde $1.800.000</div>
              <div className="detalle">Estado: <strong>ACTIVO</strong></div>
              <div className="detalle">Mínimo: 30 unidades por pedido</div>
              <div className="detalle">Calificación: ⭐⭐⭐⭐</div>
              <div className="detalle">Ideal para negocios y distribuidores</div>
              <button className="btn-carrito" onClick={() => navigate('/cafemayor')}>
                Ver paquetes mayoristas
              </button>
            </div>
          </div>
        </div>
      </section>

      <Modal show={showModal} onClose={() => setShowModal(false)} />
    </Layout>
  );
}
