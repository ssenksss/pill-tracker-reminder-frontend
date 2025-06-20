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
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
        >
          <p class="text-xs">{{ d.day }}</p>
          <p class="text-sm font-semibold">{{ d.date }}</p>
        </div>
      </div>
    </div>


    <section class="bg-green-100 rounded-xl shadow-md p-4 flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24"
           stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m0-4h.01M12 20.5c4.694 0 8.5-3.806 8.5-8.5S16.694 3.5 12 3.5 3.5 7.306 3.5 12s3.806 8.5 8.5 8.5z" />
      </svg>
      <p class="text-sm text-green-900">
        Don’t forget to drink enough water today! 💧 Staying hydrated helps your meds work better.
      </p>
    </section>


    <section>
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Medication Reminders</h2>
      <div v-if="medications.length">
        <div v-for="pill in medications" :key="pill.id"
             class="bg-white rounded-2xl shadow-md p-4 mb-4 flex justify-between items-start hover:shadow-lg transition">
          <div class="flex space-x-4">
            <img :src="getImageUrl(pill.image)" alt="pill"
                 class="w-12 h-12 object-cover rounded-md border bg-gray-100" />
            <div>
              <h3 class="text-base font-semibold text-gray-800">{{ pill.name }} - {{ pill.dosage }}</h3>
              <p class="text-sm text-gray-500">{{ pill.note || 'After eating' }}</p>
              <p class="text-sm text-green-600 mt-1">🕒 {{ formatTime(pill.time) }}</p>
              <p v-if="pill.count !== undefined" class="text-sm text-gray-600 mt-1">
                💊 {{ pill.count }} pills left
              </p>
              <p v-if="pill.count !== undefined && pill.count < 5" class="text-sm text-red-600">
                ⚠️ Low supply – consider refill!
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end space-y-2">
            <button class="text-sm text-green-600 font-medium hover:underline">More options</button>
            <button @click="refillPill(pill)"
                    class="bg-green-600 text-white text-sm px-3 py-1 rounded-md hover:bg-green-700 transition-all">
              Refill
            </button>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">No medications for today.</p>
    </section>

    <section class="bg-white rounded-xl shadow-md p-4">
      <h2 class="text-xl font-semibold mb-2">History of taking pills</h2>
      <ul class="divide-y text-sm">
        <li v-for="log in logs" :key="log.id" class="py-2 flex justify-between items-center">
          <span>{{ formatDateTime(log.time_taken) }} – {{ log.name }}</span>

          <span
              :class="{
    'text-green-600': log.status === 'Uzeto',
    'text-red-500': log.status === 'Preskočeno'
  }"
          >
  {{ log.status }}
</span>

          <span v-if="isMissed(log)" class="text-red-600 ml-2 font-semibold">⚠️ Preskočeno!</span>
        </li>
      </ul>
    </section>


  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const medications = ref([])
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
      body: JSON.stringify({ ...pill, count: newCount })
    })
    if (!res.ok) throw new Error('Refill failed')
    pill.count = newCount
  } catch (err) {
    console.error('Refill error:', err)
    alert('Greška pri refill-u.')
  }
}

const logs = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/pill-logs/1')
  logs.value = await res.json()
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
    date: date.getDate()
  }
})

const activeDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
function isMissed(log) {
  if (!log.time_taken) return false;
  const now = new Date();
  const takenTime = new Date(log.time_taken);
  return now > takenTime && log.status !== 'Uzeto';
}

function formatDateTime(time) {
  if (!time) return 'N/A'
  const fixed = time.replace(' ', 'T')
  const date = new Date(fixed)
  if (isNaN(date)) return 'Invalid Date'
  return date.toLocaleString('sr-RS', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatTime(time) {
  if (!time) return 'N/A'
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}


</script>
