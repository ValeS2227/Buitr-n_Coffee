
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "../paginas/Login";

const mockNavigate = jest.fn();

jest.mock("axios", () => ({
  post: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../estilos/login.css", () => ({}));

jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3001",
}));

describe("Navegación del inicio de sesión", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const iniciarSesion = async (rol) => {
    axios.post.mockResolvedValue({
      data: {
        token: "token_prueba",
        usuario: {
          ID_Usuario: 1,
          ID_Rol: rol,
          Nombre_usuario: "Usuario prueba",
        },
      },
    });

    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "usuario@gmail.com" },
    });

    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123456" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "INICIAR SESIÓN" })
    );
  };

  test("Debe dirigir al administrador al panel administrativo", async () => {
    await iniciarSesion(2);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  test("Debe guardar el token del administrador", async () => {
    await iniciarSesion(2);

    await waitFor(() => {
      expect(localStorage.getItem("adminToken")).toBe("token_prueba");
    });
  });

  test("Debe guardar los datos del administrador", async () => {
    await iniciarSesion(2);

    await waitFor(() => {
      const admin = JSON.parse(localStorage.getItem("adminData"));

      expect(admin.ID_Rol).toBe(2);
    });
  });

  test("Debe dirigir al usuario normal al catálogo", async () => {
    await iniciarSesion(1);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/catalogo");
    });
  });

  test("Debe dirigir a recuperación de contraseña", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.click(
      screen.getByRole("button", {
        name: "¿Olvidaste tu contraseña?",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/olvido-contrasena");
  });

  test("Debe dirigir al registro de usuarios", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.click(
      screen.getByRole("button", { name: "Registrarse" })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/registro");
  });

});
