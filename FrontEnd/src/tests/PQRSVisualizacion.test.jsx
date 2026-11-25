
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import PQRS from "../paginas/PQRS";

jest.mock("../components/HeaderGlobal", () => () => (
  <header>Header Global</header>
));

jest.mock("../components/Footer", () => () => (
  <footer>Footer Global</footer>
));

jest.mock("../estilos/pqrs.css", () => ({}));

jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3001",
}));

describe("Visualización del módulo PQRS", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );
  });

  test("Debe mostrar el título PQRS", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "PQRS" })).toBeInTheDocument();
  });

  test("Debe mostrar la descripción de PQRS", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);
    expect(screen.getByText("Quejas, Reclamos, Sugerencias y Felicitaciones")).toBeInTheDocument();
  });

  test("Debe mostrar la explicación de PQRS", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);
    expect(screen.getByText("¿Qué es un PQRS?")).toBeInTheDocument();
  });

  test("Debe mostrar las categorías de PQRS", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(screen.getByText("Preguntas")).toBeInTheDocument();
    expect(screen.getByText("Quejas")).toBeInTheDocument();
    expect(screen.getByText("Reclamos")).toBeInTheDocument();
    expect(screen.getByText("Sugerencias")).toBeInTheDocument();
  });

  test("Debe mostrar los beneficios del servicio", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(screen.getByText("Respuesta rápida")).toBeInTheDocument();
    expect(screen.getByText("Confidencialidad")).toBeInTheDocument();
    expect(screen.getByText("Seguimiento")).toBeInTheDocument();
  });

  test("Debe mostrar Header y Footer", () => {
    render(<MemoryRouter><PQRS /></MemoryRouter>);

    expect(screen.getByText("Header Global")).toBeInTheDocument();
    expect(screen.getByText("Footer Global")).toBeInTheDocument();
  });
});
