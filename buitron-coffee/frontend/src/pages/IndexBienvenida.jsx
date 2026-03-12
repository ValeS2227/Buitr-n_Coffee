import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/indexregistrado.css"

import logo from "../assets/logo.png"
import perfil from "../assets/perfil.jpg"
import banner from "../assets/banner.jpg"

import molido from "../assets/cafe-molido.jpg"
import grano from "../assets/cafe-grano.jpg"
import especial from "../assets/cafe-especial.jpg"


function IndexBienvenida(){

const navigate = useNavigate()

const [busqueda,setBusqueda] = useState("")
const [mostrarModal,setMostrarModal] = useState(true)
const [mensajeModal,setMensajeModal] = useState("Bienvenido a Buitrón Coffee")
const [textoBoton,setTextoBoton] = useState("GRACIAS")

const productos = [

{
nombre:"café molido",
imagen:molido,
precio:"Desde $60.000",
ruta:"/producto/molido"
},

{
nombre:"grano",
imagen:grano,
precio:"Desde $65.000",
ruta:"/producto/grano"
},

{
nombre:"grano especial",
imagen:especial,
precio:"Desde $70.000",
ruta:"/producto/especial"
}

]

function buscarProducto(){

const texto = busqueda.toLowerCase()

const encontrados = productos.filter(p => p.nombre.includes(texto))

if(encontrados.length === 0){

setMensajeModal("Lo sentimos no encontramos resultados para tu búsqueda")
setTextoBoton("Volver al inicio")
setMostrarModal(true)

}else{

setMostrarModal(false)

}

}

function cerrarModal(){

setMostrarModal(false)
setBusqueda("")
setMensajeModal("Bienvenido a Buitrón Coffee")
setTextoBoton("GRACIAS")

}

return(

<div>

{/* HEADER */}

<header className="header">

<div className="nav">

<div className="left">
<img src={logo} className="logo"/>
</div>

<div className="center">

<h1 className="titulo">Buitron Coffee</h1>

<div className="menu">

<button>Inicio</button>
<button>Producción</button>
<button>Nosotros</button>
<button>Exportaciones</button>

</div>

</div>

<div className="right">

<div className="buscarBox">

<input
placeholder="Buscar producto"
value={busqueda}
onChange={(e)=>setBusqueda(e.target.value)}
/>

<span className="lupa" onClick={buscarProducto}>
🔍
</span>

</div>

<img src={perfil} className="perfil"/>

<span className="carrito">🛒</span>

</div>

</div>

</header>

{/* BANNER */}

<div className="banner">
<img src={banner}/>
</div>


{/* PRODUCTOS */}

<div className="productos">

<h2>Ideales para ti</h2>

<div className="cards">

{productos.map((p,index)=>(

<div className="card" key={index}>

<img src={p.imagen}/>

<h3>{p.nombre}</h3>

<p>{p.precio}</p>

<button onClick={()=>navigate(p.ruta)}>
VER
</button>

</div>

))}

</div>

</div>


{/* MODAL BIENVENIDA */}

{mostrarModal && (

<div className="overlay">

<div className="modal">

<div className="logoModal">
Buitron Coffee
</div>

<div className="tituloModal">
{mensajeModal}
</div>

<button className="botonModal" onClick={cerrarModal}>
{textoBoton}
</button>

</div>

</div>

)}

</div>

)

}

export default IndexBienvenida