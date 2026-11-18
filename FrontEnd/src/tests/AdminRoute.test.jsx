import { render, screen } from "@testing-library/react";
import AdminRoute from "../components/AdminRoute";

jest.mock("react-router-dom", () => ({
  Navigate: ({ to }) => <p>Redirigido a {to}</p>,
}));

describe("AdminRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("permite el acceso cuando el rol administrador viene como texto", () => {
    localStorage.setItem("token", "token-admin");
    localStorage.setItem("usuario", JSON.stringify({ ID_Rol: "2" }));

    render(
      <AdminRoute>
        <p>Crear producto</p>
      </AdminRoute>,
    );

    expect(screen.getByText("Crear producto")).toBeInTheDocument();
  });

  it("redirige a usuarios sin rol administrador", () => {
    localStorage.setItem("token", "token-usuario");
    localStorage.setItem("usuario", JSON.stringify({ ID_Rol: 1 }));

    render(
      <AdminRoute>
        <p>Crear producto</p>
      </AdminRoute>,
    );

    expect(screen.getByText("Redirigido a /catalogo")).toBeInTheDocument();
  });
});
