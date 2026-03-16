import './App.css';
import { useState } from "react";
import Registro from './Registro';
import Recuperar from './Recuperar_contra';

function App() {

  const [seccion, setSeccion] = useState("inicio");

  return (
    <div className="auth-body">
      <div className="card">

        {seccion === "inicio" && (
          <div className="seccion">
            <h1>Buitrón Coffee</h1>

            <button onClick={() => setSeccion("login")}>
              Inicia sesión
            </button>

            <button onClick={() => setSeccion("registro")}>
              Regístrate
            </button>
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

            <button onClick={() => setSeccion("bienvenida")}>
              Ingresar
            </button>

            <button onClick={() => setSeccion("inicio")}>
              Volver
            </button>

            <p>
              ¿Olvidaste tu contraseña?
              <button onClick={() => setSeccion("recuperar")}>
                Recuperar
              </button>
            </p>

            <p>
              ¿No tienes cuenta?
              <button onClick={() => setSeccion("registro")}>
                Regístrate
              </button>
            </p>
          </div>
        )}

        {seccion === "registro" && (
          <Registro volverLogin={() => setSeccion("login")} />
        )}

        {seccion === "recuperar" && (
          <Recuperar volverLogin={() => setSeccion("login")} />
        )}

        {seccion === "bienvenida" && (
          <div className="seccion bienvenida">
            <h1>Buitrón Coffee</h1>
            <h2>Bienvenido a Buitrón Coffee</h2>

            <button onClick={() => setSeccion("inicio")}>
              Cerrar sesión
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;