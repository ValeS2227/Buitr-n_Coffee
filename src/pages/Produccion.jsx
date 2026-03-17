import Layout from '../components/Layout';

export default function Produccion() {
  return (
    <Layout>
      <div className="hero">
        <img src="/img/banner.jpeg" alt="Banner Buitron Coffee" />
        <div className="hero-arrow">&#8964;</div>
      </div>

      <h2 className="seccion-title">Nuestra Producción</h2>

      <div className="produccion-content">
        <div className="produccion-video">
          <video controls poster="/img/cafe2.jpeg">
            <source src="/video/produccion.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
        </div>
        <div className="info-text">
          Podrás encontrar un breve video de cómo llevamos a cabo nuestra
          producción y empaque. Cultivamos el café a 1.750 m.s.n.m. en
          Pitalito, Huila, garantizando la más alta calidad en cada etapa,
          desde la cosecha hasta el empaque final.
        </div>
      </div>
    </Layout>
  );
}
