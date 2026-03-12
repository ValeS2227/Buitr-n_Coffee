import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import "../styles/producto.css"

import logo from "../assets/logo.png"
import perfil from "../assets/perfil.jpg"
import banner from "../assets/banner.jpg"

import molido from "../assets/cafe-molido.jpg"
import grano from "../assets/cafe-grano.jpg"
import especial from "../assets/cafe-especial.jpg"


function Producto(){

const { id } = useParams()
const navigate = useNavigate()

const productos = {

molido:{
nombre:"Café Molido",
precio:60000,
tostado:"Medio",
imagen:molido
},

grano:{
nombre:"Grano",
precio:65000,
tostado:"Medio",
imagen:grano
},

especial:{
nombre:"Grano Especial",
precio:70000,
tostado:"Alto",
imagen:especial
}

}

const producto = productos[id]

const [nombre,setNombre] = useState("")
const [comentario,setComentario] = useState("")
const [calificacion,setCalificacion] = useState(0)

function enviar(){

alert("Reseña enviada")

setNombre("")
setComentario("")
setCalificacion(0)

}

if(!producto){
return <h1>Producto no encontrado</h1>
}

return(

<div>

<header className="header">

<div className="nav">

<div className="left">
<img src={logo} className="logo"/>
</div>


<div className="center">

<h1 className="titulo">Buitron Coffee</h1>

<div className="menu">

<button onClick={()=>navigate("/")}>
Inicio
</button>

<button>Producción</button>
<button>Nosotros</button>
<button>Exportaciones</button>

</div>

</div>


<div className="right">

<div className="buscarBox">

<input placeholder="Buscar producto"/>

<span className="lupa">🔍</span>

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


<div className="producto">

<div className="info">

<img src={producto.imagen} className="imgProducto"/>

<div>

<h1>{producto.nombre}</h1>

<p>Estado: ACTIVO</p>

<p>Nivel tostado: {producto.tostado}</p>

<p className="estrellas">⭐⭐⭐⭐⭐</p>

<h2>Desde $ {producto.precio}</h2>

</div>

</div>


<div className="reseñas">

<h2>Reseñas</h2>

<div className="comentario">
<strong>Santiago</strong>
<p>Ta bueno 👍</p>
</div>

<div className="comentario">
<strong>Camila</strong>
<p>Muy buen café</p>
</div>

</div>


<div className="formulario">

<h3>Deja tu reseña</h3>

<div className="estrellasInput">

{[1,2,3,4,5].map((estrella)=>(
<span
key={estrella}
onClick={()=>setCalificacion(estrella)}
style={{
cursor:"pointer",
fontSize:"22px",
color:estrella <= calificacion ? "#ff9800" : "#ccc"
}}
>
★
</span>
))}

</div>

<input
placeholder="Tu nombre"
value={nombre}
onChange={(e)=>setNombre(e.target.value)}
/>

<textarea
placeholder="Escribe tu reseña"
value={comentario}
onChange={(e)=>setComentario(e.target.value)}
/>

<button onClick={enviar}>
Enviar
</button>

</div>

</div>

</div>

)

}

export default Producto