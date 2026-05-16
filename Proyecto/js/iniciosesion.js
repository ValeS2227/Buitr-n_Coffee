function ocultarTodo() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("bienvenida").style.display = "none";
}

function mostrarLogin() {
  ocultarTodo();
  document.getElementById("login").style.display = "block";
}

function volverInicio() {
  ocultarTodo();
  document.getElementById("inicio").style.display = "block";
}
function iniciarSesion() {
  var usuario  = document.getElementById("usuario").value;
  var password = document.getElementById("password").value;

  if (usuario === "admin" && password === "1234") {
    window.location.href = "indexregistrado.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}
function cerrarSesion() {
  volverInicio();
}