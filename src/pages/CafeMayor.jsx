import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Modal from '../components/Modal';

export default function CafeMayor() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const paquetes = [
    { img: '/img/cafe2.jpeg', name: 'Café Molido', presentacion: 'Pack × 30 unidades', stars: '⭐⭐⭐⭐⭐', precio: '$1.800.000', detalle: '30 × $60.000 c/u', badge: 'POPULAR', premium: false },
    { img: '/img/cafe3.jpeg', name: 'Grano', presentacion: 'Pack × 30 unidades', stars: '⭐⭐⭐⭐', precio: '$1.950.000', detalle: '30 × $65.000 c/u', badge: null },
    { img: '/img/cafe4.jpeg', name: 'Grano Especial', presentacion: 'Pack × 30 unidades', stars: '⭐⭐⭐⭐⭐', precio: '$2.100.000', detalle: '30 × $70.000 c/u', badge: 'PREMIUM', premium: true },
    { img: '/img/cafe1.jpeg', name: 'Pack Mixto', presentacion: 'Pack × 30 unidades', stars: '⭐⭐⭐⭐⭐', precio: '$1.950.000', detalle: 'Variedades a elección', badge: null },
  ];

  const beneficios = [
    { icono: '🚚', titulo: 'Envío a todo Colombia', desc: 'Despachamos a cualquier ciudad del país con pedidos mayores a 30 unidades.' },
    { icono: '☕', titulo: 'Origen Certificado', desc: 'Café 100% del Huila, cultivado en Pitalito con las mejores prácticas cafeteras.' },
    { icono: '💼', titulo: 'Precio Distribuidor', desc: 'Precios directos del productor. Sin intermediarios, mejor rentabilidad para tu negocio.' },
    { icono: '📦', titulo: 'Pedidos Personalizados', desc: '¿Necesitas una cantidad especial? Contáctanos y hacemos un paquete a tu medida.' },
  ];

  return (
    <Layout>
      <div className="mayor-hero">
        <h2>Café por Mayor</h2>
        <p>Distribuye el mejor café del Huila. Contamos con paquetes especiales para negocios, restaurantes, hoteles y distribuidores. ¡Precios directos desde el origen! Pedido mínimo: <strong>30 unidades</strong>.</p>
      </div>

      <section className="mayor-section">
        <h3>Paquetes disponibles — mínimo 30 unidades</h3>
        <div className="mayor-grid">
          {paquetes.map((p, i) => (
            <div className="mayor-card" key={i}>
              {p.badge && <span className={`badge ${p.premium ? 'premium' : ''}`}>{p.badge}</span>}
              <img src={p.img} alt={p.name} />
              <div className="nombre">{p.name}</div>
              <div className="presentacion">{p.presentacion}</div>
              <div className="stars">{p.stars}</div>
              <div className="precio">{p.precio}</div>
              <div className="precio-detalle">{p.detalle}</div>
              <button className="btn-cotizar" onClick={() => setShowModal(true)}>🛒 Agregar</button>
            </div>
          ))}
        </div>

        <div className="beneficios">
          {beneficios.map((b, i) => (
            <div className="beneficio-item" key={i}>
              <div className="icono">{b.icono}</div>
              <h4>{b.titulo}</h4>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Modal show={showModal} onClose={() => setShowModal(false)} />
    </Layout>
  );
}
