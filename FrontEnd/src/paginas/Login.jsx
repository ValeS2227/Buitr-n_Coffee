import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../estilos/login.css"

function Login(){

  const navigate = useNavigate()

  const [Correo,setCorreo] = useState("")
  const [Clave,setClave] = useState("")

  const login = async (e)=>{

    e.preventDefault()

    try{

      const res = await axios.post(
        "http://localhost:3001/api/auth/login",
        {Correo,Clave}
      )

      alert("Login correcto")

      localStorage.setItem("token",res.data.token)
      localStorage.setItem("usuario",JSON.stringify(res.data.usuario))

      navigate("/catalogo")

    }catch(err){
      alert("Error al iniciar sesión")
    }

  }

  return(

    <div className="auth-body">

      <div className="card">

        <h1>Buitrón Coffee</h1>
        <h2>Iniciar sesión</h2>

        <form onSubmit={login}>

          <label>Correo</label>
          <input
            type="email"
            placeholder="Correo"
            onChange={(e)=>setCorreo(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e)=>setClave(e.target.value)}
          />

          <button>Inicio de Sesión</button>

        </form>

          <button
            className="btn-secundario"
            onClick={() => navigate("/registro")}
          >
            Registrarse
          </button>

        </div>

      </div>


  )

}

export default Login