
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Login from "../paginas/Login";
jest.mock("axios", () => ({
  post: jest.fn(),
}));

jest.mock("../estilos/login.css", () => ({}));

jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3001",
}));

describe("Visualización del inicio de sesión", () => {

  test("Debe mostrar la marca Buitrón Coffee", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    expect(screen.getByText("Buitrón Coffee")).toBeInTheDocument();
  });

  test("Debe mostrar el título Iniciar sesión", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    expect(
      screen.getByRole("heading", { name: "Iniciar sesión" })
    ).toBeInTheDocument();
  });

  test("Debe mostrar el campo de correo", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    expect(screen.getByLabelText("Correo")).toBeInTheDocument();
  });

  test("Debe mostrar el campo de contraseña", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
  });

  test("Debe mostrar el botón de iniciar sesión", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    expect(
      screen.getByRole("button", { name: "INICIAR SESIÓN" })
    ).toBeInTheDocument();
  });

  test("Debe permitir mostrar y ocultar la contraseña", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    const clave = screen.getByLabelText("Contraseña");

    expect(clave).toHaveAttribute("type", "password");

    fireEvent.click(
      screen.getByRole("button", { name: "Mostrar contraseña" })
    );

    expect(clave).toHaveAttribute("type", "text");

    fireEvent.click(
      screen.getByRole("button", { name: "Ocultar contraseña" })
    );

    expect(clave).toHaveAttribute("type", "password");
  });

  test("Debe mostrar la opción de registrarse", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    expect(
      screen.getByRole("button", { name: "Registrarse" })
    ).toBeInTheDocument();
  });

  test("Debe mostrar la opción de recuperar contraseña", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    expect(
      screen.getByRole("button", { name: "¿Olvidaste tu contraseña?" })
    ).toBeInTheDocument();
  });

});
