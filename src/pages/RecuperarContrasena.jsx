import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecuperarContrasena() {
  const [pantalla, setPantalla] = useState(1);
  const [correo, setCorreo] = useState('');
  const [nuevaPass, setNuevaPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const codigosRef = useRef([]);
  const navigate = useNavigate();

  const mostrarConfirmacion = () => {
    if (!correo || !correo.includes('@')) { alert('Por favor ingresa un correo válido.'); return; }
    setPantalla(2);
  };

  const mostrarNuevaContrasena = () => {
    const completo = codigosRef.current.every(i => i && i.value.length === 1);
    if (!completo) { alert('Por favor ingresa los 4 dígitos del código.'); return; }
    setPantalla(4);
  };

  const mostrarConfirmacionFinal = () => {
    if (nuevaPass.length < 4) { alert('La contraseña debe tener al menos 4 caracteres.'); return; }
    if (nuevaPass !== confirmPass) { alert('Las contraseñas no coinciden. Inténtalo de nuevo.'); return; }
    setPantalla(5);
  };

  const handleCodigo = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    e.target.value = val;
    if (val && index < 3) codigosRef.current[index + 1].focus();
  };

  const handleCodigoKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) codigosRef.current[index - 1].focus();
  };

  return (
    <div className="auth-body">
      <div className="card">
        <div className="logo">Buitrón Coffee</div>

        {pantalla === 1 && (
          <>
            <h2>Recupera tu contraseña</h2>
            <div className="mensaje">Se enviará un código de verificación a tu correo registrado.</div>
            <label>Correo electrónico</label>
            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="tucorreo@email.com" />
            <button onClick={mostrarConfirmacion}>Enviar código</button>
            <button className="btn-secondary" onClick={() => navigate('/login')}>Volver al inicio</button>
          </>
        )}

        {pantalla === 2 && (
          <>
            <div className="confirmacion">✅ Se ha enviado un código de verificación a tu correo. Revisa tu bandeja de entrada.</div>
            <button onClick={() => setPantalla(3)}>Ingresar código</button>
          </>
        )}

        {pantalla === 3 && (
          <>
            <h2>Ingresa el código</h2>
            <div className="mensaje">Ingresa los 4 dígitos del código recibido.</div>
            <div className="codigo-container">
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  ref={el => codigosRef.current[i] = el}
                  onChange={e => handleCodigo(e, i)}
                  onKeyDown={e => handleCodigoKeyDown(e, i)}
                />
              ))}
            </div>
            <button onClick={mostrarNuevaContrasena}>Enviar código</button>
          </>
        )}

        {pantalla === 4 && (
          <>
            <h2>Nueva contraseña</h2>
            <label>Nueva contraseña</label>
            <input type="password" value={nuevaPass} onChange={e => setNuevaPass(e.target.value)} placeholder="Ingresa tu nueva contraseña" />
            <label>Confirmar contraseña</label>
            <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Repite la contraseña" />
            <button onClick={mostrarConfirmacionFinal}>Guardar</button>
          </>
        )}

        {pantalla === 5 && (
          <>
            <div className="confirmacion">✅ Tu contraseña ha sido cambiada correctamente. Ya puedes iniciar sesión.</div>
            <button onClick={() => navigate('/login')}>Iniciar sesión</button>
          </>
        )}
      </div>
    </div>
  );
}
