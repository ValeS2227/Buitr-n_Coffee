document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("btn-gracias");
    const modal = document.getElementById("bienvenida");

    if (boton && modal) {

        boton.addEventListener("click", () => {

            modal.style.display = "none";

        });

    }

});