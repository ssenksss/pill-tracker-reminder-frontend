<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold text-primary mb-4">Medications</h2>

    <div class="mb-4">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Search medications..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <p v-if="loading" class="text-center text-gray-500">Loading...</p>
    <p v-if="!loading && filteredPills.length === 0" class="text-center text-gray-500">No pills found.</p>

    <div class="grid gap-4">
      <PillCard
          v-for="pill in filteredPills"
          :key="pill.id"
          :pill="pill"
          @open-details="openModal"
      />

    </div>

    <div class="mt-6 text-center">
      <button
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition duration-300"
      >
        + Add medication
      </button>
    </div>

    <!-- Modal -->
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
        <p class="text-sm text-text-dark mb-1">🧪 Purpose: {{ selectedPill.purpose || 'No info' }}</p>
        <p class="text-sm text-text-dark">⚠️ Remaining pills: {{ selectedPill.count ?? 'N/A' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import PillCard from '../components/PillCard.vue'

const pills = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedPill = ref(null)

async function fetchPills() {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/pills')
    if (!res.ok) throw new Error('Greška pri učitavanju lekova')
    const data = await res.json()
    pills.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function openModal(pill) {
  selectedPill.value = pill
}

function closeModal() {
  selectedPill.value = null
}

onMounted(() => {
  fetchPills()
})

const filteredPills = computed(() => {
  return pills.value.filter(pill =>
      pill.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
