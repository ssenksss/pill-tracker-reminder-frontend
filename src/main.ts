import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/styles.css'
import { useUserStore } from './store/user'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)


const userStore = useUserStore(pinia)
userStore.loadUsername()

app.mount('#app')
