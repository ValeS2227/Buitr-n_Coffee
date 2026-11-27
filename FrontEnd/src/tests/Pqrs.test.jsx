import { render, screen, waitFor } from "@testing-library/react";
import PQRS from "../paginas/pqrs";

jest.mock("../config.js", () => ({ API_URL: "http://localhost:3000" }));

// Link simulado: un enlace normal, sin necesitar el router
jest.mock("react-router-dom", () => ({
  Link: ({ to, children }) => require("react").createElement("a", { href: to }, children),
}));

jest.mock("../components/HeaderGlobal", () => ({ __esModule: true, default: () => null }));
jest.mock("../components/Footer", () => ({ __esModule: true, default: () => null }));

describe("Vista PQRS", () => {
  beforeEach(() => {
    jest.clearAllMocks();""
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
    );
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("muestra el título y la explicación de qué es una PQRS", async () => {
    render(<PQRS />);

    expect(screen.getByRole("heading", { name: "PQRS" })).toBeInTheDocument();
    expect(screen.getByText("Quejas, Reclamos, Sugerencias y Felicitaciones")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "¿Qué es un PQRS?" })).toBeInTheDocument();

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("muestra los cuatro tipos de PQRS", async () => {
    render(<PQRS />);

    expect(screen.getByRole("heading", { name: "Preguntas" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Quejas" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Reclamos" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sugerencias" })).toBeInTheDocument();

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("tiene el enlace para realizar una PQRS", async () => {
    render(<PQRS />);

    expect(screen.getByRole("link", { name: /realizar pqrs/i })).toHaveAttribute("href", "/realizarpqrs");

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("tiene el enlace para consultar el estado", async () => {
    render(<PQRS />);

    expect(screen.getByRole("link", { name: /consultar estado/i })).toHaveAttribute("href", "/consultarpqrs");

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("muestra la sección de compromisos", async () => {
    render(<PQRS />);

    expect(screen.getByRole("heading", { name: "Nuestro compromiso contigo" })).toBeInTheDocument();
    expect(screen.getByText(/48 horas hábiles/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Confidencialidad" })).toBeInTheDocument();

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it("pide los productos activos al cargar", async () => {
    render(<PQRS />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/api/productos/activos")
    );
  });

  it("sigue mostrando la página si falla la carga de productos", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network Error")));

    render(<PQRS />);

    await waitFor(() => expect(console.log).toHaveBeenCalled());
    expect(screen.getByRole("heading", { name: "PQRS" })).toBeInTheDocument();
  });
});