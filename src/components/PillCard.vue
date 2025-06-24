<!-- PillCard -->
<template>
  <div class="relative">
    <div
        class="flex items-center bg-white rounded-2xl shadow-md px-4 py-4 mb-4 hover:shadow-lg transition duration-200"
    >
      <!-- Prikaz slike leka ako postoji -->
      <div class="w-14 h-14 mr-4 flex-shrink-0">
        <img
            v-if="imageSrc"
            :src="imageSrc"
            :alt="`Image of ${pill.name}`"
            class="w-full h-full object-cover rounded-md bg-gray-200"
        />
        <!-- Placeholder ikonica ako nema slike -->
        <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gray-100 rounded-md text-2xl"
        >
          💊
        </div>
      </div>

      <!-- Informacije o leku -->
      <div class="flex-1">
        <h3 class="text-base font-semibold text-gray-800">
          {{ pill.name }} - {{ pill.dosage || 'N/A' }}
        </h3>
        <p class="text-sm text-gray-500">{{ pill.note || 'After eating' }}</p>
        <p class="text-sm text-primary mt-1">🕒 {{ formatTime(pill.time) }}</p>

        <!-- Broj preostalih tableta -->
        <p v-if="pill.count !== undefined" class="text-sm text-gray-600 mt-1">
          💊 {{ pill.count }} pills left
        </p>
        <!-- Upozorenje za malu količinu leka -->
        <p v-if="pill.count !== undefined && pill.count < 5" class="text-sm text-red-600">
          ⚠️ Low supply – consider refill!
        </p>

        <!-- Prikaz poslednjeg vremena uzimanja leka -->
        <p v-if="pill.last_taken" class="text-sm text-gray-500 mt-1">
          🕒 Last taken: {{ formatDateTime(pill.last_taken) }}
        </p>

        <!-- Prikaz statusa da li je lek uzet danas -->
        <p v-if="pill.last_status === 'uzeto'" class="text-green-600 text-sm mt-1">
          ✓ Taken today
        </p>
      </div>

      <!-- Dugme za označavanje da je lek uzet, samo ako još nije uzet -->
      <button
          v-if="pill.last_status !== 'uzeto'"
          @click="markAsTaken"
          class="text-green-600 text-xl ml-4 hover:scale-110 transition-transform"
          title="Mark as taken"
      >
        ✓
      </button>
    </div>

    <!-- Dugme za prikaz detalja leka -->
    <button
        @click="openDetails"
        class="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 text-sm shadow-md"
        title="Show details"
    >
      +
    </button>

    <!-- Dugme za brisanje leka -->
    <button
        @click="$emit('delete-pill', pill.id)"
        class="absolute top-2 right-10 bg-red-600 text-white rounded-full w-6 h-6 text-sm shadow-md hover:bg-red-700"
        title="Delete pill"
    >
      ×
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pill: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['open-details', 'delete-pill', 'pill-taken', 'mark-taken'])

const userId = 1 // Hardkodiran ID korisnika, može biti iz auth sistema

// Računanje punog URL-a slike leka ako postoji
const imageSrc = computed(() => {
  if (!props.pill.image) return ''
  try {
    return new URL(`../assets/${props.pill.image}`, import.meta.url).href
  } catch {
    return ''
  }
})

// Formatiranje vremena uzimanja leka (npr. iz niza u string "08:00, 14:00")
function formatTime(time) {
  if (!time || !Array.isArray(time) || time.length === 0) return 'N/A'
  return time
      .map((t) => (typeof t === 'string' && t.length >= 5 ? t.slice(0, 5) : t))
      .join(', ')
}

// Formatiranje datuma i vremena u čitljiv format (npr. "23 Jun, 08:00")
function formatDateTime(dateTime) {
  if (!dateTime) return 'N/A'
  const date = new Date(dateTime)
  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Funkcija za označavanje leka kao uzetog
async function markAsTaken() {
  if (props.pill.count <= 0) return  // Ako nema leka, ne radi ništa

  const updatedCount = props.pill.count - 1  // Smanji broj preostalih tableta
  const now = new Date()
  // Formatiranje trenutnog vremena u string kompatibilan sa bazom
  const takenAt =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0') +
      ' ' +
      String(now.getHours()).padStart(2, '0') +
      ':' +
      String(now.getMinutes()).padStart(2, '0') +
      ':' +
      String(now.getSeconds()).padStart(2, '0')

  try {
    // PUT zahtev za update leka sa novim stanjem
    await fetch(`http://localhost:3000/api/pills/${props.pill.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pill_id: props.pill.id, status: 'uzeto', taken_at: takenAt }),
    })

    // POST zahtev za kreiranje loga uzimanja leka
    await fetch('http://localhost:3000/api/pill-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pill_id: props.pill.id,
        status: 'uzeto',
        taken_at: takenAt,
      }),
    })

    // Lokalna ažuriranja za brži UI feedback
    props.pill.count = updatedCount
    props.pill.last_taken = takenAt
    props.pill.last_status = 'uzeto'

    // Emitovanje događaja roditeljskoj komponenti da osveži stanje
    emit('mark-taken', props.pill) // šalje ažurirani lek roditeljskoj komponenti

  } catch (error) {
    console.error('Greška pri označavanju leka kao uzetog:', error)
  }
}

// Emituje događaj da se otvore detalji leka
function openDetails() {
  emit('open-details', props.pill)
}
</script>

<style scoped>
/* Pozicioniranje relativno za roditelja */
.relative {
  position: relative;
}
/* Apsolutno pozicioniranje za dugmad */
.absolute {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

/* Stil za primarnu boju pozadine */
.bg-primary {
  --tw-bg-opacity: 1;
  background-color: rgba(34, 197, 94, var(--tw-bg-opacity)); /* Tailwind zelena */
}

/* Stil za primarnu boju teksta */
.text-primary {
  color: rgba(34, 197, 94, var(--tw-text-opacity));
}
</style>
