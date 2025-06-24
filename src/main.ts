// -- main --
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/styles.css'
import { useUserStore } from './store/user'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)  // Pinia store
app.use(router) // Vue Router

// Učitaj prethodnog korisnika iz localStorage
const userStore = useUserStore(pinia)
userStore.loadUsername()

// Montiraj aplikaciju
app.mount('#app')
