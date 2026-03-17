import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Inicio() {
  const [activeTab, setActiveTab] = useState('ideales');
  const navigate = useNavigate();

  const productosIdeales = [
    { img: '/img/cafe1.jpeg', name: 'Café Molido', price: 'Desde $60.000' },
    { img: '/img/cafe2.jpeg', name: 'Grano', price: 'Desde $65.000' },
    { img: '/img/cafe3.jpeg', name: 'Grano Especial', price: 'Desde $70.000' },
  ];

  const productosMayor = [
    { img: '/img/cafe2.jpeg', name: 'Café Molido × 30+', price: '$1.800.000', to: '/cafemayor' },
    { img: '/img/cafe3.jpeg', name: 'Grano × 30+', price: '$1.950.000', to: '/cafemayor' },
    { img: '/img/cafe4.jpeg', name: 'Grano Especial × 30+', price: '$2.100.000', to: '/cafemayor' },
  ];

  const productosActivos = activeTab === 'ideales' ? productosIdeales : productosMayor;

  return (
    <Layout>
      <div className="hero">
        <img src="/img/banner.jpeg" alt="Banner Buitron Coffee" />
        <div className="hero-arrow" onClick={() => document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' })}>
          &#8964;
        </div>
      </div>

      <section className="products-section">
        <div className="tabs">
          <span className={`tab ${activeTab === 'ideales' ? 'active' : ''}`} onClick={() => setActiveTab('ideales')}>Ideales para ti</span>
          <span className={`tab ${activeTab === 'mayor' ? 'active' : ''}`} onClick={() => setActiveTab('mayor')}>Café Por Mayor</span>
        </div>

        <div className="products-grid">
          {productosActivos.map((p, i) => (
            <div className="product-card" key={i}>
              <img src={p.img} alt={p.name} />
              <div className="product-name">{p.name}</div>
              <div className="product-price">{p.price}</div>
              <button className="btn-ver" onClick={() => navigate(p.to || '/productos')}>VER</button>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
