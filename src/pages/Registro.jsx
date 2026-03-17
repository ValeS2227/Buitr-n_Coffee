import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registro() {
  const [form, setForm] = useState({ nombre:'', apellido:'', documento:'', telefono:'', correo:'', password:'' });
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const registrar = () => {
    const { nombre, apellido, documento, telefono, correo, password } = form;
    if (!nombre || !apellido || !documento || !telefono || !correo || !password) { alert('Por favor completa todos los campos.'); return; }
    if (!correo.includes('@')) { alert('Por favor ingresa un correo válido.'); return; }
    if (password.length < 4) { alert('La contraseña debe tener al menos 4 caracteres.'); return; }
    setExito(true);
  };

  const irALogin = () => {
    sessionStorage.setItem('mostrarLogin', 'true');
    navigate('/login');
  };

  return (
    <div className="auth-body">
      <div className="card">
        {!exito ? (
          <>
            <h1>Buitrón Coffee</h1>
            <h2>Bienvenido al Registro</h2>
            <label>Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ingrese su nombre" />
            <label>Apellido</label>
            <input type="text" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Ingrese su apellido" />
            <label>Número de documento</label>
            <input type="number" name="documento" value={form.documento} onChange={handleChange} placeholder="Ingrese su documento" />
            <label>Número de teléfono</label>
            <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Ingrese número" />
            <label>Correo electrónico</label>
            <input type="email" name="correo" value={form.correo} onChange={handleChange} placeholder="Ingrese correo" />
            <label>Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Ingrese contraseña" />
            <button onClick={registrar}>Registrarse</button>
            <button className="btn-secondary" onClick={irALogin}>¿Ya tienes cuenta? Inicia sesión</button>
          </>
        ) : (
          <>
            <div className="logo">Buitrón Coffee</div>
            <div className="confirmacion">✅ ¡Registro exitoso!<br />Ya puedes iniciar sesión con tu cuenta.</div>
            <button onClick={() => navigate('/login')}>Iniciar sesión</button>
            <button className="btn-secondary" onClick={() => navigate('/')}>Ir al inicio</button>
          </>
        )}
      </div>
    </div>
  );
}
