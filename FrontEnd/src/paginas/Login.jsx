import {useState} from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../estilos/login.css";
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

      navigate("/catalogo")

    }catch(err){
      alert("Error al iniciar sesión")
    }

  }

  return(

    <div className="container">

      <h2>Login</h2>

      <form onSubmit={login}>

        <input
        type="email"
        placeholder="Correo"
        onChange={(e)=>setCorreo(e.target.value)}
        />

        <input
        type="password"
        placeholder="Contraseña"
        onChange={(e)=>setClave(e.target.value)}
        />

        <button>Iniciar sesión</button>
      </form>
    <button onClick={() => navigate("/registro")}> Registrarse </button>
    </div>

  )

}

export default Login