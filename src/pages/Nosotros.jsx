import Layout from '../components/Layout';

export default function Nosotros() {
  return (
    <Layout>
      <div className="hero">
        <img src="/img/banner.jpeg" alt="Banner Buitron Coffee" />
        <div className="hero-arrow">&#8964;</div>
      </div>

      <h2 className="seccion-title">Conoce sobre la empresa</h2>

      <div className="nosotros-content">
        <div className="nosotros-card">
          <p>☕ Origen: Pitalito, Huila</p>
          <p>☕ Jefe de producción: Juan Carlos Buitrón</p>
          <p>☕ Finca: Las Brisas Montecristo</p>
          <p>☕ Altura: 1.750 m.s.n.m.</p>
          <p>☕ Variedad: Café Bourbon Rosado</p>
          <p>☕ Categoría: Café Supremo</p>
        </div>
        <div className="nosotros-logo">
          <img src="/img/Pitalito.png" alt="Buitron Café Especial — Pitalito, Huila" />
        </div>
      </div>
    </Layout>
  );
}
