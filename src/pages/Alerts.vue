<template>
  <div class="p-4 space-y-6 bg-gray-100 min-h-screen">


    <div class="bg-white rounded-2xl shadow p-4">
      <p class="text-sm text-gray-400 mb-1">{{ currentMonthYear }}</p>
      <div class="grid grid-cols-7 gap-2">
        <div
            v-for="(d, index) in daysInWeek"
            :key="index"
            class="text-center py-2 rounded-xl font-medium cursor-pointer"
            :class="index === activeDayIndex
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
        >
          <p class="text-xs">{{ d.day }}</p>
          <p class="text-sm font-semibold">{{ d.date }}</p>
        </div>
      </div>
    </div>


    <section class="bg-green-100 rounded-xl shadow-md p-4 flex items-center gap-3">
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


    <section>
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Medication Reminders</h2>
      <div v-if="medications.length">
        <div
            v-for="pill in medications"
            :key="pill.id"
            class="bg-white rounded-2xl shadow-md p-4 mb-4 flex justify-between items-start hover:shadow-lg transition"
        >
          <div class="flex space-x-4">
            <img
                :src="getImageUrl(pill.image)"
                alt="pill"
                class="w-12 h-12 object-cover rounded-md border bg-gray-100"
            />
            <div>
              <h3 class="text-base font-semibold text-gray-800">
                {{ pill.name }} - {{ pill.dosage }}
              </h3>
              <p class="text-sm text-gray-500">{{ pill.note || 'After eating' }}</p>
              <p class="text-sm text-primary mt-1">🕒 {{ formatTime(pill.time) }}</p>
              <p v-if="pill.count !== undefined" class="text-sm text-gray-600 mt-1">
                💊 {{ pill.count }} pills left
              </p>
              <p v-if="pill.count !== undefined && pill.count < 5" class="text-sm text-red-600">
                ⚠️ Low supply – consider refill!
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end space-y-2">
            <button
                class="text-sm text-primary font-medium hover:underline"
                @click="openModal(pill)"
            >
              More options
            </button>
            <button
                @click="refillPill(pill)"
                class="bg-primary text-white text-sm px-3 py-1 rounded-md hover:bg-secondary transition-all"
            >
              Refill
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">No medications for today.</p>
    </section>


    <section class="bg-white rounded-xl shadow-md p-4">
      <h2 class="text-xl font-semibold mb-2">History of taking pills</h2>
      <ul class="divide-y text-sm max-h-60 overflow-y-auto">
        <li
            v-for="log in logs"
            :key="log.id"
            class="py-2 flex justify-between items-center"
        >
          <span>{{ formatDateTime(log.taken_at) }} – {{ getMedicationNameById(log.pill_id) }}</span>
          <span
              :class="{
              'text-primary': log.status === 'Uzeto',
              'text-red-500': log.status === 'Preskočeno'
            }"
          >
            {{ log.status }}
          </span>
        </li>
      </ul>
    </section>

    <!-- Modal for editing medication -->
    <transition name="fade">
      <div
          v-if="showModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative">
          <h3 class="text-lg font-semibold mb-4">Edit Medication</h3>
          <label class="block mb-2">
            Name:
            <input
                v-model="selectedPill.name"
                class="border rounded px-3 py-1 w-full"
                type="text"
            />
          </label>
          <label class="block mb-2">
            Dosage:
            <input
                v-model="selectedPill.dosage"
                class="border rounded px-3 py-1 w-full"
                type="text"
            />
          </label>
          <label class="block mb-4">
            Note:
            <input
                v-model="selectedPill.note"
                class="border rounded px-3 py-1 w-full"
                type="text"
            />
          </label>

          <div class="flex justify-end space-x-3">
            <button
                @click="closeModal"
                class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
                @click="saveChanges"
                class="px-4 py-2 rounded bg-primary text-white hover:bg-secondary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const medications = ref([])
const logs = ref([])

const defaultImage = 'https://cdn-icons-png.flaticon.com/512/2784/2784451.png'

function getImageUrl(image) {
  if (!image) return defaultImage
  try {
    return new URL(`../assets/${image}`, import.meta.url).href
  } catch {
    return defaultImage
  }
}

async function refillPill(pill) {
  const newCount = (pill.count || 0) + 10
  try {
    const res = await fetch(`http://localhost:3000/api/pills/${pill.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...pill, count: newCount }),
    })
    if (!res.ok) throw new Error('Refill failed')
    pill.count = newCount
  } catch (err) {
    console.error('Refill error:', err)
    alert('Greška pri refill-u.')
  }
}

const showModal = ref(false)
const selectedPill = ref(null)

function openModal(pill) {
  selectedPill.value = { ...pill }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedPill.value = null
}

async function saveChanges() {
  if (!selectedPill.value) return

  try {
    const res = await fetch(`http://localhost:3000/api/pills/${selectedPill.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedPill.value),
    })
    if (!res.ok) throw new Error('Failed to save')

    const index = medications.value.findIndex(p => p.id === selectedPill.value.id)
    if (index !== -1) {
      medications.value[index] = { ...selectedPill.value }
    }

    closeModal()
  } catch (error) {
    alert('Greška pri čuvanju izmena.')
    console.error(error)
  }
}

onMounted(async () => {
  try {
    const medRes = await fetch('http://localhost:3000/api/pills')
    medications.value = await medRes.json()
  } catch (err) {
    console.error('Failed to fetch medications:', err)
  }

  try {
    const logsRes = await fetch('http://localhost:3000/api/pill-logs')
    logs.value = await logsRes.json()
    logs.value.sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at))
  } catch (err) {
    console.error('Failed to fetch logs:', err)
  }
})

const today = new Date()

const currentMonthYear = computed(() =>
    today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

const startOfWeek = new Date(today)
startOfWeek.setDate(today.getDate() - today.getDay() + 1)

const daysInWeek = Array.from({ length: 7 }).map((_, i) => {
  const date = new Date(startOfWeek)
  date.setDate(startOfWeek.getDate() + i)
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.getDate(),
  }
})

const activeDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1

function formatDateTime(time) {
  if (!time) return 'N/A'
  const isoTime = time.includes('T') ? time : time.replace(' ', 'T')
  const date = new Date(isoTime)
  if (isNaN(date)) return 'Invalid Date'
  return date.toLocaleString('sr-RS', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getMedicationNameById = (id) => {
  const med = medications.value.find((m) => m.id === id)
  return med ? med.name : 'Unknown'
}

function formatTime(time) {
  if (!time) return 'N/A'

  if (typeof time === 'string') {
    try {
      const timesArray = JSON.parse(time)
      if (Array.isArray(timesArray)) {
        return timesArray.map(t => t.slice(0, 5)).join(', ')
      }
      return time.slice(0, 5)
    } catch {

      const parts = time.split(':')
      if (parts.length < 2) return 'Invalid time'
      return `${parts[0]}:${parts[1]}`
    }
  }

  if (Array.isArray(time)) {
    return time.map(t => (typeof t === 'string' ? t.slice(0, 5) : t)).join(', ')
  }

  return 'N/A'
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
