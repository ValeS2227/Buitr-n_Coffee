import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config.js';
import './estilos-admin/CambiarRolUsuario.css';

const obtenerIdUsuarioActual = () => {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return Number(usuario.ID_Usuario);
  } catch (err) {
    console.error('Error al leer el usuario actual:', err);
    return null;
  }
};

const CambiarRolUsuario = () => {
  const navigate = useNavigate();
  const [idUsuarioActual] = useState(obtenerIdUsuarioActual);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoRol, setNuevoRol] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/auth/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsuarios(response.data);
      setCargando(false);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError('Error al cargar los usuarios');
      setCargando(false);
    }
  };

  const abrirModalCambioRol = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNuevoRol(String(Number(usuario.ID_Rol)));
    setError('');
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setUsuarioSeleccionado(null);
    setNuevoRol('');
    setError('');
  };

  const cambiarRol = async () => {
    if (!usuarioSeleccionado || !nuevoRol) {
      setError('Debes seleccionar un rol');
      return;
    }

    if (Number(usuarioSeleccionado.ID_Usuario) === idUsuarioActual) {
      setError('No puedes cambiar el rol de tu propia cuenta');
      return;
    }

    setGuardando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_URL}/api/auth/usuarios/${usuarioSeleccionado.ID_Usuario}/cambiar-rol`,
        { nuevoRol: Number(nuevoRol) },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const rolActualizado = Number(response.data.ID_Rol || nuevoRol);
      setUsuarios((lista) =>
        lista.map((usuario) =>
          Number(usuario.ID_Usuario) === Number(usuarioSeleccionado.ID_Usuario)
            ? { ...usuario, ID_Rol: rolActualizado }
            : usuario
        )
      );
      setExito(response.data.message || `Rol de "${usuarioSeleccionado.Nombre_usuario}" cambiado correctamente`);
      setMostrarModal(false);
      setUsuarioSeleccionado(null);
      setNuevoRol('');

      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      console.error('Error al cambiar rol:', err);
      const respuesta = err.response?.data;
      const respuestaHtml = typeof respuesta === 'string' && /<!doctype html|<html/i.test(respuesta);
      setError(
        respuesta?.message ||
          (respuestaHtml
            ? 'El servidor no reconoce esta ruta. Despliega el Backend_duplicado actualizado y verifica VITE_API_URL.'
            : 'Error al cambiar el rol')
      );
    } finally {
      setGuardando(false);
    }
  };

  const volver = () => {
    navigate('/admin');
  };

  const usuariosFiltrados = () => {
    if (filtro === 'admin') {
      return usuarios.filter(u => Number(u.ID_Rol) === 2);
    } else if (filtro === 'usuario') {
      return usuarios.filter(u => Number(u.ID_Rol) === 1);
    }
    return usuarios;
  };

  const getRolBadge = (rol) => {
    switch(Number(rol)) {
      case 2:
        return <span className="badge-admin">Administrador</span>;
      case 1:
        return <span className="badge-usuario">Usuario</span>;
      case 3:
        return <span className="badge-proveedor">Proveedor</span>;
      default:
        return <span className="badge-default">{rol}</span>;
    }
  };

  const getRolNombre = (rol) => {
    switch(Number(rol)) {
      case 2: return 'Administrador';
      case 1: return 'Usuario';
      case 3: return 'Proveedor';
      default: return 'Desconocido';
    }
  };

  if (cargando) {
    return (
      <div className="cambiar-rol-container">
        <div className="loading">Cargando usuarios...</div>
      </div>
    );
  }

  const usuariosMostrar = usuariosFiltrados();

  return (
    <div className="cambiar-rol-container">
      <div className="cambiar-rol-header">
        <button className="btn-volver" onClick={volver}>
          ← Volver al Panel
        </button>
        <h1>CAMBIAR ROL DE USUARIOS</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {exito && <div className="exito-message">{exito}</div>}

      {/* Filtros */}
      <div className="filtros-rol">
        <button 
          className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`}
          onClick={() => setFiltro('todos')}
        >
          Todos
        </button>
        <button 
          className={`filtro-btn ${filtro === 'admin' ? 'active' : ''}`}
          onClick={() => setFiltro('admin')}
        >
          Administradores
        </button>
        <button 
          className={`filtro-btn ${filtro === 'usuario' ? 'active' : ''}`}
          onClick={() => setFiltro('usuario')}
        >
          Usuarios
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="tabla-container">
        <table className="tabla-usuarios-rol">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Rol Actual</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuariosMostrar.length === 0 ? (
              <tr>
                <td colSpan="6" className="sin-datos">No hay usuarios para mostrar</td>
              </tr>
            ) : (
              usuariosMostrar.map((usuario) => (
                <tr key={usuario.ID_Usuario}>
                  <td>{usuario.ID_Usuario}</td>
                  <td className="usuario-nombre">{usuario.Nombre_usuario}</td>
                  <td>{usuario.Apellido}</td>
                  <td>{usuario.Correo}</td>
                  <td>{getRolBadge(usuario.ID_Rol)}</td>
                  <td>
                    <button 
                      className="btn-cambiar-rol"
                      onClick={() => abrirModalCambioRol(usuario)}
                      disabled={guardando || Number(usuario.ID_Usuario) === idUsuarioActual}
                      title={Number(usuario.ID_Usuario) === idUsuarioActual ? 'No puedes cambiar tu propio rol' : 'Cambiar rol'}
                    >
                      Cambiar Rol
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para cambiar rol */}
      {mostrarModal && usuarioSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cambiar Rol de Usuario</h3>
              <button className="modal-close" onClick={cerrarModal}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Usuario:</strong> {usuarioSeleccionado.Nombre_usuario} {usuarioSeleccionado.Apellido}</p>
              <p><strong>Rol actual:</strong> {getRolNombre(usuarioSeleccionado.ID_Rol)}</p>
              
              <div className="form-group">
                <label>Nuevo rol:</label>
                <select 
                  value={nuevoRol} 
                  onChange={(e) => setNuevoRol(e.target.value)}
                  className="rol-select"
                  disabled={guardando}
                >
                  <option value="">Seleccionar rol</option>
                  <option value="1">Usuario</option>
                  <option value="2">Administrador</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar-modal" onClick={cerrarModal} disabled={guardando}>
                Cancelar
              </button>
              <button className="btn-guardar-modal" onClick={cambiarRol} disabled={guardando || !nuevoRol || Number(nuevoRol) === Number(usuarioSeleccionado.ID_Rol)}>
                {guardando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CambiarRolUsuario;