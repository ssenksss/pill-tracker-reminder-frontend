<!-- Dashboard -->
<template>
  <div class="space-y-6 p-4 bg-gray-50 min-h-screen">

    <!-- Prikaz trenutnog meseca i godine -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <p class="text-sm text-text-light mt-1">{{ currentMonthYear }}</p>

      <!-- Grid sa danima u nedelji -->
      <div class="grid grid-cols-7 gap-2 mt-4">
        <div
            v-for="(d, index) in daysInWeek"
            :key="index"
            class="text-center py-2 rounded-lg cursor-pointer font-medium transition duration-200"
            :class="index === activeDayIndex
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-text-dark hover:bg-gray-200'"
        >
          <p class="text-xs">{{ d.day }}</p>
          <p class="text-sm font-semibold">{{ d.date }}</p>
        </div>
      </div>
    </div>

    <!-- Podsetnik za hidrataciju -->
    <section class="bg-green-100 rounded-lg shadow-md p-4 flex items-center gap-3">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-green-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m0-4h.01M12 20.5c4.694 0 8.5-3.806 8.5-8.5S16.694 3.5 12 3.5 3.5 7.306 3.5 12s3.806 8.5 8.5 8.5z"
        />
      </svg>
      <p class="text-sm text-green-900">
        Don’t forget to drink enough water today! 💧 Staying hydrated helps your meds work better.
      </p>
    </section>

    <!-- Informacija o broju lekova i poslednjoj sinhronizaciji -->
    <div
        class="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2"
    >
      <p class="text-sm text-text-dark font-semibold">
        You have {{ pills.length }} medications today
      </p>
      <p class="text-sm text-text-light">Last sync: {{ formattedLastSync }}</p>
    </div>

    <!-- Prikaz dnevnih logova -->
    <section v-if="logs.length > 0" class="bg-white rounded-lg shadow-md p-4">
      <p class="font-semibold text-primary mb-2">Today’s Log</p>
      <ul class="space-y-1 text-sm text-text-dark max-h-60 overflow-y-auto">
        <li
            v-for="log in logs"
            :key="log.id"
            class="py-2 flex justify-between items-center"
        >
          <span>{{ formatDateTime(log.taken_at) }} – {{ log.name || 'Unknown' }}</span>
          <span v-if="log.status"
                :class="{
    'text-green-600': log.status.toLowerCase() === 'uzeto',
    'text-red-500': log.status.toLowerCase() === 'preskočeno',
  }"
          >
  {{ capitalizeStatus(log.status) }}
</span>
          <span v-else class="text-gray-400">Nije uneseno</span>
        </li>
      </ul>
    </section>

    <!-- Prikaz liste lekova sa dugmetom za više opcija -->
    <section class="space-y-2">
      <p v-if="pills.length === 0" class="text-center text-sm text-gray-500">
        No medications found.
      </p>
      <div v-for="pill in pills" :key="pill.id" class="relative">
        <PillCard
            :pill="pill"
            @mark-taken="handleMarkTaken"
            @pill-taken="fetchData"
            @delete-pill="deletePill"
            @open-details="goToPillDetails"
        />
        <button
            class="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 text-sm shadow-md"
            @click="goToPillDetails(pill)"
            title="More options"
        >
          +
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PillCard from '../components/PillCard.vue'

const pills = ref([]) // Lista lekova
const logs = ref([]) // Lista dnevnih logova
const router = useRouter()
const userId = 1 // Hardkodirani korisnički ID, kasnije iz auth sistema

// Navigacija ka detaljima leka
const goToPillDetails = (pill) => {
  router.push({
    path: `/pills/${pill.id}`,
    query: {
      lastTaken: pill.lastTaken || '',
    },
  })
}

// Učitavanje logova za danas za korisnika
async function fetchTodayLogs() {
  try {
    const logsRes = await fetch(`http://localhost:3000/api/pill-logs/user/${userId}/today`)
    if (!logsRes.ok) throw new Error('Failed to fetch logs')
    const allLogs = await logsRes.json()
    logs.value = allLogs.sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at))
    lastSync.value = new Date()
  } catch (error) {
    console.error('Error loading today logs:', error)
  }
}

// Učitavanje lekova i dnevnih logova
async function fetchData() {
  try {
    const medRes = await fetch('http://localhost:3000/api/pills')
    if (!medRes.ok) throw new Error('Failed to fetch pills')
    pills.value = await medRes.json()
    await fetchTodayLogs()
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

// Ažuriranje statusa uzimanja leka u lokalnoj listi i osvežavanje logova
async function handleMarkTaken(updatedPill) {
  const index = pills.value.findIndex(p => p.id === updatedPill.id)
  if (index !== -1) pills.value[index] = updatedPill
  await fetchTodayLogs()
}


// Brisanje leka iz baze i lokalne liste
async function deletePill(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/pills/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete pill')
    pills.value = pills.value.filter(p => p.id !== id)
    await fetchTodayLogs()
  } catch (error) {
    console.error('Failed to delete pill:', error)
  }
}

// Inicijalno učitavanje podataka
onMounted(fetchData)

// Trenutni datum
const today = new Date()

// Formatiranje prikaza meseca i godine (npr. "June 2025")
const currentMonthYear = computed(() =>
    today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

// Izračunavanje početka nedelje (ponedeljak)
const startOfWeek = new Date(today)
startOfWeek.setDate(today.getDate() - today.getDay() + 1)

// Generisanje niza sa danima nedelje (skraćeni nazivi i datumi)
const daysInWeek = Array.from({ length: 7 }).map((_, i) => {
  const date = new Date(startOfWeek)
  date.setDate(startOfWeek.getDate() + i)
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.getDate(),
  }
})

// Indeks aktivnog dana u nedelji (ponedeljak = 0, nedelja = 6)
const activeDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1

// Formatiranje ISO vremena u čitljiv format datuma i vremena
function formatDateTime(time) {
  if (!time) return 'N/A'
  const fixed = time.includes('T') ? time : time.replace(' ', 'T')
  const date = new Date(fixed)
  if (isNaN(date)) return 'Invalid Date'
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Funkcija za kapitalizaciju statusa (npr. "uzeto" -> "Uzeto")
function capitalizeStatus(status) {
  if (!status) return ''
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

const lastSync = ref(new Date())

// Prikaz poslednjeg sync vremena u formatu "Today at HH:mm"
const formattedLastSync = computed(() => {
  const options = { hour: '2-digit', minute: '2-digit' }
  const now = new Date()
  const syncDate = lastSync.value
  const isToday =
      syncDate.getDate() === now.getDate() &&
      syncDate.getMonth() === now.getMonth() &&
      syncDate.getFullYear() === now.getFullYear()

  const dayText = isToday ? 'Today' : syncDate.toLocaleDateString()
  return `${dayText} at ${syncDate.toLocaleTimeString([], options)}`
})
</script>

<style scoped>
.bg-primary {
  --tw-bg-opacity: 1;
  background-color: rgba(34, 197, 94, var(--tw-bg-opacity));
}
.text-primary {
  color: rgba(34, 197, 94, var(--tw-text-opacity));
}
</style>
