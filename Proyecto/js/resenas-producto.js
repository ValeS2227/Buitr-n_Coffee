// bueno pos aca recogemos el id del producto que hice en el productos-data.js
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Cargar información del producto
function cargarProducto() {
  const productoId = getProductIdFromUrl();
  
  if (!productoId || !productosDB[productoId]) {
    // Producto no encontrado, redirigir
    window.location.href = 'index.html';
    return null;
  }
  
  return productosDB[productoId];
}

// aca renderizamos o en terminos simples, llamamos las caracterisiticas de los productos ekis de
function renderizarProducto(producto) {
  document.getElementById('producto-nombre').textContent = producto.nombre;
  document.getElementById('producto-imagen').src = producto.imagen;
  document.getElementById('producto-imagen').alt = producto.nombre;
  document.getElementById('producto-estado').textContent = producto.estado;
  document.getElementById('producto-tostado').textContent = producto.tostado;
  document.getElementById('producto-precio').textContent = producto.precio;
  
  // aca si no supe como hacer bien esta parte para lo de activo e inactivo entonces le pedi ayuda a mi amigazo chat
  const estadoElement = document.getElementById('producto-estado');
  if (producto.estado === 'ACTIVO') {
    estadoElement.className = 'metadata-valor estado-activo';
  } else {
    estadoElement.className = 'metadata-valor';
  }
  
  // bueno aca pos le ponemos estrellas al productos y q sean diferentes para cada uno obviamente pspspspsps el q lea esto es gei
  const estrellasContainer = document.getElementById('producto-estrellas');
  const puntuacion = producto.calificacion;
  const estrellasLlenas = Math.floor(puntuacion);
  const tieneMedia = puntuacion % 1 !== 0;
  
  let estrellasHTML = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= estrellasLlenas) {
      estrellasHTML += '<span class="estrella">★</span>';
    } else if (tieneMedia && i === estrellasLlenas + 1) {
      estrellasHTML += '<span class="estrella">½</span>';
    } else {
      estrellasHTML += '<span class="estrella">☆</span>';
    }
  }
  estrellasContainer.innerHTML = estrellasHTML;
  document.getElementById('producto-puntuacion').textContent = puntuacion.toFixed(1);
}

// aca pos cargamos las reseñas que nosotros ponemos
function getStorageKey(productoId) {
  return `reseñas-producto-${productoId}`;
}

function cargarReseñas(productoId) {
  const storageKey = getStorageKey(productoId);
  const reseñasGuardadas = localStorage.getItem(storageKey);
  
  if (reseñasGuardadas) {
    return JSON.parse(reseñasGuardadas);
  } else {
    // y aca cargamos las q ya vienen por defecto XDXDXDXDXD
    const producto = productosDB[productoId];
    guardarReseñas(productoId, producto.reseñas);
    return producto.reseñas;
  }
}

function guardarReseñas(productoId, reseñas) {
  const storageKey = getStorageKey(productoId);
  localStorage.setItem(storageKey, JSON.stringify(reseñas));
}

function renderizarReseñas() {
  const productoId = getProductIdFromUrl();
  if (!productoId) return;
  
  const contenedor = document.getElementById('lista-reseñas');
  const reseñas = cargarReseñas(productoId);
  
  if (reseñas.length === 0) {
    contenedor.innerHTML = '<p class="sin-reseñas">No hay reseñas aún. ¡Sé el primero en comentar!</p>';
    return;
  }
  
  // ya me dio wueba comentar cualquier duda pregunten

  let html = '';
  reseñas.forEach(reseña => {
    html += `
      <div class="review-item">
        <div class="review-header">
          <span class="review-author">${escapeHTML(reseña.autor)}</span>
          <span class="review-date">${escapeHTML(reseña.fecha)}</span>
        </div>
        <div class="review-text">${escapeHTML(reseña.texto)}</div>
      </div>
    `;
  });
  
  contenedor.innerHTML = html;
}

function agregarReseña(event) {
  event.preventDefault();
  
  const productoId = getProductIdFromUrl();
  if (!productoId) return;
  
  const nombreInput = document.getElementById('nombre');
  const reseñaInput = document.getElementById('reseña');
  
  const nombre = nombreInput.value.trim();
  const texto = reseñaInput.value.trim();
  
  if (!nombre || !texto) {
    alert('Por favor, completa todos los campos');
    if (!nombre) nombreInput.focus();
    else reseñaInput.focus();
    return;
  }
  
  const nuevaReseña = {
    autor: nombre,
    fecha: obtenerFechaActual(),
    texto: texto
  };
  
  const reseñas = cargarReseñas(productoId);
  reseñas.unshift(nuevaReseña);
  guardarReseñas(productoId, reseñas);
  
  nombreInput.value = '';
  reseñaInput.value = '';
  
  renderizarReseñas();
}

function obtenerFechaActual() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const año = hoy.getFullYear();
  return `${dia}/${mes}/${año}`;
}

function escapeHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', function() {
  const producto = cargarProducto();
  if (producto) {
    renderizarProducto(producto);
    renderizarReseñas();
    
    document.getElementById('btn-agregar-reseña').addEventListener('click', agregarReseña);
    
    // Enter en textarea
    document.getElementById('reseña').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        agregarReseña(e);
      }
    });
  }
});