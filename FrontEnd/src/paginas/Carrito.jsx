import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import "../estilos/carrito.css";
import HeaderGlobal from "../components/HeaderGlobal";

function Carrito() {
  const { carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, cargando, obtenerCarrito } = useCarrito();
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const token = localStorage.getItem('token');

  const handleProcederPago = async () => {
    if (!token) {
      alert("Debes iniciar sesión para continuar");
      navigate("/login");
      return;
    }

    setMostrarFormulario(true);
  };

  const confirmarCompra = async () => {
    if (!direccion) {
      alert("Por favor ingresa una dirección de envío");
      return;
    }

    setProcesando(true);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/pedidos/registrar",
        { direccion, metodoPago },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirigir a la página de confirmación con los datos de la compra
      navigate("/confirmacion", { state: { compra: res.data } });
      
    } catch (error) {
      console.error("Error al procesar compra:", error);
      alert(error.response?.data?.message || "Error al procesar la compra");
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return <div className="cargando">Cargando carrito...</div>;
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

  const subtotal = carrito.total;
  const envio = subtotal >= 50000 ? 0 : 5000;
  const total = subtotal + envio;

  return (
    <>
      <HeaderGlobal />
      <div className="carrito-container">
        <h1>Mi Carrito</h1>
        
        <div className="carrito-content">
          <div className="carrito-items">
            <table>
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
                        src={`http://localhost:3001/imagenes/${item.imagen}`} 
                        alt={item.Nombre_producto}
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
              <span>{envio === 0 ? "Gratis" : `$${envio.toLocaleString()}`}</span>
            </div>
            <div className="resumen-linea total">
              <span>Total:</span>
              <span>${total.toLocaleString()}</span>
            </div>

            {!mostrarFormulario ? (
              <button onClick={handleProcederPago} className="btn-primary btn-checkout">
                Proceder al pago
              </button>
            ) : (
              <div className="formulario-pago">
                <h3>Datos de envío</h3>
                <textarea
                  placeholder="Dirección de envío completa"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  rows="3"
                  style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
                />
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
                >
                  <option value="Efectivo">Efectivo contra entrega</option>
                  <option value="Transferencia">Transferencia bancaria</option>
                  <option value="Tarjeta">Tarjeta débito/crédito</option>
                </select>
                <button 
                  onClick={confirmarCompra} 
                  className="btn-primary"
                  disabled={procesando}
                >
                  {procesando ? "Procesando..." : "Confirmar compra"}
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
              <button className="btn-link">
                Seguir comprando
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
    
  );
}

export default Carrito;