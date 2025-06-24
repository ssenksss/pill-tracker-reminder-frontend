// -- user --
import { defineStore } from 'pinia'

// Store za informacije o korisniku (koristi se npr. za login sesiju)
export const useUserStore = defineStore('userStore', {
    state: () => ({
        username: '' as string,
        userId: null as number | null,
    }),
    actions: {
        // Postavlja korisničko ime i čuva ga u localStorage
        setUsername(name: string) {
            this.username = name
            localStorage.setItem('username', name)
        },
        // Postavlja ID korisnika i čuva ga u localStorage
        setUserId(id: number) {
            this.userId = id
            localStorage.setItem('userId', id.toString())
        },
        // Učitava podatke iz localStorage kada se aplikacija pokrene
        loadUsername() {
            const saved = localStorage.getItem('username')
            const savedId = localStorage.getItem('userId')
            if (saved) this.username = saved
            if (savedId) this.userId = parseInt(savedId)
        },
        // Brisanje korisničkih podataka iz state-a i localStorage
        logout() {
            this.username = ''
            this.userId = null
            localStorage.removeItem('username')
            localStorage.removeItem('userId')
        },
    },
})
