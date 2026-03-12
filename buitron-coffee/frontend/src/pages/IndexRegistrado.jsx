import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/indexregistrado.css"

import logo from "../assets/logo.png"
import perfil from "../assets/perfil.jpg"
import banner from "../assets/banner.jpg"

import molido from "../assets/cafe-molido.jpg"
import grano from "../assets/cafe-grano.jpg"
import especial from "../assets/cafe-especial.jpg"


function IndexRegistrado(){

const navigate = useNavigate()

const [busqueda,setBusqueda] = useState("")

function buscarProducto(){

const texto = busqueda.toLowerCase()

if(texto.includes("molido")){
navigate("/producto/molido")
}

else if(texto.includes("grano")){
navigate("/producto/grano")
}

else if(texto.includes("especial")){
navigate("/producto/especial")
}

else{
alert("Producto no encontrado")
}

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
onKeyDown={(e)=>{
if(e.key === "Enter"){
buscarProducto()
}
}}
/>

<span
className="lupa"
onClick={buscarProducto}
>
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


<div className="productos">

<h2>Ideales para ti</h2>

<div className="cards">


<div className="card">

<img src={molido}/>

<h3>Café Molido</h3>

<p>Desde $ 60.000</p>

<button onClick={()=>navigate("/producto/molido")}>
VER
</button>

</div>


<div className="card">

<img src={grano}/>

<h3>Grano</h3>

<p>Desde $ 65.000</p>

<button onClick={()=>navigate("/producto/grano")}>
VER
</button>

</div>


<div className="card">

<img src={especial}/>

<h3>Grano Especial</h3>

<p>Desde $ 70.000</p>

<button onClick={()=>navigate("/producto/especial")}>
VER
</button>

</div>


</div>

</div>

</div>

)

}

export default IndexRegistrado