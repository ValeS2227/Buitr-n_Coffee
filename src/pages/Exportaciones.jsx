import Layout from '../components/Layout';

export default function Exportaciones() {
  return (
    <Layout>
      <div className="hero">
        <img src="/img/banner.jpeg" alt="Banner Buitron Coffee" />
        <div className="hero-arrow">&#8964;</div>
      </div>

      <h2 className="seccion-title">Nuestras Exportaciones</h2>

      <div className="exportaciones-content">
        <div className="exportaciones-mapa">
          <img src="/img/colombia.png" alt="Mapa de Colombia — Exportaciones Buitron Coffee" />
        </div>
        <div className="info-text">
          Contamos con distribución en todo el territorio colombiano.
          Enviamos desde nuestra finca en Pitalito, Huila, hacia las
          principales ciudades del país. Además, exportamos a Ecuador,
          llevando el sabor del café especial del Huila más allá de
          nuestras fronteras.
          <br /><br />
          ¿Interesado en importar nuestro café? Contáctanos directamente
          por WhatsApp o escríbenos al correo para recibir información
          sobre condiciones de exportación.
        </div>
      </div>
    </Layout>
  );
}
