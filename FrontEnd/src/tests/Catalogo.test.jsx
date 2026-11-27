import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Catalogo from "../paginas/catalogo";

jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3000",
  getImagen: (imagen) => (imagen ? `http://imagenes/${imagen}` : "/sin-imagen.png"),
}));

const mockNavigate = jest.fn();
let mockLocation = { search: "" };

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Se simulan los componentes que no son parte de esta vista
jest.mock("../components/HeaderGlobal", () => ({ __esModule: true, default: () => null }));
jest.mock("../components/Footer", () => ({ __esModule: true, default: () => null }));

const productos = [
  {
    ID_Producto: 1,
    Nombre_producto: "Café molido 500g",
    Descripcion: "Café tostado y molido",
    Categoria: "Café",
    Precio: 25000,
    imagen: "cafe.jpg",
    calificacion_promedio: 4.5,
  },
  {
    ID_Producto: 2,
    Nombre_producto: "Chocolate artesanal",
    Descripcion: "Chocolate de mesa",
    Categoria: "Chocolates",
    Precio: 18000,
    imagen: "chocolate.jpg",
    calificacion_promedio: 4,
  },
];

const promociones = [
  {
    ID_Promocion: 1,
    Nombre: "Fin de semana del café",
    Tipo: "descuento_porcentaje",
    Valor: 20,
    Descripcion: "Descuento en café molido",
    Codigo: "CAFE20",
  },
];

// Responde según la URL que pida el componente
const simularFetch = ({ productosRespuesta, promocionesRespuesta } = {}) => {
  global.fetch = jest.fn((url) => {
    if (url.includes("/api/productos/activos")) {
      return productosRespuesta ?? Promise.resolve({ ok: true, json: () => Promise.resolve(productos) });
    }
    if (url.includes("/api/promociones/activas")) {
      return (
        promocionesRespuesta ??
        Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, data: [] }) })
      );
    }
    return Promise.reject(new Error("URL no simulada: " + url));
  });
};

describe("Vista Catálogo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation = { search: "" };
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("muestra 'Cargando productos...' mientras llegan los datos", () => {
    global.fetch = jest.fn(() => new Promise(() => {})); // nunca responde

    render(<Catalogo />);

    expect(screen.getByText("Cargando productos...")).toBeInTheDocument();
  });

  it("muestra los productos con su nombre y precio", async () => {
    simularFetch();

    render(<Catalogo />);

    expect(await screen.findByRole("heading", { name: "Café molido 500g" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Chocolate artesanal" })).toBeInTheDocument();
    expect(screen.getByText("$25.000")).toBeInTheDocument();
    expect(screen.getByText("$18.000")).toBeInTheDocument();
    expect(screen.getByAltText("Café molido 500g")).toHaveAttribute("src", "http://imagenes/cafe.jpg");
  });

  it("muestra el título de la página", async () => {
    simularFetch();

    render(<Catalogo />);

    expect(await screen.findByRole("heading", { name: "Productos" })).toBeInTheDocument();
  });

  it("muestra 'No se encontraron productos' si la lista está vacía", async () => {
    simularFetch({
      productosRespuesta: Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
    });

    render(<Catalogo />);

    expect(await screen.findByText("No se encontraron productos")).toBeInTheDocument();
  });

  it("muestra 'No se encontraron productos' si falla la carga", async () => {
    simularFetch({ productosRespuesta: Promise.resolve({ ok: false }) });

    render(<Catalogo />);

    expect(await screen.findByText("No se encontraron productos")).toBeInTheDocument();
  });

  it("filtra por el texto de búsqueda sin importar tildes", async () => {
    mockLocation = { search: "?search=cafe" }; // sin tilde
    simularFetch();

    render(<Catalogo />);

    expect(await screen.findByRole("heading", { name: "Café molido 500g" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Chocolate artesanal" })).not.toBeInTheDocument();
  });

  it("navega al detalle al pulsar 'Ver más'", async () => {
    simularFetch();

    render(<Catalogo />);

    const botones = await screen.findAllByRole("button", { name: /ver más/i });
    await userEvent.click(botones[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/producto/1");
  });

  it("muestra las promociones activas", async () => {
    simularFetch({
      promocionesRespuesta: Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: promociones }),
      }),
    });

    render(<Catalogo />);

    expect(await screen.findByText("Promociones para disfrutar")).toBeInTheDocument();
    expect(screen.getByText("20% OFF")).toBeInTheDocument();
    expect(screen.getByText("Fin de semana del café")).toBeInTheDocument();
    expect(screen.getByText("CAFE20")).toBeInTheDocument();
  });

  it("muestra un aviso si fallan las promociones, pero sigue mostrando los productos", async () => {
    simularFetch({ promocionesRespuesta: Promise.resolve({ ok: false }) });

    render(<Catalogo />);

    expect(await screen.findByRole("status")).toHaveTextContent("No se pudieron cargar las promociones.");
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Café molido 500g" })).toBeInTheDocument()
    );
  });
});