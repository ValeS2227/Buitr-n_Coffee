import { screen, waitFor } from "@testing-library/react";
import { mockFetch, renderCatalogo, productosMock, formatoPrecio } from "./utils";

jest.mock("../components/HeaderGlobal", () => () => <div>HeaderGlobal</div>);
jest.mock("../components/Footer", () => () => <div>Footer</div>);
jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3001",
  getImagen: (img) => `http://localhost:3001/imagenes/${img}`,
}));

describe("Catalogo - renderizado", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockFetch();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("muestra 'Cargando productos...' mientras llega la respuesta", () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    renderCatalogo();

    expect(screen.getByText(/cargando productos/i)).toBeInTheDocument();
    expect(screen.getByText("HeaderGlobal")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  test("llama a los endpoints de productos y promociones", async () => {
    renderCatalogo();
    await screen.findByText("Café Tostado");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/productos/activos"
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/promociones/activas"
    );
  });

  test("muestra el título y la descripción del hero", async () => {
    renderCatalogo();

    expect(
      await screen.findByRole("heading", { name: "Productos", level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText(/mejor calidad para tu mesa/i)).toBeInTheDocument();
  });

  test("muestra nombre, descripción y precio de cada producto", async () => {
    renderCatalogo();
    await screen.findByText("Café Tostado");

    productosMock.forEach((p) => {
      expect(screen.getByText(p.Nombre_producto)).toBeInTheDocument();
      expect(screen.getByText(p.Descripcion)).toBeInTheDocument();
      expect(screen.getByText(formatoPrecio(p.Precio))).toBeInTheDocument();
    });
  });

  test("la imagen tiene el src y el alt correctos", async () => {
    renderCatalogo();

    const img = await screen.findByAltText("Café Tostado");
    expect(img).toHaveAttribute("src", "http://localhost:3001/imagenes/tostado.jpg");
  });

  test("renderiza 5 estrellas por producto", async () => {
    renderCatalogo();
    await screen.findByText("Café Tostado");

    const cards = document.querySelectorAll(".card");
    expect(cards).toHaveLength(3);
    cards.forEach((card) => {
      const total =
        card.querySelectorAll(".estrella-llena").length +
        card.querySelectorAll(".estrella-vacia").length;
      expect(total).toBe(5);
    });
  });

  test("pinta las estrellas llenas según la calificación (redondeada)", async () => {
    renderCatalogo();

    const card1 = (await screen.findByText("Café Tostado")).closest(".card");
    const card2 = screen.getByText("Café Geisha").closest(".card");

    // 4.5 -> Math.round = 5 llenas
    expect(card1.querySelectorAll(".estrella-llena")).toHaveLength(5);
    expect(card1.querySelectorAll(".estrella-vacia")).toHaveLength(0);

    // 3 -> 3 llenas y 2 vacías
    expect(card2.querySelectorAll(".estrella-llena")).toHaveLength(3);
    expect(card2.querySelectorAll(".estrella-vacia")).toHaveLength(2);
  });

  test("si no hay calificación, todas las estrellas están vacías", async () => {
    mockFetch({ productos: [{ ...productosMock[0], calificacion_promedio: null }] });
    renderCatalogo();

    const card = (await screen.findByText("Café Tostado")).closest(".card");
    expect(card.querySelectorAll(".estrella-llena")).toHaveLength(0);
    expect(card.querySelectorAll(".estrella-vacia")).toHaveLength(5);
  });

  test("muestra 'No se encontraron productos' si la lista viene vacía", async () => {
    mockFetch({ productos: [] });
    renderCatalogo();

    expect(await screen.findByText(/no se encontraron productos/i)).toBeInTheDocument();
  });

  test("si el fetch de productos falla, deja de cargar y muestra el estado vacío", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));
    renderCatalogo();

    await waitFor(() =>
      expect(screen.queryByText(/cargando productos/i)).not.toBeInTheDocument()
    );
    expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument();
  });

  test("si el servidor responde con error (ok: false), muestra el estado vacío", async () => {
    mockFetch({ productosOk: false });
    renderCatalogo();

    expect(await screen.findByText(/no se encontraron productos/i)).toBeInTheDocument();
  });

  test("si la respuesta no es un arreglo, muestra el estado vacío", async () => {
    mockFetch({ productos: { mensaje: "raro" } });
    renderCatalogo();

    expect(await screen.findByText(/no se encontraron productos/i)).toBeInTheDocument();
  });
});