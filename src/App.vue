<template>
  <div class="auth-body">
    <div class="card">

      <!-- INICIO -->
      <div v-if="vista === 'inicio'" class="seccion">
        <h1>Buitrón Coffee</h1>
        <button @click="vista = 'login'">Inicia sesión</button>
        <button @click="vista = 'registro'">Regístrate</button>
      </div>

      <!-- LOGIN -->
      <div v-if="vista === 'login'" class="seccion">
        <h1>Buitrón Coffee</h1>
        <h2>Bienvenido al inicio de sesión</h2>

        <label>Usuario</label>
        <input type="text" v-model="usuarioLogin" placeholder="Ingrese usuario">

        <label>Contraseña</label>
        <input type="password" v-model="passwordLogin" placeholder="••••••••">

        <button @click="iniciarSesion">Ingresar</button>
        <button @click="vista = 'inicio'">Volver</button>
        <button @click="vista = 'recuperar'">¿Olvidaste tu contraseña?</button>
      </div>

      <!-- REGISTRO -->
      <div v-if="vista === 'registro'" class="seccion">
        <h1>Buitrón Coffee</h1>
        <h2>Registro</h2>

        <label>Nombre</label>
        <input type="text" v-model="nombre" placeholder="Ingrese nombre">

        <label>Apellido</label>
        <input type="text" v-model="apellido" placeholder="Ingrese apellido">

        <label>Correo</label>
        <input type="email" v-model="correo" placeholder="Ingrese correo">

        <label>Contraseña</label>
        <input type="password" v-model="passwordRegistro" placeholder="Ingrese contraseña">

        <button @click="registrar">Registrarse</button>
        <button @click="vista = 'login'">¿Ya tienes cuenta? Inicia sesión</button>
      </div>

      <!-- RECUPERAR CONTRASEÑA -->
      <div v-if="vista === 'recuperar'" class="seccion">
        <h2>Recupera tu contraseña</h2>

        <!-- PANTALLA 1: Ingresar correo -->
        <div v-if="pantallaRecuperar === 1">
          <div class="mensaje">
            Se enviará un código de verificación a tu correo registrado
          </div>
          <label>Correo electrónico</label>
          <input type="email" v-model="correoRecuperar" placeholder="tucorreo@email.com">
          <button @click="mostrarConfirmacion">Enviar</button>
          <button @click="vista = 'login'">Volver</button>
        </div>

        <!-- PANTALLA 2: Confirmación de envío -->
        <div v-if="pantallaRecuperar === 2">
          <div class="confirmacion">
            ✅ Se ha enviado un código de verificación a tu correo
          </div>
          <button @click="mostrarCodigo">Ingresar Código</button>
        </div>

        <!-- PANTALLA 3: Ingresar código de 4 dígitos -->
        <div v-if="pantallaRecuperar === 3">
          <h2>Ingresa el código</h2>
          <div class="codigo-container">
            <input type="text" maxlength="1" v-for="(d, i) in 4" :key="i" v-model="codigo[i]" class="codigo">
          </div>
          <button @click="mostrarNuevaContrasena">Enviar Código</button>
        </div>

        <!-- PANTALLA 4: Nueva contraseña -->
        <div v-if="pantallaRecuperar === 4">
          <h2>Nueva contraseña</h2>
          <label>Nueva contraseña</label>
          <input type="password" v-model="nuevaContra" placeholder="Ingresa tu nueva contraseña">
          <button @click="mostrarConfirmacionFinal">Guardar</button>
        </div>

        <!-- PANTALLA 5: Éxito -->
        <div v-if="pantallaRecuperar === 5">
          <div class="confirmacion">
            ✅ Tu contraseña ha sido cambiada correctamente
          </div>
          <button @click="vista = 'login'">Iniciar sesión</button>
        </div>
      </div>

      <!-- BIENVENIDA -->
      <div v-if="vista === 'bienvenida'" class="seccion bienvenida">
        <h1>Buitrón Coffee</h1>
        <h2>Bienvenido {{ usuarioLogin }}</h2>
        <button @click="cerrarSesion">Cerrar sesión</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const vista = ref('inicio')

// LOGIN
const usuarioLogin = ref('')
const passwordLogin = ref('')

// REGISTRO
const nombre = ref('')
const apellido = ref('')
const correo = ref('')
const passwordRegistro = ref('')

// RECUPERAR CONTRASEÑA
const pantallaRecuperar = ref(1)
const correoRecuperar = ref('')
const codigo = ref(['', '', '', ''])
const nuevaContra = ref('')

// FUNCIONES LOGIN
function iniciarSesion() {
  if (usuarioLogin.value && passwordLogin.value) {
    vista.value = 'bienvenida'
  } else {
    alert('Completa los campos')
  }
}

// FUNCIONES REGISTRO
function registrar() {
  if (nombre.value && apellido.value && correo.value && passwordRegistro.value) {
    alert('Usuario registrado correctamente')
    vista.value = 'login'
  } else {
    alert('Completa todos los campos')
  }
}

// FUNCIONES RECUPERAR CONTRASEÑA
function mostrarConfirmacion() {
  if(correoRecuperar.value) pantallaRecuperar.value = 2
  else alert('Ingresa tu correo')
}
function mostrarCodigo() {
  pantallaRecuperar.value = 3
}
function mostrarNuevaContrasena() {
  if(codigo.value.every(d => d !== '')) pantallaRecuperar.value = 4
  else alert('Completa el código')
}
function mostrarConfirmacionFinal() {
  if(nuevaContra.value) pantallaRecuperar.value = 5
  else alert('Ingresa nueva contraseña')
}

// CERRAR SESIÓN
function cerrarSesion() {
  usuarioLogin.value = ''
  passwordLogin.value = ''
  vista.value = 'inicio'
}
</script>