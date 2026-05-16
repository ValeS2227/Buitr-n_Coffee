document.querySelectorAll('.codigo').forEach((input, index, inputs) => {
    input.addEventListener('input', () => {
        if (input.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
});

function mostrarPantalla(id) {
    const pantallas = [
        'pantalla1',
        'pantalla2',
        'pantalla3',
        'pantalla4',
        'pantalla5'
    ];

    pantallas.forEach(p => {
        document.getElementById(p).classList.add('hidden');
    });

    document.getElementById(id).classList.remove('hidden');
}

function mostrarConfirmacion() {
    mostrarPantalla('pantalla2');
}

function mostrarCodigo() {
    mostrarPantalla('pantalla3');
}

function mostrarNuevaContrasena() {
    mostrarPantalla('pantalla4');
}

function mostrarConfirmacionFinal() {
    mostrarPantalla('pantalla5');
}