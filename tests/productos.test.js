const request = require("supertest");
const express = require("express");
const { crearQuery } = require("./helpers/crearQuery");

jest.mock("../config/supabaseClient", () => ({ from: jest.fn() }));

const supabase = require("../config/supabaseClient");
const productoRoutes = require("../routes/producto.routes");

const app = express();
app.use(express.json());
app.use("/api/productos", productoRoutes);

const productoDB = {
  id: 1,
  nombre_producto: "Café molido 500g",
  descripcion: "Café tostado y molido",
  categoria: "Café",
  precio: 25000,
  stock: 10,
  imagen: "cafe.jpg",
  estado: true,
  id_proveedor: null,
  calificacion_promedio: 4.5,
  total_resenas: 3,
};

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  console.error.mockRestore();
});
beforeEach(() => {
  supabase.from.mockReset();
});

describe("GET /api/productos", () => {
  it("devuelve la lista con los campos en PascalCase", async () => {
    supabase.from.mockReturnValue(crearQuery({ data: [productoDB], error: null }));

    const res = await request(app).get("/api/productos");

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({
      ID_Producto: 1,
      Nombre_producto: "Café molido 500g",
      Precio: 25000,
      Stock: 10,
    });
    expect(supabase.from).toHaveBeenCalledWith("producto");
  });

  it("responde 500 si Supabase falla", async () => {
    supabase.from.mockReturnValue(crearQuery({ data: null, error: { message: "fallo" } }));

    const res = await request(app).get("/api/productos");

    expect(res.status).toBe(500);
  });
});

describe("GET /api/productos/activos", () => {
  it("filtra solo los productos con estado true", async () => {
    const query = crearQuery({ data: [productoDB], error: null });
    supabase.from.mockReturnValue(query);

    const res = await request(app).get("/api/productos/activos");

    expect(res.status).toBe(200);
    expect(query.eq).toHaveBeenCalledWith("estado", true);
  });
});

describe("GET /api/productos/:id", () => {
  it("devuelve el producto si existe", async () => {
    supabase.from.mockReturnValue(crearQuery({ data: productoDB, error: null }));

    const res = await request(app).get("/api/productos/1");

    expect(res.status).toBe(200);
    expect(res.body.ID_Producto).toBe(1);
  });

  it("responde 404 si no existe", async () => {
    supabase.from.mockReturnValue(crearQuery({ data: null, error: null }));

    const res = await request(app).get("/api/productos/999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Producto no encontrado");
  });
});

describe("POST /api/productos", () => {
  it("responde 400 si faltan campos obligatorios", async () => {
    const res = await request(app).post("/api/productos").send({ Nombre_producto: "Café" });

    expect(res.status).toBe(400);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("crea el producto y responde 201", async () => {
    const query = crearQuery({ data: { id: 7 }, error: null });
    supabase.from.mockReturnValue(query);

    const res = await request(app).post("/api/productos").send({
      Nombre_producto: "Café molido 500g",
      Categoria: "Café",
      Precio: 25000,
      Stock: 10,
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe(7);
    expect(query.insert).toHaveBeenCalledWith(
      expect.objectContaining({ nombre_producto: "Café molido 500g", estado: true })
    );
  });

  it("responde 500 si falla la inserción", async () => {
    supabase.from.mockReturnValue(crearQuery({ data: null, error: { message: "fallo" } }));

    const res = await request(app).post("/api/productos").send({
      Nombre_producto: "Café",
      Categoria: "Café",
      Precio: 25000,
      Stock: 10,
    });

    expect(res.status).toBe(500);
  });
});

describe("PATCH /api/productos/:id/inhabilitar", () => {
  it("pone estado en false", async () => {
    const query = crearQuery({ data: [{ id: 1 }], error: null });
    supabase.from.mockReturnValue(query);

    const res = await request(app).patch("/api/productos/1/inhabilitar");

    expect(res.status).toBe(200);
    expect(query.update).toHaveBeenCalledWith({ estado: false });
  });
});

describe("DELETE /api/productos/:id", () => {
  it("elimina el producto", async () => {
    supabase.from.mockReturnValue(crearQuery({ data: [{ id: 1 }], error: null }));

    const res = await request(app).delete("/api/productos/1");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Producto eliminado correctamente");
  });

  it("responde 404 si el producto no existe", async () => {
    supabase.from.mockReturnValue(crearQuery({ data: [], error: null }));

    const res = await request(app).delete("/api/productos/999");

    expect(res.status).toBe(404);
  });
});