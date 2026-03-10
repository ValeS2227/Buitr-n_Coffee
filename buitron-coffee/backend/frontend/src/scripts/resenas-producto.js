// cerrar modal bienvenida
function cerrarAviso() {
  const modal = document.getElementById("bienvenida");
  if (modal) modal.style.display = "none";
}

// buscar productos
function buscarProducto() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const cards = document.querySelectorAll(".card");
  let encontrados = 0;

  if (!input) {
    cards.forEach((card) => {
      card.style.display = "block";
    });
    cerrarAviso();
    return;
  }

  cards.forEach((card) => {
    const nombre = card.getAttribute("data-nombre");

    if (nombre.includes(input)) {
      card.style.display = "block";
      encontrados++;
    } else {
      card.style.display = "none";
    }
  });

  if (encontrados === 0) {
    mostrarModalNoEncontrado();
  } else {
    cerrarAviso();
  }
}

// mostrar modal no encontrado
function mostrarModalNoEncontrado() {
  const modal = document.getElementById("bienvenida");
  const mensaje = document.getElementById("modalMessage");
  const boton = document.getElementById("modalButton");

  if (!modal || !mensaje || !boton) return;

  mensaje.innerHTML = "Lo sentimos no encontramos resultados";
  boton.textContent = "Volver al inicio";
  modal.style.display = "flex";

  boton.onclick = () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => (card.style.display = "block"));

    mensaje.innerHTML = "Bienvenido a<br>Buitrón Coffee";
    boton.textContent = "GRACIAS";
    modal.style.display = "none";
    document.getElementById("searchInput").value = "";
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const buscador = document.getElementById("searchInput");

  if (buscador) {
    buscador.addEventListener("input", buscarProducto);
  }
});