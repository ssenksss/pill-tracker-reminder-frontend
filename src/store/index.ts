//--- index--
import { defineStore } from 'pinia'
import type { Pill } from '../types/Pill'

// Definiše Pinia store za upravljanje lokalnim stanjem lekova
export const usePillStore = defineStore('pillStore', {
    state: () => ({
        pills: [] as Pill[] // Početno prazna lista lekova
    }),
    actions: {
        // Dodaje novi lek u lokalno stanje
        addPill(pill: Pill) {
            this.pills.push(pill)
        },
        // Uklanja lek iz stanja po imenu
        removePill(name: string) {
            this.pills = this.pills.filter(p => p.name !== name)
        }
    }
})
