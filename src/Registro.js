 import './App.css';
import { useState } from "react";

function Registro({ volverLogin }) {

  const [form, setForm] = useState({
    nombre: "", apellido: "", documento: "",
    telefono: "", correo: "", clave: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const respuesta = await fetch("http://localhost:3001/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const texto = await respuesta.text();
    alert(texto);

    if (texto === "Usuario registrado") {
      volverLogin();
    }
  };

  return (
    <div className="auth-body">
      <div className="card">
        <h1>Buitrón Coffee</h1>
        <h2>Bienvenido al Registro</h2>

        <form onSubmit={handleSubmit}>

          <label>Nombre usuario</label>
          <input type="text" name="nombre" placeholder="Ingrese su nombre"
            onChange={handleChange} required />

          <label>Apellido</label>
          <input type="text" name="apellido" placeholder="Ingrese su apellido"
            onChange={handleChange} required />

          <label>Número de documento</label>
          <input type="number" name="documento" placeholder="Ingrese su documento"
            onChange={handleChange} required />

          <label>Número de Teléfono</label>
          <input type="tel" name="telefono" placeholder="Ingrese número"
            onChange={handleChange} required />

          <label>Correo Electrónico</label>
          <input type="email" name="correo" placeholder="Ingrese correo"
            onChange={handleChange} required />

          <label>Contraseña</label>
          <input type="password" name="clave" placeholder="Ingrese contraseña"
            onChange={handleChange} required />

          <button type="submit">Registrarse</button>

          <button type="button" onClick={volverLogin} className="btn-secundario">
            ¿Ya tienes cuenta? Inicia sesión
          </button>

        </form>
      </div>
    </div>
  );
}

export default Registro;