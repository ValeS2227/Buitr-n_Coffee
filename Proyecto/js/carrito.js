let carrito = [
    {id:1, nombre:"Café Molido", precio:60000, cantidad:1, imagen:"img/cafe1.jpeg"},
    {id:2, nombre:"Grano", precio:65000, cantidad:1, imagen:"img/cafe2.jpeg"},
    {id:3, nombre:"Grano Especial", precio:70000, cantidad:1, imagen:"img/cafe3.jpeg"},
    {id:4, nombre:"Café al por Mayor", precio:250000, cantidad:1, imagen:"img/cafe3.jpeg"}
];

function mostrarProductos(){
    let contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    carrito.forEach(producto => {
        contenedor.innerHTML += `
            <div class="card">
                <img src="${producto.imagen}" class="imagen-producto">
                <h4>${producto.nombre}</h4>
                <p>Precio: $${producto.precio}</p>
                <input type="number" min="1" value="${producto.cantidad}" 
                onchange="cambiarCantidad(${producto.id}, this.value)">
                <br>
                <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">
                    Eliminar
                </button>
            </div>
        `;
    });
}

function cambiarCantidad(id, nuevaCantidad){
    let producto = carrito.find(p => p.id === id);
    producto.cantidad = parseInt(nuevaCantidad);
}

function eliminarProducto(id){
    carrito = carrito.filter(p => p.id !== id);
    mostrarProductos();
}

function generarRecibo(){
    let total = 0;
    let texto = "<h3>Recibo</h3>";

    carrito.forEach(producto => {
        let subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        texto += `
            ${producto.nombre} x${producto.cantidad} = $${subtotal} <br>
        `;
    });

    texto += `<hr><strong>Total: $${total}</strong>`;

    document.getElementById("resultado").innerHTML = texto;
}

mostrarProductos();