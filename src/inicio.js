import './App.css';
import { useState } from "react";

function App() {

  const [seccion, setSeccion] = useState("inicio");

  return (
    <div className="card">

      {seccion === "inicio" && (
        <div className="seccion">
          <h1>Buitrón Coffee</h1>
          <button onClick={() => setSeccion("login")}>Inicia sesión</button>
          <button>Regístrate</button>
          <button>Volver al inicio</button>
        </div>
      )}

      {seccion === "login" && (
        <div className="seccion">
          <h1>Buitrón Coffee</h1>
          <h2>Bienvenido al inicio de sesión</h2>

          <label>Usuario</label>
          <input type="text" placeholder="Ingrese usuario" />

          <label>Contraseña</label>
          <input type="password" placeholder="••••••••" />

          <button onClick={() => setSeccion("bienvenida")}>Ingresar</button>
          <button onClick={() => setSeccion("inicio")}>Volver</button>

          <div className="links-login">
            <p>¿Olvidaste tu contraseña? <a href="Recuperar_contra.js">Recuperar</a></p>
          </div>

          <div className="links-login">
            <p>¿No tienes cuenta? <a href="Registro.js">Regístrate</a></p>
          </div>
        </div>
      )}

      {seccion === "bienvenida" && (
        <div className="seccion bienvenida">
          <h1>Buitrón Coffee</h1>
          <h2>Bienvenido a Buitrón Coffee</h2>
          <button onClick={() => setSeccion("inicio")}>Cerrar sesión</button>
        </div>
      )}

    </div>
  );
}

export default App;