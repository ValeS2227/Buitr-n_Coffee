import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config.js";
import "./estilos-admin/IndexAdmin.css";

const summaryEndpoints = [
  {
    key: "products",
    label: "Productos registrados",
    path: "/api/productos",
    icon: "▦",
    color: "coffee",
  },
  {
    key: "users",
    label: "Usuarios registrados",
    path: "/api/auth/usuarios",
    icon: "♙",
    color: "purple",
    requiresAuth: true,
  },
  {
    key: "orders",
    label: "Pedidos recibidos",
    path: "/api/pedidos/admin/todos",
    icon: "▤",
    color: "orange",
    requiresAuth: true,
  },
  {
    key: "pqrs",
    label: "Solicitudes PQRS",
    path: "/api/pqrs/admin",
    icon: "✉",
    color: "blue",
    requiresAuth: true,
  },
  {
    key: "reviews",
    label: "Reseñas recibidas",
    path: "/api/resenas/admin",
    icon: "★",
    color: "green",
    requiresAuth: true,
  },
];

const statisticsEndpoint = "/api/estadisticas/resumen-productos";
const topProductsEndpoint = "/api/estadisticas/top-productos";
const stockAlertEndpoint = "/api/estadisticas/alerta-stock";

function IndexAdmin() {
  const [adminName, setAdminName] = useState("Administrador");
  const [metrics, setMetrics] = useState({});
  const [statistics, setStatistics] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [statisticsError, setStatisticsError] = useState(false);
  const [topProductsError, setTopProductsError] = useState(false);
  const [stockAlert, setStockAlert] = useState(null);
  const [stockAlertLoading, setStockAlertLoading] = useState(false);
  const [stockAlertError, setStockAlertError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setStockAlert(null);
    setStockAlertError("");
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const [summaryResults, statisticsResult, topProductsResult] = await Promise.all([
      Promise.allSettled(
        summaryEndpoints.map(({ path, requiresAuth }) =>
          axios.get(`${API_URL}${path}`, {
            headers: requiresAuth ? { Authorization: `Bearer ${token}` } : {},
          }),
        ),
      ),
      axios
        .get(`${API_URL}${statisticsEndpoint}`, {
          headers,
        })
        .then((response) => ({ status: "fulfilled", data: response.data }))
        .catch((error) => ({ status: "rejected", error })),
      axios
        .get(`${API_URL}${topProductsEndpoint}`, { headers })
        .then((response) => ({ status: "fulfilled", data: response.data }))
        .catch((error) => ({ status: "rejected", error })),
    ]);

    const nextMetrics = {};
    summaryResults.forEach((result, index) => {
      const { key, label } = summaryEndpoints[index];
      if (result.status === "fulfilled" && Array.isArray(result.value.data)) {
        nextMetrics[key] = { value: result.value.data.length };
        return;
      }

      if (result.status === "rejected") {
        console.error(`No se pudo cargar el resumen de ${label}:`, result.reason);
      }
      nextMetrics[key] = { error: "No disponible. Intenta actualizar el resumen." };
    });

    if (
      statisticsResult.status === "fulfilled" &&
      statisticsResult.data?.success &&
      statisticsResult.data.data
    ) {
      setStatistics(statisticsResult.data.data);
      setStatisticsError(false);
    } else {
      if (statisticsResult.status === "rejected") {
        console.error(
          "No se pudo cargar el resumen de estadísticas:",
          statisticsResult.error,
        );
      }
      setStatistics(null);
      setStatisticsError(true);
    }

    if (
      topProductsResult.status === "fulfilled" &&
      topProductsResult.data?.success &&
      Array.isArray(topProductsResult.data.data)
    ) {
      setTopProducts(topProductsResult.data.data);
      setTopProductsError(false);
    } else {
      if (topProductsResult.status === "rejected") {
        console.error(
          "No se pudo cargar el top de productos:",
          topProductsResult.error,
        );
      }
      setTopProducts([]);
      setTopProductsError(true);
    }

    setMetrics(nextMetrics);
    setLoading(false);
  }, []);

  const requestStockAlert = async () => {
    setStockAlertLoading(true);
    setStockAlert(null);
    setStockAlertError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}${stockAlertEndpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "No se pudo consultar la alerta de stock.");
      }
      setStockAlert(response.data);
    } catch (error) {
      console.error("No se pudo consultar la alerta de stock:", error);
      setStockAlertError(
        error.response?.data?.message ||
          error.message ||
          "No se pudo consultar la alerta de stock.",
      );
    } finally {
      setStockAlertLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario") || localStorage.getItem("adminData");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.Nombre_usuario) setAdminName(user.Nombre_usuario);
      } catch (error) {
        console.error("No se pudo leer el usuario del administrador:", error);
      }
    }
    loadSummary();
  }, [loadSummary]);

  const hasErrors =
    statisticsError ||
    topProductsError ||
    summaryEndpoints.some(({ key }) => metrics[key]?.error);
  const lowStockProducts = Array.isArray(statistics?.productos_stock_bajo)
    ? statistics.productos_stock_bajo
    : [];

  return (
    <section className="admin-dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="dashboard-eyebrow">PANEL DE CONTROL</span>
          <h1>Hola, {adminName}</h1>
          <p>Este es el resumen general de Buitrón Coffee.</p>
        </div>
        <button
          className="dashboard-refresh"
          onClick={loadSummary}
          type="button"
          disabled={loading}
        >
          {loading ? "Actualizando..." : "↻ Actualizar resumen"}
        </button>
      </div>

      <div className="dashboard-section-title">
        <div>
          <h2>Resumen general</h2>
          <p>Datos actuales consultados desde el sistema.</p>
        </div>
      </div>

      {hasErrors && (
        <p className="dashboard-notice" role="status">
          Algunas cifras no se pudieron cargar. Puedes intentarlo de nuevo con
          “Actualizar resumen”.
        </p>
      )}

      <div className="dashboard-metrics">
        {summaryEndpoints.map(({ key, label, icon, color }) => {
          const metric = metrics[key];
          return (
            <article className={`dashboard-card ${color}`} key={key}>
              <div className="dashboard-card-top">
                <span className="dashboard-card-icon" aria-hidden="true">
                  {icon}
                </span>
                <span className="dashboard-card-label">{label}</span>
              </div>
              <strong className="dashboard-card-value" aria-live="polite">
                {loading ? "…" : metric?.error ? "—" : metric?.value ?? 0}
              </strong>
              {metric?.error && !loading && (
                <span className="dashboard-card-error">{metric.error}</span>
              )}
            </article>
          );
        })}
      </div>

      <section className="dashboard-statistics">
        <div className="dashboard-section-title">
          <div>
            <h2>Estadísticas de productos</h2>
            <p>Información del servicio de estadísticas del negocio.</p>
          </div>
        </div>
        {statisticsError && !loading ? (
          <p className="dashboard-notice" role="status">
            No se pudieron cargar las estadísticas de productos. Actualiza el
            resumen para intentarlo de nuevo.
          </p>
        ) : (
          <div className="dashboard-statistics-grid">
            <article className="dashboard-statistics-panel">
              <h3>Más vendidos</h3>
              {loading ? (
                <p className="dashboard-statistics-empty">Cargando estadísticas...</p>
              ) : topProductsError ? (
                <p className="dashboard-statistics-empty">
                  No se pudo cargar el top de productos.
                </p>
              ) : topProducts.length === 0 ? (
                <p className="dashboard-statistics-empty">
                  No hay productos vendidos para mostrar.
                </p>
              ) : (
                <ol className="dashboard-product-list">
                  {topProducts.slice(0, 5).map((product, index) => (
                    <li
                      key={
                        product.ID_Producto ??
                        product.id ??
                        product.Nombre_producto ??
                        index
                      }
                    >
                      <span className="dashboard-product-rank">{index + 1}</span>
                      <span className="dashboard-product-name">
                        {product.Nombre_producto ??
                          product.nombre_producto ??
                          "Producto"}
                      </span>
                      <strong>
                        {product.total_vendido ??
                          product.cantidad_vendida ??
                          product.unidades_vendidas ??
                          product.total_vendido_unidades ??
                          product.total ??
                          "—"}
                      </strong>
                    </li>
                  ))}
                </ol>
              )}
            </article>

            <article className="dashboard-statistics-panel">
              <div className="dashboard-stock-heading">
                <h3>Stock bajo</h3>
                <span>{loading ? "…" : statistics?.total_stock_bajo ?? lowStockProducts.length}</span>
              </div>
              <button
                className="dashboard-stock-alert-button"
                disabled={stockAlertLoading}
                onClick={requestStockAlert}
                type="button"
              >
                {stockAlertLoading ? "Consultando alerta..." : "Consultar alerta de stock"}
              </button>
              {stockAlertError && (
                <p className="dashboard-stock-alert-error" role="alert">
                  {stockAlertError}
                </p>
              )}
              {stockAlert && (
                <p className="dashboard-stock-alert-result" role="status">
                  {stockAlert.message}
                  {Array.isArray(stockAlert.alertas) && stockAlert.alertas.length > 0 && (
                    <ul>
                      {stockAlert.alertas.map((alerta) => (
                        <li key={alerta}>{alerta}</li>
                      ))}
                    </ul>
                  )}
                </p>
              )}
              {loading ? (
                <p className="dashboard-statistics-empty">Cargando estadísticas...</p>
              ) : lowStockProducts.length === 0 ? (
                <p className="dashboard-statistics-empty">
                  No hay productos con stock bajo.
                </p>
              ) : (
                <ul className="dashboard-product-list stock-list">
                  {lowStockProducts.slice(0, 5).map((product, index) => (
                    <li
                      key={
                        product.ID_Producto ??
                        product.id ??
                        product.Nombre_producto ??
                        index
                      }
                    >
                      <span className="dashboard-product-name">
                        {product.Nombre_producto ??
                          product.nombre_producto ??
                          "Producto"}
                      </span>
                      <strong>{product.Stock ?? product.stock ?? "—"} uds.</strong>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>
        )}
      </section>

      <section className="dashboard-shortcuts">
        <div>
          <span className="dashboard-eyebrow">ACCESO RÁPIDO</span>
          <h2>¿Qué necesitas gestionar?</h2>
          <p>Usa la barra lateral para abrir cualquiera de las vistas del panel.</p>
        </div>
        <div className="dashboard-shortcut-links">
          <span>Productos</span>
          <span>Usuarios</span>
          <span>Pedidos</span>
          <span>PQRS y reseñas</span>
        </div>
      </section>
    </section>
  );
}

export default IndexAdmin;
