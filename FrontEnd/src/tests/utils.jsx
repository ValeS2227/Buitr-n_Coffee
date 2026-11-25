import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Catalogo from "../paginas/catalogo";

export const productosMock = [
  {
    ID_Producto: 1,
    Nombre_producto: "Café Tostado",
    Descripcion: "Café con un sabor unico y delicioso",
    Categoria: "Tostado",
    Precio: 25000,
    imagen: "tostado.jpg",
    calificacion_promedio: 4.5,
  },
  {
    ID_Producto: 2,
    Nombre_producto: "Café Geisha",
    Descripcion: "Café con un toque de sabor picante",
    Categoria: "Molido",
    Precio: 40000,
    imagen: "geisha.jpg",
    calificacion_promedio: 3,
  },
  {
    ID_Producto: 3,
    Nombre_producto: "Café Bourbon Rosado",
    Descripcion: "Delicioso café con un sabor especial",
    Categoria: "Fino",
    Precio: 35000,
    imagen: "bourbon.jpg",
    calificacion_promedio: 4,
  },
];

// Mismo formato que usa el componente
export const formatoPrecio = (n) => `$${Number(n).toLocaleString("es-CO")}`;

// Responde según la URL: productos y promociones
export const mockFetch = ({
  productos = productosMock,
  productosOk = true,
  promociones = [],
  promocionesRespuesta = null, // para forzar una respuesta distinta
} = {}) => {
  global.fetch = jest.fn((url) => {
    if (url.includes("/api/productos/activos")) {
      return Promise.resolve({
        ok: productosOk,
        json: () => Promise.resolve(productos),
      });
    }
    if (url.includes("/api/promociones/activas")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            promocionesRespuesta || { success: true, data: promociones }
          ),
      });
    }
    return Promise.reject(new Error("URL no mockeada: " + url));
  });
};

export const renderCatalogo = (ruta = "/catalogo") =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Catalogo />
    </MemoryRouter>
  );