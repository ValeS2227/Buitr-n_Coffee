process.env.JWT_SECRET = "secreto_de_prueba";

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const { crearQuery } = require("./helpers/crearQuery");

jest.mock("../config/supabaseClient", () => ({
  from: jest.fn(),
  auth: {
    admin: {
      createUser: jest.fn(),
      deleteUser: jest.fn(),
      updateUserById: jest.fn(),
    },
  },
}));
jest.mock("../config/supabaseAuthClient", () => ({
  auth: { signInWithPassword: jest.fn() },
}));
jest.mock("bcrypt", () => ({ hash: jest.fn().mockResolvedValue("hash_falso") }));
jest.mock("../utils/emailService", () => ({
  enviarCodigoVerificacion: jest.fn().mockResolvedValue(undefined),
}));

const supabase = require("../config/supabaseClient");
const supabaseAuth = require("../config/supabaseAuthClient");
const { enviarCodigoVerificacion } = require("../utils/emailService");
const authRoutes = require("../routes/auth.routes");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

const datosRegistro = {
  Nombre_usuario: "Ana",
  Apellido: "Pérez",
  Correo: "ana@correo.com",
  Documento: "1234567890",
  Telefono: "3001234567",
  Clave: "123456",
};

const usuarioDB = {
  id: 5,
  nombre_usuario: "Ana",
  apellido: "Pérez",
  correo: "ana@correo.com",
  documento: "1234567890",
  telefono: "3001234567",
  id_rol: 1,
  estado: true,
  auth_user_id: "auth-123",
};

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  console.error.mockRestore();
});
beforeEach(() => {
  supabase.from.mockReset();
  supabase.auth.admin.createUser.mockReset();
  supabase.auth.admin.deleteUser.mockReset();
  supabase.auth.admin.updateUserById.mockReset();
  supabaseAuth.auth.signInWithPassword.mockReset();
  enviarCodigoVerificacion.mockReset();
});

describe("POST /api/auth/register", () => {
  it("responde 400 si faltan campos", async () => {
    const res = await request(app).post("/api/auth/register").send({ Correo: "ana@correo.com" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Todos los campos son obligatorios");
  });

  it("responde 400 si la contraseña tiene menos de 6 caracteres", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...datosRegistro, Clave: "123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("La contraseña debe tener mínimo 6 caracteres");
  });

  it("responde 400 si el correo ya está registrado", async () => {
    supabase.from.mockReturnValueOnce(
      crearQuery({ data: { id: 1, correo: "ana@correo.com" }, error: null })
    );

    const res = await request(app).post("/api/auth/register").send(datosRegistro);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Ya existe un usuario registrado con ese correo");
    expect(supabase.auth.admin.createUser).not.toHaveBeenCalled();
  });

  it("registra al usuario y responde 201", async () => {
    supabase.from
      .mockReturnValueOnce(crearQuery({ data: null, error: null })) // búsqueda: no existe
      .mockReturnValueOnce(crearQuery({ data: { correo: datosRegistro.Correo }, error: null })) // código verificado
      .mockReturnValueOnce(crearQuery({ data: usuarioDB, error: null })); // perfil
    supabase.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: "auth-123" } },
      error: null,
    });

    const res = await request(app).post("/api/auth/register").send(datosRegistro);

    expect(res.status).toBe(201);
    expect(res.body.usuario.Correo).toBe("ana@correo.com");
    expect(res.body.usuario.ID_Rol).toBe(1);
  });

  it("borra la cuenta de Auth si falla la creación del perfil", async () => {
    supabase.from
      .mockReturnValueOnce(crearQuery({ data: null, error: null }))
      .mockReturnValueOnce(crearQuery({ data: { correo: datosRegistro.Correo }, error: null }))
      .mockReturnValueOnce(crearQuery({ data: null, error: { message: "fallo" } }));
    supabase.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: "auth-123" } },
      error: null,
    });

    const res = await request(app).post("/api/auth/register").send(datosRegistro);

    expect(res.status).toBe(500);
    expect(supabase.auth.admin.deleteUser).toHaveBeenCalledWith("auth-123");
  });
});

