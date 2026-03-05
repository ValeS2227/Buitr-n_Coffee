<template>
  <div>
    <header class="nav">
      <button @click="irInicio">Regresar al Inicio</button>
      <span>{{ usuario }}</span>
    </header>

    <div class="perfil-container">
      <h1>Mi Perfil</h1>

      <div class="perfil-card">
        <div class="foto-section">
          <img :src="previewFoto" class="foto-perfil" />

          <input type="file" @change="cambiarFoto" accept="image/*" />

          <button @click="cerrarSesion">Cerrar Sesión</button>
        </div>

        <div class="info-section">
          <label>Nombre de Usuario</label>
          <input type="text" v-model="usuario" />

          <label>Número de Documento</label>
          <input type="text" v-model="documento" />

          <label>Número de Teléfono</label>
          <input type="text" v-model="telefono" />

          <label>Correo Electrónico</label>
          <input type="email" v-model="correo" />

          <label>Contraseña</label>
          <input type="password" v-model="password" />

          <button class="btn-guardar" @click="guardarCambios">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UsuarioView",
  data() {
    return {
      usuario: "admin",
      documento: "123456789",
      telefono: "3001234567",
      correo: "admin@gmail.com",
      password: "1234",
      previewFoto: new URL('../assets/perfil.jpg', import.meta.url).href
    }
  },
  methods: {
    irInicio() {
      this.$router.push('/indexregistrado')
    },
    cerrarSesion() {
      this.$router.push('/')
    },
    cambiarFoto(event) {
      const archivo = event.target.files[0]
      if (archivo) {
        this.previewFoto = URL.createObjectURL(archivo)
      }
    },
    guardarCambios() {
      alert("Cambios guardados correctamente")
      console.log({
        usuario: this.usuario,
        documento: this.documento,
        telefono: this.telefono,
        correo: this.correo
      })
    }
  }
}
</script>
<style scoped>
@import "../assets/usuario.css";
</style>