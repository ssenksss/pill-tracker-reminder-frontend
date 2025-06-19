<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
      <p class="text-sm text-text-dark font-semibold">You have {{ pills.length }} meds today</p>
      <p class="text-sm text-text-light">Last sync: Today at 8:00 AM</p>
    </div>

    <section>
      <div class="grid grid-cols-7 gap-2 mb-4">
        <div
            v-for="(d, index) in daysInWeek"
            :key="d.date"
            class="text-center py-2 px-2 rounded-lg cursor-pointer font-medium"
            :class="index === activeDayIndex ? 'bg-primary text-white' : 'bg-white text-text-dark shadow-sm'"
        >
          <p class="text-xs text-text-light">{{ d.day }}</p>
          <p class="text-sm">{{ d.date }}</p>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-lg shadow-md p-4 space-y-1">
      <p class="font-semibold text-primary mb-2">Today's Log</p>
      <p class="text-sm">🩸 Blood Sugar — 7:30 PM</p>
      <p class="text-sm">💊 Nimesulide — 8:00 PM</p>
    </section>

    <section>
      <p v-if="pills.length === 0" class="text-center text-sm text-gray-500">No meds found.</p>
      <PillCard v-for="pill in pills" :key="pill.id" :pill="pill" />
    </section>
  </div>
</template>

<script setup>
import PillCard from '../components/PillCard.vue'
import { ref, onMounted } from 'vue'

const pills = ref([])

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/pills') // Proveri rutu!
    if (!response.ok) throw new Error('Failed to fetch pills')
    const data = await response.json()
    console.log('Pills loaded:', data) // 👈 OVO ubaci
    pills.value = data
  } catch (error) {
    console.error('Error loading pills:', error)
  }
})


const today = new Date()
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
