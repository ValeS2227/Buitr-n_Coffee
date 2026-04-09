import { useState, useEffect } from "react";
import axios from "axios";
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReciboPDF from "./ReciboPDF";
import "../estilos/historial.css";

function HistorialCompras({ usuario }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [detallePedido, setDetallePedido] = useState(null);
  const [pdfListo, setPdfListo] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setCargando(true);
      const res = await axios.get("http://localhost:3001/api/pedidos/historial", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidos(res.data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      alert("Error al cargar el historial de compras");
    } finally {
      setCargando(false);
    }
  };

  const verDetalle = async (pedidoId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/pedidos/detalle/${pedidoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDetallePedido(res.data);
      setPedidoSeleccionado(pedidoId);
      setTimeout(() => setPdfListo(true), 100);
    } catch (error) {
      console.error("Error al cargar detalle:", error);
      alert("Error al cargar el detalle del pedido");
    }
  };

  const cerrarDetalle = () => {
    setPedidoSeleccionado(null);
    setDetallePedido(null);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Pendiente':
        return '#FFA500';
      case 'Enviado':
        return '#4CAF50';
      case 'Entregado':
        return '#2196F3';
      case 'Cancelado':
        return '#F44336';
      default:
        return '#999';
    }
  };

  if (cargando) {
    return <div className="historial-cargando">Cargando historial...</div>;
  }

  if (pedidos.length === 0) {
    return (
      <div className="historial-vacio">
        <i className="fa-solid fa-receipt"></i>
        <p>Aún no has realizado compras</p>
        <button 
          onClick={() => window.location.href = "/catalogo"}
          className="btn-comprar"
        >
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="historial-container">
      <h2>Historial de Compras</h2>
      
      <div className="pedidos-lista">
        {pedidos.map((pedido) => (
          <div key={pedido.ID_Pedido} className="pedido-card">
            <div className="pedido-header">
              <div className="pedido-info">
                <span className="pedido-numero">
                  Pedido #{pedido.ID_Pedido.toString().padStart(6, '0')}
                </span>
                <span className="pedido-fecha">
                  {formatearFecha(pedido.Fecha)}
                </span>
              </div>
              <div className="pedido-estado">
                <span 
                  className="estado-badge"
                  style={{ backgroundColor: getEstadoColor(pedido.Estado) }}
                >
                  {pedido.Estado}
                </span>
              </div>
            </div>
            
            <div className="pedido-resumen">
              <div className="resumen-item">
                <span>Productos:</span>
                <strong>{pedido.CantidadProductos} artículos</strong>
              </div>
              <div className="resumen-item">
                <span>Total:</span>
                <strong className="total">${pedido.Total.toLocaleString()}</strong>
              </div>
            </div>
            
            <div className="pedido-productos-preview">
              {pedido.ProductosLista.slice(0, 3).map((producto, idx) => (
                <span key={idx} className="producto-tag">
                  {producto}
                </span>
              ))}
              {pedido.ProductosLista.length > 3 && (
                <span className="producto-tag-mas">
                  +{pedido.ProductosLista.length - 3} más
                </span>
              )}
            </div>
            
            <div className="pedido-acciones">
              <button 
                onClick={() => verDetalle(pedido.ID_Pedido)}
                className="btn-ver-detalle"
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles del pedido */}
      {pedidoSeleccionado && detallePedido && (
        <div className="modal-overlay" onClick={cerrarDetalle}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalle del Pedido #{pedidoSeleccionado.toString().padStart(6, '0')}</h3>
              <button onClick={cerrarDetalle} className="modal-close">×</button>
            </div>
            
            <div className="modal-body">
              <div className="detalle-info">
                <div className="info-linea">
                  <span>Fecha:</span>
                  <strong>{formatearFecha(detallePedido.Fecha)}</strong>
                </div>
                <div className="info-linea">
                  <span>Estado:</span>
                  <strong style={{ color: getEstadoColor(detallePedido.Estado) }}>
                    {detallePedido.Estado}
                  </strong>
                </div>
                <div className="info-linea">
                  <span>Dirección de envío:</span>
                  <strong>{detallePedido.Direccion || 'No especificada'}</strong>
                </div>
                <div className="info-linea">
                  <span>Método de pago:</span>
                  <strong>{detallePedido.MetodoPago}</strong>
                </div>
              </div>

              <div className="detalle-productos">
                <h4>Productos:</h4>
                <div className="productos-lista-detalle">
                  {detallePedido.items.map((item, idx) => (
                    <div key={idx} className="producto-detalle-item">
                      <img 
                        src={`http://localhost:3001/imagenes/${item.imagen}`} 
                        alt={item.Nombre_producto}
                      />
                      <div className="producto-detalle-info">
                        <div className="producto-nombre">{item.Nombre_producto}</div>
                        <div className="producto-descripcion">{item.Descripcion?.substring(0, 60)}...</div>
                        <div className="producto-precio">
                          {item.Cantidad} x ${item.PrecioUnitario.toLocaleString()}
                        </div>
                      </div>
                      <div className="producto-subtotal">
                        ${(item.Cantidad * item.PrecioUnitario).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detalle-resumen">
                <div className="resumen-linea">
                  <span>Subtotal:</span>
                  <span>${detallePedido.Subtotal.toLocaleString()}</span>
                </div>
                <div className="resumen-linea">
                  <span>Envío:</span>
                  <span>{detallePedido.Envio === 0 ? 'Gratis' : `$${detallePedido.Envio.toLocaleString()}`}</span>
                </div>
                <div className="resumen-linea total">
                  <span>Total:</span>
                  <span>${detallePedido.Total.toLocaleString()}</span>
                </div>
              </div>

              <div className="detalle-acciones">
            {pdfListo ? (
              <PDFDownloadLink
                document={
                  <ReciboPDF
                    compra={{
                      items: detallePedido.items,
                      total: detallePedido.Total,
                      subtotal: detallePedido.Subtotal,
                      envio: detallePedido.Envio
                    }}
                    usuario={usuario}
                    fecha={formatearFecha(detallePedido.Fecha)}
                    numeroRecibo={`F-${detallePedido.ID_Pedido.toString().padStart(6, '0')}`}
                  />
                }
                fileName={`recibo_${detallePedido.ID_Pedido}.pdf`}
              >
                {({ loading, error }) => {
                  if (error) return <button className="btn-pdf">❌ Error al generar</button>;
                  return (
                    <button className="btn-pdf" disabled={loading} style={{ backgroundColor: "transparent", margin: "0px" }}>
                      {loading ? 'Generando PDF...' : '📄 Descargar Recibo'}
                    </button>
                  );
                }}
              </PDFDownloadLink>
            ) : (
              <button className="btn-pdf" disabled>
                ⏳ Preparando recibo...
              </button>
            )}
          </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistorialCompras;