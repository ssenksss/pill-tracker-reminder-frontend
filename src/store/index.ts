// store/index.ts
import { defineStore } from 'pinia'
import type { Pill } from '../types/Pill'

export const usePillStore = defineStore('pillStore', {
    state: () => ({
        pills: [] as Pill[]
    }),
    actions: {
        addPill(pill: Pill) {
            this.pills.push(pill)
        },
        removePill(name: string) {
            this.pills = this.pills.filter(p => p.name !== name)
        }
    }
})