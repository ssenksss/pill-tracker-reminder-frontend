export interface Pill {
    id?: number
    user_id?: number
    name: string
    description?: string
    dosage?: string | null
    frequency?: string | null
    time?: string | null
    note?: string | null
    image?: string | null
}
