import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductoDetalle from "../paginas/ProductoDetalle";

jest.mock("../config.js", () => ({
  API_URL: "http://localhost:3000",
  getImagen: (imagen) => (imagen ? `http://imagenes/${imagen}` : "/sin-imagen.png"),
}));

jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
}));

const mockAgregarAlCarrito = jest.fn();
jest.mock("../context/CarritoContext", () => ({
  useCarrito: () => ({ agregarAlCarrito: mockAgregarAlCarrito }),
}));

jest.mock("../components/HeaderGlobal", () => ({ __esModule: true, default: () => null }));
jest.mock("../components/Footer", () => ({ __esModule: true, default: () => null }));
jest.mock("../components/ResenasProducto", () => ({ __esModule: true, default: () => null }));

const producto = {
  ID_Producto: 1,
  Nombre_producto: "Café molido 500g",
  Descripcion: "Café tostado y molido",
  Categoria: "Café",
  Precio: 25000,
  Stock: 10,
  imagen: "cafe.jpg",
  calificacion_promedio: 4.5,
  total_resenas: 3,
};

const simularProducto = (datos) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(datos) })
  );
};

describe("Vista ProductoDetalle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("muestra 'Cargando producto...' mientras llegan los datos", () => {
    global.fetch = jest.fn(() => new Promise(() => {}));

    render(<ProductoDetalle />);

    expect(screen.getByText("Cargando producto...")).toBeInTheDocument();
  });

  it("pide al backend el producto del id de la URL", async () => {
    simularProducto(producto);

    render(<ProductoDetalle />);
    await screen.findByRole("heading", { name: "Café molido 500g" });

    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/api/productos/1");
  });

  it("muestra los datos del producto", async () => {
    simularProducto(producto);

    render(<ProductoDetalle />);

    expect(await screen.findByRole("heading", { name: "Café molido 500g" })).toBeInTheDocument();
    expect(screen.getByText("Café tostado y molido")).toBeInTheDocument();
    expect(screen.getByText(/Categoría: Café/)).toBeInTheDocument();
    expect(screen.getByText(/Stock disponible: 10 unidades/)).toBeInTheDocument();
    expect(screen.getByText("$25.000")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(3 reseñas)")).toBeInTheDocument();
    expect(screen.getByAltText("Café molido 500g")).toHaveAttribute("src", "http://imagenes/cafe.jpg");
  });

  it("muestra un texto por defecto si no hay descripción", async () => {
    simularProducto({ ...producto, Descripcion: "" });

    render(<ProductoDetalle />);

    expect(await screen.findByText("Sin descripción disponible")).toBeInTheDocument();
  });

  it("agrega al carrito 1 unidad por defecto", async () => {
    simularProducto(producto);

    render(<ProductoDetalle />);

    await userEvent.click(await screen.findByRole("button", { name: /agregar al carrito/i }));

    expect(mockAgregarAlCarrito).toHaveBeenCalledWith(1, 1);
  });

  it("agrega al carrito la cantidad elegida", async () => {
    simularProducto(producto);

    render(<ProductoDetalle />);

    const cantidad = await screen.findByRole("spinbutton");
    fireEvent.change(cantidad, { target: { value: "3" } });
    await userEvent.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    expect(mockAgregarAlCarrito).toHaveBeenCalledWith(1, 3);
  });

  it("ignora una cantidad mayor al stock", async () => {
    simularProducto(producto);

    render(<ProductoDetalle />);

    const cantidad = await screen.findByRole("spinbutton");
    fireEvent.change(cantidad, { target: { value: "50" } });

    expect(cantidad).toHaveValue(1);
  });

  it("deshabilita el botón si el producto está agotado", async () => {
    simularProducto({ ...producto, Stock: 0 });

    render(<ProductoDetalle />);

    const boton = await screen.findByRole("button", { name: /producto agotado/i });
    expect(boton).toBeDisabled();
  });

  it("sigue mostrando 'Cargando producto...' si el servidor falla", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

    render(<ProductoDetalle />);

    await waitFor(() => expect(console.error).toHaveBeenCalled());
    expect(screen.getByText("Cargando producto...")).toBeInTheDocument();
  });
});