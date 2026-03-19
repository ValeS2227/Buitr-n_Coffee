import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./paginas/Login"
import Registro from "./paginas/Registro"
import Catalogo from "./paginas/catalogo"
import Usuario from "./paginas/Usuario"
import PQRS from "./paginas/PQRS"
import Realizarpqrs from "./paginas/Realizarpqrs"
import Consultarpqrs from "./paginas/Consultarpqrs"

function App(){

 return(

  <BrowserRouter>

   <Routes>

    <Route path="/" element={<Login />}/>
<Route path="/login" element={<Login />} />
<Route path="/registro" element={<Registro/>}/>
<Route path="/catalogo" element={<Catalogo/>}/>
<Route path="/usuario" element={<Usuario/>}/>
<Route path="/pqrs" element={<PQRS/>}/>
<Route path="/realizarpqrs" element={<Realizarpqrs/>}/>
<Route path="/consultarpqrs" element={<Consultarpqrs/>}/>

   </Routes>

  </BrowserRouter>

 )

}

export default App