import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const navigationGroups = [
  {
    title: "INICIO",
    links: [{ label: "Resumen", path: "/admin", icon: "⌂", end: true }],
  },
  {
    title: "TIENDA",
    links: [
      { label: "Ver productos", path: "/productos/ver", icon: "▦" },
      { label: "Crear producto", path: "/productos/crear", icon: "+" },
      { label: "Actualizar producto", path: "/productos/actualizar", icon: "↻" },
      { label: "Inhabilitar producto", path: "/productos/inhabilitar", icon: "⊘" },
      { label: "Gestionar pedidos", path: "/admin/pedidos", icon: "▤" },
      { label: "Promociones", path: "/admin/promociones", icon: "%" },
    ],
  },
  {
    title: "GESTIÓN",
    links: [
      { label: "Ver usuarios", path: "/usuarios/ver", icon: "♙" },
      { label: "Inhabilitar usuarios", path: "/usuarios/inhabilitar", icon: "⊗" },
      { label: "Cambiar rol", path: "/usuarios/cambiar-rol", icon: "⇄" },
      { label: "Solicitudes PQRS", path: "/pqrs/ver", icon: "✉" },
      { label: "Reseñas", path: "/resenas/ver", icon: "★" },
    ],
  },
];

const getAdminName = () => {
  for (const key of ["usuario", "adminData"]) {
    const storedData = localStorage.getItem(key);
    if (!storedData) continue;

    try {
      const data = JSON.parse(storedData);
      if (data.Nombre_usuario) return data.Nombre_usuario;
    } catch (error) {
      console.error(`No se pudo leer ${key} desde el almacenamiento local:`, error);
    }
  }

  return "Administrador";
};

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const adminName = getAdminName();
  const initials = adminName.trim().charAt(0).toUpperCase() || "A";

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/index");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <NavLink className="admin-brand" to="/admin" aria-label="Ir al resumen">
          <span className="admin-brand-mark">B</span>
          <span className="admin-brand-copy">
            <strong>Buitrón Coffee</strong>
            <small>Administración</small>
          </span>
        </NavLink>

        <nav className="admin-navigation" aria-label="Navegación del administrador">
          {navigationGroups.map((group) => (
            <section className="admin-nav-group" key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((link) => (
                <NavLink
                  className={({ isActive }) =>
                    `admin-nav-link${isActive ? " active" : ""}`
                  }
                  end={link.end}
                  key={link.path}
                  to={link.path}
                >
                  <span className="admin-nav-icon" aria-hidden="true">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </section>
          ))}
        </nav>

        <div className="admin-sidebar-user">
          <span className="admin-user-avatar">{initials}</span>
          <span className="admin-user-copy">
            <strong>{adminName}</strong>
            <small>Administrador</small>
          </span>
          <button
            className="admin-logout-button"
            onClick={cerrarSesion}
            type="button"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            ↪
          </button>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">Buitrón Coffee / Administración</span>
            <span className="admin-current-path">
              {location.pathname === "/admin" ? "Resumen" : "Gestión del negocio"}
            </span>
          </div>
          <div className="admin-topbar-user">
            <span className="admin-user-avatar">{initials}</span>
            <span>
              <strong>{adminName}</strong>
              <small>Administrador</small>
            </span>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
