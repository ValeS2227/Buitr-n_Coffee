import { useState } from "react"
import axios from "axios"
import "../estilos/login.css"

function Registro(){

  const [form,setForm] = useState({
    Nombre_usuario:"",
    Apellido:"",
    Correo:"",
    Documento:"",
    Telefono:"",
    Clave:""
  })

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }

  const registrar = async (e)=>{

    e.preventDefault()

    try{

      await axios.post(
        "http://localhost:3001/api/auth/register",
        form
      )

      alert("Usuario registrado")

    }catch(err){
      alert("Error al registrar")
    }

  }

  return(

    <div className="auth-body">

      <div className="card">

        <h1>Buitrón Coffee</h1>
        <h2>Crea una Cuenta</h2>

        <form onSubmit={registrar}>

          <label>Nombre</label>
          <input name="Nombre_usuario" placeholder="Nombre" onChange={handleChange} required/>

          <label>Apellido</label>
          <input name="Apellido" placeholder="Apellido" onChange={handleChange} required/>

          <label>Correo</label>
          <input name="Correo" placeholder="Correo" onChange={handleChange} required/>

          <label>Documento</label>
          <input name="Documento" placeholder="Documento" onChange={handleChange} required/>

          <label>Telefono</label>
          <input name="Telefono" placeholder="Telefono" onChange={handleChange} required/>

          <label>Contraseña</label>
          <input type="password" name="Clave" placeholder="Contraseña" onChange={handleChange} required/>

          <button>Registrarse</button>

        </form>

      </div>

    </div>

  )

}

export default Registro