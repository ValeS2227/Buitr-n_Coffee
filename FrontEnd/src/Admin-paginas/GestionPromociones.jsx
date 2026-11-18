import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config.js";
import "./estilos-admin/GestionPromociones.css";

const tiposPromocion = [
  ["descuento_porcentaje", "Descuento porcentual"],
  ["descuento_fijo", "Descuento fijo"],
  ["2x1", "2x1"],
  ["puntos_dobles", "Puntos dobles"],
  ["combo", "Combo"],
];

const crearFormularioVacio = () => ({
  Nombre: "",
  Descripcion: "",
  Tipo: "descuento_porcentaje",
  Valor: "",
  Codigo: "",
  ID_Producto: "",
  Minimo_Compra: "",
  Fecha_Inicio: "",
  Fecha_Fin: "",
  Stock_Limite: "",
  Estado: true,
});

const convertirFechaParaFormulario = (fecha) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

function GestionPromociones() {
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(crearFormularioVacio);
  const [promocionEditando, setPromocionEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargarPromociones = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const [promocionesResponse, productosResponse] = await Promise.all([
        axios.get(`${API_URL}/api/promociones/admin/todas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/productos`),
      ]);

      if (!promocionesResponse.data?.success || !Array.isArray(promocionesResponse.data.data)) {
        throw new Error("El servidor devolvió una respuesta inválida para las promociones.");
      }
      if (!Array.isArray(productosResponse.data)) {
        throw new Error("El servidor devolvió una respuesta inválida para los productos.");
      }

      setPromociones(promocionesResponse.data.data);
      setProductos(productosResponse.data);
    } catch (requestError) {
      console.error("Error al cargar promociones:", requestError);
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "No se pudieron cargar las promociones.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPromociones();
  }, [cargarPromociones]);

  const cambiarCampo = (event) => {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const limpiarFormulario = () => {
    setFormulario(crearFormularioVacio());
    setPromocionEditando(null);
  };

  const prepararEdicion = (promocion) => {
    setPromocionEditando(promocion);
    setFormulario({
      Nombre: promocion.Nombre || "",
      Descripcion: promocion.Descripcion || "",
      Tipo: promocion.Tipo || "descuento_porcentaje",
      Valor: promocion.Valor ?? "",
      Codigo: promocion.Codigo || "",
      ID_Producto: promocion.ID_Producto ?? "",
      Minimo_Compra: promocion.Minimo_Compra ?? "",
      Fecha_Inicio: convertirFechaParaFormulario(promocion.Fecha_Inicio),
      Fecha_Fin: convertirFechaParaFormulario(promocion.Fecha_Fin),
      Stock_Limite: promocion.Stock_Limite ?? "",
      Estado: promocion.Estado !== false,
    });
    setError("");
    setExito("");
    document.getElementById("admin-promocion-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const guardarPromocion = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setError("");
    setExito("");

    const token = localStorage.getItem("token");
    const payload = {
      ...formulario,
      Valor: formulario.Valor === "" ? null : Number(formulario.Valor),
      Codigo: formulario.Codigo.trim() || null,
      ID_Producto: formulario.ID_Producto || null,
      Minimo_Compra:
        formulario.Minimo_Compra === "" ? null : Number(formulario.Minimo_Compra),
      Stock_Limite:
        formulario.Stock_Limite === "" ? null : Number(formulario.Stock_Limite),
      Fecha_Inicio: new Date(formulario.Fecha_Inicio).toISOString(),
      Fecha_Fin: new Date(formulario.Fecha_Fin).toISOString(),
      Estado: formulario.Estado === true || formulario.Estado === "true",
    };

    try {
      if (promocionEditando) {
        await axios.put(
          `${API_URL}/api/promociones/admin/actualizar/${promocionEditando.ID_Promocion}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setExito("Promoción actualizada correctamente.");
      } else {
        await axios.post(`${API_URL}/api/promociones/admin/crear`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExito("Promoción creada correctamente.");
      }
      limpiarFormulario();
      await cargarPromociones();
    } catch (requestError) {
      console.error("Error al guardar promoción:", requestError);
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "No se pudo guardar la promoción.",
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarPromocion = async (promocion) => {
    if (!window.confirm(`¿Eliminar la promoción "${promocion.Nombre}"?`)) return;

    setError("");
    setExito("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_URL}/api/promociones/admin/eliminar/${promocion.ID_Promocion}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setExito("Promoción eliminada correctamente.");
      if (promocionEditando?.ID_Promocion === promocion.ID_Promocion) {
        limpiarFormulario();
      }
      await cargarPromociones();
    } catch (requestError) {
      console.error("Error al eliminar promoción:", requestError);
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "No se pudo eliminar la promoción.",
      );
    }
  };

  return (
    <section className="admin-promotions">
      <header className="admin-promotions-heading">
        <div>
          <span className="admin-promotions-eyebrow">ADMINISTRACIÓN DE TIENDA</span>
          <h1>Promociones</h1>
          <p>Crea, consulta y administra los descuentos de Buitrón Coffee.</p>
        </div>
        <button
          className="admin-promotions-refresh"
          disabled={cargando}
          onClick={cargarPromociones}
          type="button"
        >
          {cargando ? "Actualizando..." : "Actualizar lista"}
        </button>
      </header>

      {error && <p className="admin-promotions-message error" role="alert">{error}</p>}
      {exito && <p className="admin-promotions-message success" role="status">{exito}</p>}

      <section className="admin-promotions-panel" id="admin-promocion-form">
        <h2>{promocionEditando ? "Editar promoción" : "Crear promoción"}</h2>
        <form className="admin-promotions-form" onSubmit={guardarPromocion}>
          <label>
            Nombre *
            <input
              maxLength="120"
              name="Nombre"
              onChange={cambiarCampo}
              required
              value={formulario.Nombre}
            />
          </label>
          <label>
            Tipo *
            <select name="Tipo" onChange={cambiarCampo} value={formulario.Tipo}>
              {tiposPromocion.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Valor
            <input
              min="0"
              name="Valor"
              onChange={cambiarCampo}
              step="0.01"
              type="number"
              value={formulario.Valor}
            />
          </label>
          <label>
            Código promocional
            <input
              maxLength="60"
              name="Codigo"
              onChange={cambiarCampo}
              value={formulario.Codigo}
            />
          </label>
          <label className="wide">
            Descripción
            <textarea
              maxLength="500"
              name="Descripcion"
              onChange={cambiarCampo}
              rows="2"
              value={formulario.Descripcion}
            />
          </label>
          <label>
            Producto asociado
            <select
              name="ID_Producto"
              onChange={cambiarCampo}
              value={formulario.ID_Producto}
            >
              <option value="">Todos los productos</option>
              {productos.map((producto) => (
                <option key={producto.ID_Producto} value={producto.ID_Producto}>
                  {producto.Nombre_producto}
                </option>
              ))}
            </select>
          </label>
          <label>
            Compra mínima
            <input
              min="0"
              name="Minimo_Compra"
              onChange={cambiarCampo}
              step="0.01"
              type="number"
              value={formulario.Minimo_Compra}
            />
          </label>
          <label>
            Fecha de inicio *
            <input
              name="Fecha_Inicio"
              onChange={cambiarCampo}
              required
              type="datetime-local"
              value={formulario.Fecha_Inicio}
            />
          </label>
          <label>
            Fecha de fin *
            <input
              name="Fecha_Fin"
              onChange={cambiarCampo}
              required
              type="datetime-local"
              value={formulario.Fecha_Fin}
            />
          </label>
          <label>
            Límite de usos
            <input
              min="1"
              name="Stock_Limite"
              onChange={cambiarCampo}
              type="number"
              value={formulario.Stock_Limite}
            />
          </label>
          {promocionEditando && (
            <label>
              Estado
              <select
                name="Estado"
                onChange={cambiarCampo}
                value={String(formulario.Estado)}
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </label>
          )}
          <div className="admin-promotions-form-actions wide">
            <button disabled={guardando} type="submit">
              {guardando
                ? "Guardando..."
                : promocionEditando
                  ? "Guardar cambios"
                  : "Crear promoción"}
            </button>
            {promocionEditando && (
              <button className="secondary" onClick={limpiarFormulario} type="button">
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-promotions-list-section">
        <div className="admin-promotions-list-heading">
          <h2>Promociones registradas</h2>
          <span>{promociones.length}</span>
        </div>
        {cargando ? (
          <p className="admin-promotions-empty">Cargando promociones...</p>
        ) : promociones.length === 0 ? (
          <p className="admin-promotions-empty">Todavía no hay promociones.</p>
        ) : (
          <div className="admin-promotions-list">
            {promociones.map((promocion) => (
              <article className="admin-promotion-card" key={promocion.ID_Promocion}>
                <div className="admin-promotion-card-heading">
                  <div>
                    <h3>{promocion.Nombre}</h3>
                    <span className={`admin-promotion-status ${promocion.Estado_Texto?.toLowerCase()}`}>
                      {promocion.Estado_Texto || "Registrada"}
                    </span>
                  </div>
                  {promocion.Codigo && (
                    <code className="admin-promotion-code">{promocion.Codigo}</code>
                  )}
                </div>
                {promocion.Descripcion && <p>{promocion.Descripcion}</p>}
                <dl>
                  <div><dt>Tipo</dt><dd>{promocion.Tipo}</dd></div>
                  <div><dt>Valor</dt><dd>{promocion.Valor ?? "—"}</dd></div>
                  <div><dt>Producto</dt><dd>{promocion.Producto_Nombre || "Todos"}</dd></div>
                  <div><dt>Usos</dt><dd>{promocion.Usos_Actuales ?? 0}{promocion.Stock_Limite ? ` / ${promocion.Stock_Limite}` : ""}</dd></div>
                  <div><dt>Vigencia</dt><dd>{promocion.Fecha_Inicio ? new Date(promocion.Fecha_Inicio).toLocaleDateString() : "—"} – {promocion.Fecha_Fin ? new Date(promocion.Fecha_Fin).toLocaleDateString() : "—"}</dd></div>
                </dl>
                <div className="admin-promotion-actions">
                  <button onClick={() => prepararEdicion(promocion)} type="button">Editar</button>
                  <button
                    className="danger"
                    onClick={() => eliminarPromocion(promocion)}
                    type="button"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default GestionPromociones;
