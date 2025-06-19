// router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Pills from '../pages/Pills.vue'
import AddPill from '../pages/AddPill.vue'
import History from '../pages/History.vue'
import Login from '../pages/Login.vue'

const routes: RouteRecordRaw[] = [
    { path: '/dashboard', component: Dashboard },
    { path: '/pills', component: Pills },
    { path: '/add', component: AddPill },
    { path: '/history', component: History },
    { path: '/login', component: Login },
    { path: '/', redirect: '/dashboard' }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
