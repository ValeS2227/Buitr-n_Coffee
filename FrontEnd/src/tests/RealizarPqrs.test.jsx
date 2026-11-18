import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Realizarpqrs from "../paginas/Realizarpqrs";

jest.mock("../config.js", () => ({ API_URL: "http://localhost:3000" }));

jest.mock("axios", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../components/HeaderGlobal", () => ({ __esModule: true, default: () => null }));
jest.mock("../components/Footer", () => ({ __esModule: true, default: () => null }));

const usuarioDePrueba = {
  ID_Usuario: 5,
  Nombre_usuario: "Ana",
  Apellido: "Pérez",
  Correo: "ana@correo.com",
  Telefono: "3001234567",
};

const iniciarSesion = () => {
  localStorage.setItem("usuario", JSON.stringify(usuarioDePrueba));
};

const textoDescripcion = () => screen.getByPlaceholderText(/cuéntanos detalladamente/i);
const botonEnviar = () => screen.getByRole("button", { name: /enviar pqrs|enviando/i });

const enviarPqrs = async (descripcion = "El café llegó en mal estado") => {
  await userEvent.type(textoDescripcion(), descripcion);
  await userEvent.click(botonEnviar());
};

describe("Vista Realizar PQRS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("sin sesión iniciada", () => {
    it("pide iniciar sesión y bloquea el formulario", () => {
      render(<Realizarpqrs />);

      expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
      expect(textoDescripcion()).toBeDisabled();
      expect(botonEnviar()).toBeDisabled();
    });

    it("lleva al login al pulsar 'iniciar sesión'", async () => {
      render(<Realizarpqrs />);

      await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("con sesión iniciada", () => {
    beforeEach(() => {
      iniciarSesion();
    });

    it("muestra el título, el nombre del usuario y habilita el formulario", () => {
      render(<Realizarpqrs />);

      expect(screen.getByRole("heading", { name: "Realizar PQRS" })).toBeInTheDocument();
      expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
      expect(textoDescripcion()).toBeEnabled();
      expect(botonEnviar()).toBeEnabled();
    });

    it("ofrece los cinco tipos de PQRS, con 'queja' seleccionada por defecto", () => {
      render(<Realizarpqrs />);

      expect(screen.getAllByRole("option")).toHaveLength(5);
      expect(screen.getByRole("combobox")).toHaveValue("queja");
    });

    it("muestra error si la descripción está vacía", async () => {
      render(<Realizarpqrs />);

      await userEvent.click(botonEnviar());

      expect(screen.getByText("Por favor escribe una descripción de tu PQRS")).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("muestra error si la descripción tiene menos de 10 caracteres", async () => {
      render(<Realizarpqrs />);

      await enviarPqrs("hola");

      expect(screen.getByText("La descripción debe tener al menos 10 caracteres")).toBeInTheDocument();
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("envía la PQRS con los datos del usuario y muestra el código de referencia", async () => {
      axios.post.mockResolvedValue({ data: {} });

      render(<Realizarpqrs />);

      await userEvent.selectOptions(screen.getByRole("combobox"), "reclamo");
      await enviarPqrs("El café llegó en mal estado");

      expect(await screen.findByText("¡Tu PQRS ha sido enviada con éxito!")).toBeInTheDocument();
      expect(screen.getByText("Tu código de referencia es:")).toBeInTheDocument();

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3000/api/pqrs",
        expect.objectContaining({
          nombre: "Ana Pérez",
          email: "ana@correo.com",
          telefono: "3001234567",
          tipo: "reclamo",
          descripcion: "El café llegó en mal estado",
          id_usuario: 5,
          codigo_referencia: expect.stringMatching(/^PQRS-\d{8}-\d{6}$/),
        })
      );
    });

    it("limpia el formulario después de enviar", async () => {
      axios.post.mockResolvedValue({ data: {} });

      render(<Realizarpqrs />);

      await userEvent.selectOptions(screen.getByRole("combobox"), "sugerencia");
      await enviarPqrs("Podrían vender café en grano");
      await screen.findByText("¡Tu PQRS ha sido enviada con éxito!");

      expect(textoDescripcion()).toHaveValue("");
      expect(screen.getByRole("combobox")).toHaveValue("queja");
    });

    it("muestra 'Enviando...' y bloquea el botón mientras espera respuesta", async () => {
      axios.post.mockReturnValue(new Promise(() => {})); // nunca responde

      render(<Realizarpqrs />);
      await enviarPqrs();

      const boton = await screen.findByRole("button", { name: /enviando/i });
      expect(boton).toBeDisabled();
    });

    it("muestra el mensaje de error que envía el servidor", async () => {
      axios.post.mockRejectedValue({ response: { data: { message: "No se pudo guardar la PQRS" } } });

      render(<Realizarpqrs />);
      await enviarPqrs();

      expect(await screen.findByText("No se pudo guardar la PQRS")).toBeInTheDocument();
    });

    it("muestra un mensaje genérico si el servidor no responde", async () => {
      axios.post.mockRejectedValue(new Error("Network Error"));

      render(<Realizarpqrs />);
      await enviarPqrs();

      expect(await screen.findByText("Ocurrió un error al enviar tu PQRS")).toBeInTheDocument();
    });

    it("lleva a consultar el estado después de enviar", async () => {
      axios.post.mockResolvedValue({ data: {} });

      render(<Realizarpqrs />);
      await enviarPqrs();

      await userEvent.click(await screen.findByRole("button", { name: /consultar estado ahora/i }));

      expect(mockNavigate).toHaveBeenCalledWith("/consultarpqrs");
    });

    it("copia el código de referencia al portapapeles", async () => {
      axios.post.mockResolvedValue({ data: {} });

      render(<Realizarpqrs />);
      await enviarPqrs();

      const codigo = (await screen.findByText(/^PQRS-\d{8}-\d{6}$/)).textContent;

      // Se define aquí (después de usar userEvent) para que nada lo reemplace
      const escribir = jest.fn();
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: escribir },
        configurable: true,
      });
      jest.spyOn(window, "alert").mockImplementation(() => {});

      fireEvent.click(screen.getByText("📋"));

      expect(escribir).toHaveBeenCalledWith(codigo);
      expect(window.alert).toHaveBeenCalledWith("Código copiado al portapapeles");
    });

    it("vuelve a /pqrs al pulsar 'Cancelar'", async () => {
      render(<Realizarpqrs />);

      await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

      expect(mockNavigate).toHaveBeenCalledWith("/pqrs");
    });
  });
});