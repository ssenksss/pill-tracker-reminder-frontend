// -- index --
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// Import stranica
import Dashboard from '../pages/Dashboard.vue'
import Pills from '../pages/Pills.vue'
import AddPill from '../pages/AddPill.vue'
import History from '../pages/Alerts.vue'
import Login from '../pages/Login.vue'
import PillDetails from '../pages/PillDetails.vue'

// Definicija svih ruta
const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/dashboard' }, // Početna ruta preusmerava na dashboard
    { path: '/dashboard', component: Dashboard },
    { path: '/pills', component: Pills },
    { path: '/add', component: AddPill },
    { path: '/history', component: History },
    { path: '/login', component: Login },
    { path: '/pills/:id', name: 'PillDetails', component: PillDetails },
    { path: '/pill/:id/edit', name: 'EditPill', component: AddPill }
]

// Kreiranje router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
