// Pill
export interface Pill {
    id?: number              // ID leka (opciono, generiše ga backend)
    user_id?: number         // ID korisnika kojem lek pripada
    name: string             // Ime leka (obavezno)
    description?: string     // Opis leka
    dosage?: string | null   // Doza leka (npr. 500mg)
    frequency?: string | null // Učestalost (daily, weekly, monthly)
    time?: string | null     // Vremena uzimanja (08:00, 14:00, ...)
    note?: string | null     // Napomene
    image?: string | null    // Naziv slike leka
    count?: number           // Broj preostalih pilula
}
