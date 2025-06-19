<template>
  <div class="space-y-6">


    <div class="bg-white rounded-lg shadow-md p-4">
      <p class="text-sm text-text-light mt-1">{{ currentMonthYear }}</p>

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


    <section class="bg-green-100 rounded-lg shadow-md p-4 flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m0-4h.01M12 20.5c4.694 0 8.5-3.806 8.5-8.5S16.694 3.5 12 3.5 3.5 7.306 3.5 12s3.806 8.5 8.5 8.5z" />
      </svg>
      <p class="text-sm text-green-900">
        Don’t forget to drink enough water today! 💧 Staying hydrated helps your meds work better.
      </p>
    </section>


    <div class="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
      <p class="text-sm text-text-dark font-semibold">You have {{ pills.length }} medications today</p>
      <p class="text-sm text-text-light">Last sync: Today at 8:00 AM</p>
    </div>

    <section class="bg-white rounded-lg shadow-md p-4">
      <p class="font-semibold text-primary mb-2">Today’s Log</p>
      <ul class="space-y-1 text-sm text-text-dark">
        <li>🩸 Blood Sugar level — 7:30 PM</li>
        <li>💊 Nimesulide Tablets — 8:00 PM</li>
      </ul>
    </section>


    <section class="space-y-2">
      <p v-if="pills.length === 0" class="text-center text-sm text-gray-500">No medications found.</p>
      <div
          v-for="pill in pills"
          :key="pill.id"
          class="relative"
      >
        <PillCard :pill="pill" />
        <button
            class="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 text-sm shadow-md"
            @click="openModal(pill)"
        >+</button>
      </div>
    </section>


    <div
        v-if="selectedPill"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
        <button
            class="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            @click="closeModal"
        >&times;</button>
        <h2 class="text-lg font-bold text-primary mb-2">{{ selectedPill.name }}</h2>
        <p class="text-sm text-text-dark mb-1">💊 Dosage: {{ selectedPill.dosage }}</p>
        <p class="text-sm text-text-dark mb-1">⏰ Reminder: {{ selectedPill.time }}</p>
        <p class="text-sm text-text-dark">🧪 Purpose: {{ selectedPill.purpose || 'No info' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import PillCard from '../components/PillCard.vue'
import { ref, onMounted, computed } from 'vue'

const pills = ref([])
const selectedPill = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/pills')
    if (!response.ok) throw new Error('Failed to fetch pills')
    const data = await response.json()
    pills.value = data
  } catch (error) {
    console.error('Error loading pills:', error)
  }
})

const openModal = (pill) => {
  selectedPill.value = pill
}
const closeModal = () => {
  selectedPill.value = null
}

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
</script>
