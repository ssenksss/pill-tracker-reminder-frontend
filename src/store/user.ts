import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        username: '' as string,
        userId: null as number | null,
    }),
    actions: {
        setUsername(name: string) {
            this.username = name
            localStorage.setItem('username', name)
        },
        setUserId(id: number) {
            this.userId = id
            localStorage.setItem('userId', id.toString())
        },
        loadUsername() {
            const saved = localStorage.getItem('username')
            const savedId = localStorage.getItem('userId')
            if (saved) this.username = saved
            if (savedId) this.userId = parseInt(savedId)
        },
        logout() {
            this.username = ''
            this.userId = null
            localStorage.removeItem('username')
            localStorage.removeItem('userId')
        },
    },
})
