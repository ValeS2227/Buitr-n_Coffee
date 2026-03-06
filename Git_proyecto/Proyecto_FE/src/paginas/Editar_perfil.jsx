import { useState } from "react";
import "../estilos/Editar_perfil.css"
export default function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Editar Perfil</h1>

      <form className="form-group" onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
          placeholder="Lauriss"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Email</label>
          <input
          placeholder="lauramarro2018@gmail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="save-btn" type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}