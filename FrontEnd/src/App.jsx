import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./paginas/Login"
import Registro from "./paginas/Registro"
import Catalogo from "./paginas/catalogo"
import Usuario from "./paginas/Usuario"

function App(){

 return(

  <BrowserRouter>

   <Routes>

    <Route path="/" element={<Login />}/>
<Route path="/registro" element={<Registro/>}/>
<Route path="/catalogo" element={<Catalogo/>}/>
<Route path="/usuario" element={<Usuario/>}/>

   </Routes>

  </BrowserRouter>

 )

}

export default App