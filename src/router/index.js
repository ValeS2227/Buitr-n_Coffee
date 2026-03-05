import { createRouter, createWebHistory } from 'vue-router'
import UsuarioView from '../views/UsuarioView.vue'

const routes = [
  {
    path: '/',
    redirect: '/usuario'
  },
  {
    path: '/usuario',
    name: 'usuario',
    component: UsuarioView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router