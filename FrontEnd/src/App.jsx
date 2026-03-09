import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./paginas/Login"
import Registro from "./paginas/Registro"
import Catalogo from "./paginas/catalogo"

function App(){

 return(

  <BrowserRouter>

   <Routes>

    <Route path="/" element={<Login/>}/>
    <Route path="/registro" element={<Registro/>}/>
    <Route path="/catalogo" element={<Catalogo/>}/>

   </Routes>

  </BrowserRouter>

 )

}

export default App