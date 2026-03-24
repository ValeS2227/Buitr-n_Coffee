import { Link, useNavigate } from "react-router-dom";
import "../estilos/footer.css";

function Footer() {

  const navigate = useNavigate();

  return (
    <>
      <footer className="footer">
        <p>&copy; 2026 Buitrón Coffee. Todos los derechos reservados</p>
      </footer>
    </>
  );
}

export default Footer;