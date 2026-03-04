// Cierra el aviso normal de bienvenida
function cerrarAviso() {
  document.getElementById('bienvenida').style.display = 'none';
}

// Buscar producto y filtrar cards
function buscarProducto() {
  const input = document.getElementById('searchInput').value.trim().toLowerCase();
  const cards = document.querySelectorAll('.card');
  let encontrados = 0;

  if (!input) {
    // Si input vacío mostrar todo
    cards.forEach((card) => {
      card.style.display = 'block';
    });
    cerrarAviso();
    return;
  }

  cards.forEach((card) => {
    const nombre = card.getAttribute('data-nombre');
    if (nombre.includes(input)) {
      card.style.display = 'block';
      encontrados++;
    } else {
      card.style.display = 'none';
    }
  });

  if (encontrados === 0) {
    // No encontró resultados, mostrar aviso especial
    mostrarModalNoEncontrado();
  } else {
    cerrarAviso();
  }
}

// Mostrar aviso "No encontrado"
function mostrarModalNoEncontrado() {
  const modal = document.getElementById('bienvenida');
  const mensaje = document.getElementById('modalMessage');
  const boton = document.getElementById('modalButton');

  mensaje.innerHTML = 'Lo sentimos no encontramos resultados para tu búsqueda';
  boton.textContent = 'Volver al inicio';
  modal.style.display = 'flex';

  boton.onclick = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => (card.style.display = 'block'));

    mensaje.innerHTML = 'Bienvenido a<br>Buitrón Coffee';
    boton.textContent = 'GRACIAS';
    modal.style.display = 'none';
    document.getElementById('searchInput').value = '';
  };
}