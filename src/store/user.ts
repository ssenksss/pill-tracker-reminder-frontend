// src/store/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        username: '' as string
    }),
    actions: {
        setUsername(name: string) {
            this.username = name
            localStorage.setItem('username', name)
        },
        loadUsername() {
            const saved = localStorage.getItem('username')
            if (saved) this.username = saved
        },
        logout() {
            this.username = ''
            localStorage.removeItem('username')
        }
    }
})
