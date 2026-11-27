
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Login from "../paginas/Login";

jest.mock("axios", () => ({
  post: jest.fn(),
}));

jest.mock("../estilos/login.css", () => ({}));

jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3001",
}));

describe("Autenticación del usuario", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("Debe enviar los datos de inicio de sesión correctamente", async () => {
    axios.post.mockResolvedValue({
      data: {
        token: "token_prueba",
        usuario: {
          ID_Usuario: 1,
          ID_Rol: 1,
          Nombre_usuario: "Usuario prueba",
        },
      },
    });

    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "  USUARIO@GMAIL.COM  " },
    });

    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123456" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "INICIAR SESIÓN" })
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3001/api/auth/login",
        {
          Correo: "usuario@gmail.com",
          Clave: "123456",
        }
      );
    });
  });

  test("Debe guardar el token en localStorage", async () => {
    axios.post.mockResolvedValue({
      data: {
        token: "token_prueba",
        usuario: { ID_Usuario: 1, ID_Rol: 1 },
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

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("token_prueba");
    });
  });

  test("Debe guardar los datos del usuario", async () => {
    const usuario = {
      ID_Usuario: 1,
      ID_Rol: 1,
      Nombre_usuario: "Usuario prueba",
    };

    axios.post.mockResolvedValue({
      data: {
        token: "token_prueba",
        usuario,
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

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("usuario"))).toEqual(usuario);
    });
  });

  test("Debe mostrar un mensaje cuando las credenciales son incorrectas", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          message: "Credenciales incorrectas",
        },
      },
    });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "usuario@gmail.com" },
    });

    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "incorrecta" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "INICIAR SESIÓN" })
    );

    expect(
      await screen.findByText("Credenciales incorrectas")
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  test("Debe mostrar un mensaje si ocurre un error sin respuesta del servidor", async () => {
    axios.post.mockRejectedValue(new Error("Error de conexión"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

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

    expect(
      await screen.findByText("Correo o contraseña incorrectos")
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

});