describe("Rutas administrativas de usuarios", () => {
  const tokenAdmin = () => jwt.sign({ id: 9, rol: 2 }, "secreto_de_prueba");

  it("devuelve usuarios solo a administradores y normaliza sus roles", async () => {
    supabase.from
      .mockReturnValueOnce(crearQuery({ data: { id_rol: "2" }, error: null }))
      .mockReturnValueOnce(
        crearQuery({
          data: [{ ...usuarioDB, id_rol: "2" }],
          error: null,
        })
      );

    const res = await request(app)
      .get("/api/auth/usuarios")
      .set("Authorization", `Bearer ${tokenAdmin()}`);

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({
      ID_Usuario: 5,
      ID_Rol: 2,
      Estado: true,
    });
  });

  it("rechaza el acceso a la lista de usuarios para roles no administradores", async () => {
    supabase.from.mockReturnValueOnce(crearQuery({ data: { id_rol: 1 }, error: null }));

    const res = await request(app)
      .get("/api/auth/usuarios")
      .set("Authorization", `Bearer ${jwt.sign({ id: 5, rol: 1 }, "secreto_de_prueba")}`);

    expect(res.status).toBe(403);
    expect(supabase.from).toHaveBeenCalledTimes(1);
  });

  it("inhabilita usuarios sin permitir que el administrador se inhabilite a sí mismo", async () => {
    supabase.from
      .mockReturnValueOnce(crearQuery({ data: { id_rol: 2 }, error: null }))
      .mockReturnValueOnce(crearQuery({ data: { id: 5 }, error: null }));

    const res = await request(app)
      .patch("/api/auth/usuarios/5/inhabilitar")
      .set("Authorization", `Bearer ${tokenAdmin()}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/inhabilitado/i);
  });

  it("no permite cambiar el rol de la propia cuenta administradora", async () => {
    supabase.from.mockReturnValueOnce(crearQuery({ data: { id_rol: 2 }, error: null }));

    const res = await request(app)
      .patch("/api/auth/usuarios/9/cambiar-rol")
      .set("Authorization", `Bearer ${tokenAdmin()}`)
      .send({ nuevoRol: 1 });

    expect(res.status).toBe(400);
    expect(supabase.from).toHaveBeenCalledTimes(1);
  });

  it("cambia el rol de otro usuario a Usuario o Administrador", async () => {
    const queryActualizacion = crearQuery({
      data: { id: 5, id_rol: 2 },
      error: null,
    });
    supabase.from
      .mockReturnValueOnce(crearQuery({ data: { id_rol: 2 }, error: null }))
      .mockReturnValueOnce(queryActualizacion);

    const res = await request(app)
      .patch("/api/auth/usuarios/5/cambiar-rol")
      .set("Authorization", `Bearer ${tokenAdmin()}`)
      .send({ nuevoRol: 2 });

    expect(res.status).toBe(200);
    expect(res.body.ID_Rol).toBe(2);
    expect(queryActualizacion.update).toHaveBeenCalledWith({ id_rol: 2 });
  });

  it("rechaza roles fuera de Usuario o Administrador", async () => {
    supabase.from.mockReturnValueOnce(crearQuery({ data: { id_rol: 2 }, error: null }));

    const res = await request(app)
      .patch("/api/auth/usuarios/5/cambiar-rol")
      .set("Authorization", `Bearer ${tokenAdmin()}`)
      .send({ nuevoRol: 3 });

    expect(res.status).toBe(400);
    expect(supabase.from).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/auth/login", () => {
  it("responde 400 si faltan datos", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.status).toBe(400);
  });

  it("responde 401 si las credenciales son incorrectas", async () => {
    supabaseAuth.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ Correo: "ana@correo.com", Clave: "mala" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Correo o contraseña incorrectos");
  });

  it("devuelve un token válido si el login es correcto", async () => {
    supabaseAuth.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "auth-123" } },
      error: null,
    });
    supabase.from.mockReturnValueOnce(crearQuery({ data: usuarioDB, error: null }));

    const res = await request(app)
      .post("/api/auth/login")
      .send({ Correo: "ana@correo.com", Clave: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.usuario.Nombre_usuario).toBe("Ana");

    const decodificado = jwt.verify(res.body.token, "secreto_de_prueba");
    expect(decodificado).toMatchObject({ id: 5, rol: 1 });
  });

  it("responde 401 si la cuenta está inhabilitada", async () => {
    supabaseAuth.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "auth-123" } },
      error: null,
    });
    supabase.from.mockReturnValueOnce(
      crearQuery({ data: { ...usuarioDB, estado: false }, error: null })
    );

    const res = await request(app)
      .post("/api/auth/login")
      .send({ Correo: "ana@correo.com", Clave: "123456" });

    expect(res.status).toBe(401);
  });

  it("responde 404 si existe en Auth pero no tiene perfil", async () => {
    supabaseAuth.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "auth-123" } },
      error: null,
    });
    supabase.from
      .mockReturnValueOnce(crearQuery({ data: null, error: null })) // por auth_user_id
      .mockReturnValueOnce(crearQuery({ data: null, error: null })); // por correo

    const res = await request(app)
      .post("/api/auth/login")
      .send({ Correo: "ana@correo.com", Clave: "123456" });

    expect(res.status).toBe(404);
  });
});