import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Login from "../paginas/login";

// Se simula la URL del API (tu config.js probablemente usa import.meta.env, que Jest no entiende)
jest.mock("../config.js", () => ({ API_URL: "http://localhost:3000" }));

// Se simula axios: ninguna prueba llama al backend real
jest.mock("axios", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

// Se simula la navegación para comprobar a qué ruta se envía al usuario
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const escribirYEnviar = async (correo = "ana@correo.com", clave = "123456") => {
  await userEvent.type(screen.getByPlaceholderText(/correo/i), correo);
  await userEvent.type(screen.getByPlaceholderText(/^contraseña$/i), clave);
  await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
};

describe("Vista Login", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("muestra el título, los campos y el botón", () => {
    render(<Login />);

    expect(screen.getByText("Buitrón Coffee")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^contraseña$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it("deja escribir en el correo y la contraseña", async () => {
    render(<Login />);

    const correo = screen.getByPlaceholderText(/correo/i);
    const clave = screen.getByPlaceholderText(/^contraseña$/i);

    await userEvent.type(correo, "ana@correo.com");
    await userEvent.type(clave, "123456");

    expect(correo).toHaveValue("ana@correo.com");
    expect(clave).toHaveValue("123456");
  });

  it("muestra y oculta la contraseña con el botón del ojo", async () => {
    render(<Login />);

    const clave = screen.getByPlaceholderText(/^contraseña$/i);
    expect(clave).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: /mostrar contraseña/i }));
    expect(clave).toHaveAttribute("type", "text");

    await userEvent.click(screen.getByRole("button", { name: /ocultar contraseña/i }));
    expect(clave).toHaveAttribute("type", "password");
  });

  it("envía al administrador a /admin y guarda la sesión", async () => {
    axios.post.mockResolvedValue({
      data: { token: "token-admin", usuario: { ID_Rol: 2, Nombre_usuario: "Juan" } },
    });

    render(<Login />);
    await escribirYEnviar("ADMIN@Correo.com", "123456");

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/admin"));

    expect(axios.post).toHaveBeenCalledWith("http://localhost:3000/api/auth/login", {
      Correo: "admin@correo.com",
      Clave: "123456",
    });
    expect(localStorage.getItem("token")).toBe("token-admin");
    expect(localStorage.getItem("adminToken")).toBe("token-admin");
  });

  it("envía al usuario normal a /catalogo", async () => {
    axios.post.mockResolvedValue({
      data: { token: "token-usuario", usuario: { ID_Rol: 1, Nombre_usuario: "Ana" } },
    });

    render(<Login />);
    await escribirYEnviar();

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/catalogo"));
    expect(localStorage.getItem("token")).toBe("token-usuario");
    expect(localStorage.getItem("adminToken")).toBeNull();
  });

  it("muestra el mensaje de error que envía el servidor", async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: "Tu cuenta ha sido inhabilitada. Contacta al administrador." } },
    });

    render(<Login />);
    await escribirYEnviar();

    expect(await screen.findByText(/inhabilitada/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("muestra un mensaje genérico si el servidor no responde", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));

    render(<Login />);
    await escribirYEnviar();

    expect(await screen.findByText("Correo o contraseña incorrectos")).toBeInTheDocument();
  });

  it("deshabilita el botón mientras se inicia sesión", async () => {
    axios.post.mockReturnValue(new Promise(() => {})); // nunca responde

    render(<Login />);
    await escribirYEnviar();

    const boton = await screen.findByRole("button", { name: /iniciando sesión/i });
    expect(boton).toBeDisabled();
  });

  it("navega a recuperar contraseña y a registro", async () => {
    render(<Login />);

    await userEvent.click(screen.getByRole("button", { name: /olvidaste tu contraseña/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/olvido-contrasena");

    await userEvent.click(screen.getByRole("button", { name: /registrarse/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/registro");
  });
});