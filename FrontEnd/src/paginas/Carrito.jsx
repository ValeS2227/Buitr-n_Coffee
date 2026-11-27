import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config.js";
import Footer from "../components/Footer";
import "../estilos/carrito.css";
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReciboPDF from "../components/ReciboPDF";
import HeaderGlobal from "../components/HeaderGlobal";

function Carrito() {
  const { carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, cargando } = useCarrito();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [pedidoCompletado, setPedidoCompletado] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [errorDetalle, setErrorDetalle] = useState("");
  const [codigoPromocion, setCodigoPromocion] = useState("");
  const [promocionAplicada, setPromocionAplicada] = useState(null);
  const [validandoPromocion, setValidandoPromocion] = useState(false);
  const [mensajePromocion, setMensajePromocion] = useState("");
  const [errorPromocion, setErrorPromocion] = useState("");

  const token = localStorage.getItem('token');

  const subtotal = Number(carrito.total) || 0;
  const costoEnvio = subtotal >= 50000 ? 0 : 5000;
  const carritoFingerprint = JSON.stringify(
    carrito.items.map((item) => [item.ID_Producto, item.Cantidad, item.Precio]),
  );
  const promocionVigente =
    promocionAplicada?.carritoFingerprint === carritoFingerprint
      ? promocionAplicada
      : null;
  const total = Math.max(0, subtotal + costoEnvio - (promocionVigente?.descuento || 0));

  const aplicarCodigoPromocion = async () => {
    if (!token) {
      setErrorPromocion("Inicia sesión para aplicar un código promocional.");
      return;
    }
    if (!codigoPromocion.trim()) {
      setErrorPromocion("Escribe el código de la promoción.");
      return;
    }

    setValidandoPromocion(true);
    setErrorPromocion("");
    setMensajePromocion("");
    setPromocionAplicada(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/promociones/aplicar`,
        {
          codigo: codigoPromocion.trim(),
          subtotal,
          items: carrito.items.map((item) => ({
            ID_Producto: item.ID_Producto,
            Nombre_producto: item.Nombre_producto,
            Cantidad: item.Cantidad,
            Precio: item.Precio,
            PrecioUnitario: item.Precio,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.data?.success || !response.data.data) {
        throw new Error(response.data?.message || "No se pudo aplicar la promoción.");
      }

      setPromocionAplicada({
        codigo: codigoPromocion.trim(),
        descuento: Number(response.data.data.descuento) || 0,
        carritoFingerprint,
      });
      setMensajePromocion(response.data.data.mensaje || "Promoción aplicada.");
    } catch (error) {
      console.error("Error al aplicar código promocional:", error);
      setErrorPromocion(
        error.response?.data?.message ||
          error.message ||
          "No se pudo validar el código promocional.",
      );
    } finally {
      setValidandoPromocion(false);
    }
  };

  const quitarPromocion = () => {
    setPromocionAplicada(null);
    setCodigoPromocion("");
    setMensajePromocion("");
    setErrorPromocion("");
  };

  const handleProcederPago = async () => {
    if (!token) {
      alert("Debes iniciar sesión para continuar");
      navigate("/login");
      return;
    }

    try {
      const usuarioRes = await axios.get(`${API_URL}/api/auth/perfil`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuario(usuarioRes.data);
      setMostrarFormulario(true);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      alert("Error al obtener datos del usuario");
    }
  };

  const confirmarCompra = async () => {
    if (!usuario) {
      alert("Error: No se encontraron datos del usuario");
      return;
    }

    if (!carrito.items || carrito.items.length === 0) {
      alert("Error: El carrito está vacío");
      return;
    }

    setProcesando(true);

    try {
      const pedidoData = {
        ID_Usuario: usuario.ID_Usuario,
        metodoPago,
        ...(promocionVigente && { codigoPromocion: promocionVigente.codigo }),
      };

      const pedidoRes = await axios.post(`${API_URL}/api/pedidos`, pedidoData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pedido = pedidoRes.data.pedido || {};

      setPedidoCompletado({
        id: pedidoRes.data.ID_Pedido,
        items: carrito.items,
        subtotal: Number(pedido.subtotal ?? subtotal),
        descuento: Number(pedido.descuento ?? 0),
        total: Number(pedido.total ?? total),
        fecha: new Date().toISOString(),
        fecha_limite: pedidoRes.data.fecha_limite,
        metodoPago: metodoPago
      });

      await vaciarCarrito();
      
    } catch (error) {
      console.error("Error al procesar compra:", error);
      alert(error.response?.data?.message || "Error al procesar la compra");
      setProcesando(false);
    }
  };

  if (cargando) {
    return <div className="cargando">Cargando carrito...</div>;
  }

  // Mostrar recibo después de la compra
  if (pedidoCompletado && usuario) {
    return (
      <>
        <HeaderGlobal />
        <div className="recibo-container">
          <div className="recibo-card">
            <h1>¡Pedido realizado con éxito!</h1>
            <p>Tu pedido ha sido procesado correctamente.</p>
            <p><strong>Número de pedido:</strong> #{pedidoCompletado.id}</p>
            <p><strong>Fecha límite de pago:</strong> {new Date(pedidoCompletado.fecha_limite).toLocaleString()}</p>
            <p><strong>Subtotal:</strong> ${Number(pedidoCompletado.subtotal).toLocaleString()}</p>
            {pedidoCompletado.descuento > 0 && (
              <p><strong>Descuento:</strong> -${Number(pedidoCompletado.descuento).toLocaleString()}</p>
            )}
            <p><strong>Total:</strong> ${Number(pedidoCompletado.total).toLocaleString()}</p>
            
            <div className="recibo-actions">
              <PDFDownloadLink
                document={
                  <ReciboPDF
                    compra={{
                      items: pedidoCompletado.items,
                      subtotal: pedidoCompletado.subtotal,
                      total: pedidoCompletado.total,
                      metodoPago: pedidoCompletado.metodoPago
                    }}
                    usuario={usuario}
                    fecha={new Date(pedidoCompletado.fecha).toLocaleString()}
                    fechaLimite={new Date(pedidoCompletado.fecha_limite).toLocaleString()}
                    numeroRecibo={`F-${pedidoCompletado.id.toString().padStart(6, '0')}`}
                  />
                }
                fileName={`recibo_${pedidoCompletado.id}.pdf`}
              >
                {({ loading, error }) => {
                  if (error) {
                    console.error("Error PDF:", error);
                    return <button className="btn-error">Error al generar PDF</button>;
                  }
                  return (
                    <button className="btn-descargar" disabled={loading}>
                      {loading ? "Generando PDF..." : "📄 Descargar Recibo"}
                    </button>
                  );
                }}
              </PDFDownloadLink>
              
              <button className="btn-seguir" onClick={() => navigate("/catalogo")}>
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (carrito.items.length === 0) {
    return (
      <>
        <HeaderGlobal />
        <div className="carrito-vacio">
          <h2>Tu carrito está vacío</h2>
          <Link to="/catalogo">
            <button className="btn-primary">Ver productos</button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderGlobal />
      <div className="carrito-container">
        <h1>Mi Carrito</h1>
        
        {errorDetalle && (
          <div className="error-detalle" style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
            {errorDetalle}
          </div>
        )}

        <div className="carrito-content">
          <div className="carrito-items">
            <table className="carrito-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.items.map((item) => (
                  <tr key={item.ID_Carrito}>
                    <td className="producto-info">
                      <img 
                        src={`${API_URL}/imagenes/${item.imagen}`} 
                        alt={item.Nombre_producto}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                      />
                      <div>
                        <h3>{item.Nombre_producto}</h3>
                        <p>{item.Descripcion?.substring(0, 50)}...</p>
                      </div>
                    </td>
                    <td>${item.Precio.toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.Cantidad}
                        onChange={(e) => actualizarCantidad(item.ID_Carrito, parseInt(e.target.value))}
                        className="cantidad-input"
                      />
                    </td>
                    <td>${(item.Precio * item.Cantidad).toLocaleString()}</td>
                    <td>
                      <button 
                        onClick={() => eliminarDelCarrito(item.ID_Carrito)}
                        className="btn-eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="carrito-resumen">
            <h2>Resumen del pedido</h2>
            <div className="resumen-linea">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="resumen-linea">
              <span>Envío:</span>
              <span>{costoEnvio === 0 ? "Gratis" : `$${costoEnvio.toLocaleString()}`}</span>
            </div>
            <div className="promocion-carrito">
              <label htmlFor="codigo-promocion">Código promocional</label>
              <div className="promocion-carrito-campo">
                <input
                  id="codigo-promocion"
                  value={codigoPromocion}
                  onChange={(event) => {
                    setCodigoPromocion(event.target.value);
                    setErrorPromocion("");
                    if (promocionAplicada) {
                      setPromocionAplicada(null);
                      setMensajePromocion("");
                    }
                  }}
                  placeholder="Ingresa tu código"
                  disabled={validandoPromocion || procesando}
                />
                <button
                  type="button"
                  onClick={aplicarCodigoPromocion}
                  disabled={validandoPromocion || procesando}
                >
                  {validandoPromocion ? "Validando..." : "Aplicar"}
                </button>
              </div>
              {promocionVigente && (
                <div className="promocion-carrito-aplicada">
                  <span>{mensajePromocion}</span>
                  <button type="button" onClick={quitarPromocion}>Quitar</button>
                </div>
              )}
              {promocionAplicada && !promocionVigente && (
                <p className="promocion-carrito-aviso">
                  El carrito cambió. Vuelve a aplicar el código para actualizar el descuento.
                </p>
              )}
              {errorPromocion && <p className="promocion-carrito-error" role="alert">{errorPromocion}</p>}
            </div>
            {promocionVigente?.descuento > 0 && (
              <div className="resumen-linea promocion-descuento">
                <span>Descuento:</span>
                <span>-${promocionVigente.descuento.toLocaleString()}</span>
              </div>
            )}
            <div className="resumen-linea total">
              <span>Total:</span>
              <span>${total.toLocaleString()}</span>
            </div>

            {!mostrarFormulario ? (
              <button
                onClick={handleProcederPago}
                className="btn-primary btn-checkout"
                disabled={validandoPromocion}
              >
                Continuar con el Pedido
              </button>
            ) : (
              <div className="formulario-pago">
                <div className="form-group">
                  <label>Método de pago:</label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="metodo-select"
                  >
                    <option value="Efectivo">Efectivo contra entrega</option>
                    <option value="Transferencia">Transferencia bancaria</option>
                    <option value="Tarjeta">Tarjeta débito/crédito</option>
                  </select>
                </div>
                <button 
                  onClick={confirmarCompra} 
                  className="btn-primary"
                  disabled={procesando || validandoPromocion}
                >
                  {procesando ? "Procesando..." : "Confirmar Pedido"}
                </button>
                <button 
                  onClick={() => setMostrarFormulario(false)} 
                  className="btn-secundario"
                >
                  Cancelar
                </button>
              </div>
            )}
            
            <button onClick={vaciarCarrito} className="btn-secundario">
              Vaciar carrito
            </button>
            
            <Link to="/catalogo">
              <button className="btn-link">Seguir comprando</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Carrito;