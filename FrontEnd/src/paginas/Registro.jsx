import {useState} from "react"
import axios from "axios"
import "../estilos/login.css";

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

    <div className="container">

      <h2>Registro</h2>

      <form onSubmit={registrar}>

        <input name="Nombre_usuario" placeholder="Nombre" onChange={handleChange} required/> 
        <input name="Apellido" placeholder="Apellido" onChange={handleChange}required/>
        <input name="Correo" placeholder="Correo" onChange={handleChange}required/>
        <input name="Documento" placeholder="Documento" onChange={handleChange}required/>
        <input name="Telefono" placeholder="Telefono" onChange={handleChange}required/>
        <input type="password" name="Clave" placeholder="Contraseña" onChange={handleChange}required/>

        <button>Registrarse</button>

      </form>

    </div>

  )

}

export default Registro