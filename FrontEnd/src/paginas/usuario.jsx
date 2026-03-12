import "../estilos/usuario.css"
import { useNavigate } from "react-router-dom"
import { useEffect,useState } from "react"
import axios from "axios"
import perfil from "../assets/perfil.jpg"

function Usuario() {

  const navigate = useNavigate()

  const [usuario,setUsuario] = useState({
    Nombre_usuario:"",
    Correo:"",
    Documento:"",
    Telefono:""
  })

  useEffect(()=>{

    const cargarPerfil = async ()=>{

      try{

        const token = localStorage.getItem("token")

        const res = await axios.get(
          "http://localhost:3001/api/auth/perfil",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        )

        setUsuario(res.data)

      }catch(error){
        console.log(error)
      }

    }

    cargarPerfil()

  },[])


  const guardarCambios = async ()=>{

    try{

      const token = localStorage.getItem("token")

      await axios.put(
        "http://localhost:3001/api/auth/perfil",
        usuario,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      alert("Datos actualizados")

    }catch(error){
      alert("Error al actualizar")
    }

  }


  const cerrarSesion = ()=>{

    localStorage.removeItem("token")
    localStorage.removeItem("usuario")

    navigate("/")

  }

  return (

    <div className="usuario-page">

      <header className="nav">

        <button onClick={() => navigate("/catalogo")}>
          Regresar al Inicio
        </button>

      </header>

      <div className="perfil-container">

        <h1>Mi Perfil</h1>

        <div className="perfil-card">

          <div className="foto-section">

            <img
              src={perfil}
              className="foto-perfil"
              alt="perfil"
            />

            <input type="file" accept="image/*"/>

            <button onClick={cerrarSesion}>
              Cerrar Sesión
            </button>

          </div>

          <div className="info-section">

            <label>Nombre de Usuario</label>
            <input
              type="text"
              value={usuario.Nombre_usuario}
              onChange={(e)=>setUsuario({...usuario,Nombre_usuario:e.target.value})}
            />

            <label>Número de Documento</label>
            <input
              type="text"
              value={usuario.Documento}
              onChange={(e)=>setUsuario({...usuario,Documento:e.target.value})}
            />

            <label>Número de Teléfono</label>
            <input
              type="text"
              value={usuario.Telefono}
              onChange={(e)=>setUsuario({...usuario,Telefono:e.target.value})}
            />

            <label>Correo Electrónico</label>
            <input
              type="email"
              value={usuario.Correo}
              onChange={(e)=>setUsuario({...usuario,Correo:e.target.value})}
            />

            <button
              className="btn-guardar"
              onClick={guardarCambios}
            >
              Guardar Cambios
            </button>

          </div>

        </div>

      </div>

    </div>

  )
}

export default Usuario