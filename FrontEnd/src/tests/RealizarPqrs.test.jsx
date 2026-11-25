
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

describe("Funcionalidad de realizar PQRS", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );
  });

  test("Debe mostrar la sección Realizar una PQRS", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(
      screen.getByRole("heading", { name: "Realizar una PQRS" })
    ).toBeInTheDocument();
  });

  test("Debe mostrar la descripción para realizar PQRS", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(
      screen.getByText(/Si tienes alguna queja, reclamo, sugerencia o felicitación/)
    ).toBeInTheDocument();
  });

  test("Debe mostrar el botón Realizar PQRS", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(
      screen.getByRole("link", { name: "Realizar PQRS" })
    ).toBeInTheDocument();
  });

  test("Debe dirigir a la ruta /realizarpqrs", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(
      screen.getByRole("link", { name: "Realizar PQRS" })
    ).toHaveAttribute("href", "/realizarpqrs");
  });
});
