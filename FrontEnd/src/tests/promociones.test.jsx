import { screen } from "@testing-library/react";
import { mockFetch, renderCatalogo } from "./utils";

jest.mock("../components/HeaderGlobal", () => () => <div>HeaderGlobal</div>);
jest.mock("../components/Footer", () => () => <div>Footer</div>);
jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3001",
  getImagen: (img) => `http://localhost:3001/imagenes/${img}`,
}));

const promociones = [
  {
    ID_Promocion: 1,
    Nombre: "Promo Verano",
    Descripcion: "Descuento especial",
    Tipo: "descuento_porcentaje",
    Valor: 20,
    Producto_Nombre: "Café Geisha",
    Codigo: "VERANO20",
  },
  {
    ID_Promocion: 2,
    Nombre: "Lleva dos",
    Tipo: "2x1",
  },
];

describe("Catalogo - promociones", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("muestra la sección y las tarjetas de promociones activas", async () => {
    mockFetch({ promociones });
    renderCatalogo();

    expect(await screen.findByText("Promociones para disfrutar")).toBeInTheDocument();
    expect(screen.getByText("Promo Verano")).toBeInTheDocument();
    expect(screen.getByText("Lleva dos")).toBeInTheDocument();
  });

  test("muestra la insignia según el tipo de promoción", async () => {
    mockFetch({ promociones });
    renderCatalogo();

    expect(await screen.findByText("20% OFF")).toBeInTheDocument();
    expect(screen.getByText("2x1")).toBeInTheDocument();
  });

  test("muestra descripción, producto y código cuando existen", async () => {
    mockFetch({ promociones });
    renderCatalogo();

    expect(await screen.findByText("Descuento especial")).toBeInTheDocument();
    expect(screen.getByText("Aplica para: Café Geisha")).toBeInTheDocument();
    expect(screen.getByText("VERANO20")).toBeInTheDocument();
  });

  test("sin promociones no muestra la sección", async () => {
    mockFetch({ promociones: [] });
    renderCatalogo();

    await screen.findByText("Café Tostado");
    expect(screen.queryByText("Promociones para disfrutar")).not.toBeInTheDocument();
  });

  test("si la API de promociones responde success:false, muestra el mensaje de error", async () => {
    mockFetch({ promocionesRespuesta: { success: false, message: "Fallo en promos" } });
    renderCatalogo();

    expect(await screen.findByRole("status")).toHaveTextContent("Fallo en promos");
    // Los productos se siguen mostrando
    expect(screen.getByText("Café Tostado")).toBeInTheDocument();
  });
});