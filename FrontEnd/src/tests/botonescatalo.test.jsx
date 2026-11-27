import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFetch, renderCatalogo, productosMock } from "./utils";

jest.mock("../components/HeaderGlobal", () => () => <div>HeaderGlobal</div>);
jest.mock("../components/Footer", () => () => <div>Footer</div>);
jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3001",
  getImagen: (img) => `http://localhost:3001/imagenes/${img}`,
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Catalogo - botones", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockFetch();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("muestra un botón 'Ver más' por cada producto", async () => {
    renderCatalogo();
    const botones = await screen.findAllByRole("button", { name: /ver más/i });
    expect(botones).toHaveLength(productosMock.length);
  });

  test("el primer botón navega a /producto/1", async () => {
    renderCatalogo();
    const botones = await screen.findAllByRole("button", { name: /ver más/i });
    await userEvent.click(botones[0]);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/producto/1");
  });

  test("el segundo botón navega a /producto/2", async () => {
    renderCatalogo();
    const botones = await screen.findAllByRole("button", { name: /ver más/i });
    await userEvent.click(botones[1]);

    expect(mockNavigate).toHaveBeenCalledWith("/producto/2");
  });

  test("no hay botones 'Ver más' cuando no hay productos", async () => {
    mockFetch({ productos: [] });
    renderCatalogo();

    await waitFor(() =>
      expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument()
    );
    expect(screen.queryByRole("button", { name: /ver más/i })).not.toBeInTheDocument();
  });
});