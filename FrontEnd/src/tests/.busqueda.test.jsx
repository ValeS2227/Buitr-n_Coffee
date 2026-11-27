import { screen } from "@testing-library/react";
import { mockFetch, renderCatalogo } from "./utils";

jest.mock("../components/HeaderGlobal", () => () => <div>HeaderGlobal</div>);
jest.mock("../components/Footer", () => () => <div>Footer</div>);
jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3001",
  getImagen: (img) => `http://localhost:3001/imagenes/${img}`,
}));

const TOSTADO = "Café Tostado";
const GEISHA = "Café Geisha";
const BOURBON = "Café Bourbon Rosado";

describe("Catalogo - búsqueda", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockFetch();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("sin parámetro search muestra todos los productos", async () => {
    renderCatalogo("/catalogo");

    expect(await screen.findByText(TOSTADO)).toBeInTheDocument();
    expect(screen.getByText(GEISHA)).toBeInTheDocument();
    expect(screen.getByText(BOURBON)).toBeInTheDocument();
  });

  test("con ?search=geisha muestra solo ese producto", async () => {
    renderCatalogo("/catalogo?search=geisha");

    expect(await screen.findByText(GEISHA)).toBeInTheDocument();
    expect(screen.queryByText(TOSTADO)).not.toBeInTheDocument();
    expect(screen.queryByText(BOURBON)).not.toBeInTheDocument();
  });

  test("la búsqueda coincide con varios productos", async () => {
    renderCatalogo("/catalogo?search=café");

    expect(await screen.findByText(TOSTADO)).toBeInTheDocument();
    expect(screen.getByText(GEISHA)).toBeInTheDocument();
    expect(screen.getByText(BOURBON)).toBeInTheDocument();
  });

  test("ignora mayúsculas y minúsculas", async () => {
    renderCatalogo("/catalogo?search=BOURBON");

    expect(await screen.findByText(BOURBON)).toBeInTheDocument();
    expect(screen.queryByText(TOSTADO)).not.toBeInTheDocument();
  });

  test("ignora las tildes: 'cafe' encuentra 'Café'", async () => {
    renderCatalogo("/catalogo?search=cafe");

    expect(await screen.findByText(TOSTADO)).toBeInTheDocument();
    expect(screen.getByText(GEISHA)).toBeInTheDocument();
    expect(screen.getByText(BOURBON)).toBeInTheDocument();
  });

  test("funciona con coincidencias parciales", async () => {
    renderCatalogo("/catalogo?search=bour");

    expect(await screen.findByText(BOURBON)).toBeInTheDocument();
    expect(screen.queryByText(GEISHA)).not.toBeInTheDocument();
  });

  test("también busca en la descripción", async () => {
    // "picante" solo está en la descripción de Café Geisha
    renderCatalogo("/catalogo?search=picante");

    expect(await screen.findByText(GEISHA)).toBeInTheDocument();
    expect(screen.queryByText(TOSTADO)).not.toBeInTheDocument();
    expect(screen.queryByText(BOURBON)).not.toBeInTheDocument();
  });

  test("también busca en la categoría", async () => {
    // "fino" solo está en la categoría de Café Bourbon Rosado
    renderCatalogo("/catalogo?search=fino");

    expect(await screen.findByText(BOURBON)).toBeInTheDocument();
    expect(screen.queryByText(TOSTADO)).not.toBeInTheDocument();
    expect(screen.queryByText(GEISHA)).not.toBeInTheDocument();
  });

  test("si nada coincide muestra 'No se encontraron productos'", async () => {
    renderCatalogo("/catalogo?search=pizza");

    expect(await screen.findByText(/no se encontraron productos/i)).toBeInTheDocument();
    expect(screen.queryByText(TOSTADO)).not.toBeInTheDocument();
  });

  test("con ?search= vacío muestra todos los productos", async () => {
    renderCatalogo("/catalogo?search=");

    expect(await screen.findByText(TOSTADO)).toBeInTheDocument();
    expect(screen.getByText(GEISHA)).toBeInTheDocument();
    expect(screen.getByText(BOURBON)).toBeInTheDocument();
  });

  test("el filtrado es en el cliente: un solo fetch de productos", async () => {
    renderCatalogo("/catalogo?search=geisha");
    await screen.findByText(GEISHA);

    const llamadasProductos = global.fetch.mock.calls.filter(([url]) =>
      url.includes("/api/productos/activos")
    );
    expect(llamadasProductos).toHaveLength(1);
  });
});