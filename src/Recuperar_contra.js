import './Recuperar_contra.css';
import { useState } from "react";

function Recuperar({ volverLogin }) {

  const [pantalla, setPantalla] = useState(1);

  return (
    <div className="card">

      <div className="logo">Buitrón Coffee</div>

      {pantalla === 1 && (
        <div>
          <h2>Recupera tu contraseña</h2>

          <div className="mensaje">
            Se enviará un código de verificación a tu correo registrado
          </div>

          <label>Correo electrónico</label>
          <input type="email" placeholder="tucorreo@email.com" required />

          <button onClick={() => setPantalla(2)}>Enviar</button>
          <button onClick={volverLogin}>Volver al inicio</button>
        </div>
      )}

      {pantalla === 2 && (
        <div>
          <div className="confirmacion">
            ✅ Se ha enviado un código de verificación a tu correo
          </div>

          <button onClick={() => setPantalla(3)}>
            Ingresar Código
          </button>
        </div>
      )}

      {pantalla === 3 && (
        <div>
          <h2>Ingresa el código</h2>

          <div className="codigo-container">
            <input type="text" maxLength="1" />
            <input type="text" maxLength="1" />
            <input type="text" maxLength="1" />
            <input type="text" maxLength="1" />
          </div>

          <button onClick={() => setPantalla(4)}>
            Enviar Código
          </button>
        </div>
      )}

      {pantalla === 4 && (
        <div>
          <h2>Nueva contraseña</h2>

          <label>Nueva contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu nueva contraseña"
            required
          />

          <button onClick={() => setPantalla(5)}>
            Guardar
          </button>
        </div>
      )}

      {pantalla === 5 && (
        <div>
          <div className="confirmacion">
            ✅ Tu contraseña ha sido cambiada correctamente
          </div>

          <button onClick={volverLogin}>
            Iniciar sesión
          </button>
        </div>
      )}

    </div>
  );
}

export default Recuperar;