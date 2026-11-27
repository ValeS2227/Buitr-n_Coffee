
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import PQRS from "../paginas/PQRS";

jest.mock("../components/HeaderGlobal", () => () => <header>Header</header>);
jest.mock("../components/Footer", () => () => <footer>Footer</footer>);
jest.mock("../estilos/pqrs.css", () => ({}));

jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3001",
}));

describe("Funcionalidad de consultar PQRS", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );
  });

  test("Debe mostrar la sección Consultar estado de PQRS", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(
      screen.getByRole("heading", {
        name: "Consultar estado de PQRS",
      })
    ).toBeInTheDocument();
  });

  test("Debe mostrar la descripción de consulta", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(
      screen.getByText(/Si ya has realizado una PQRS/)
    ).toBeInTheDocument();
  });

  test("Debe mostrar el botón Consultar estado", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(
      screen.getByRole("link", { name: "Consultar estado" })
    ).toBeInTheDocument();
  });

  test("Debe dirigir a la ruta /consultarpqrs", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(
      screen.getByRole("link", { name: "Consultar estado" })
    ).toHaveAttribute("href", "/consultarpqrs");
  });
});
