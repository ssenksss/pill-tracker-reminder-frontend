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

    <PillCard
        v-for="pill in filteredPills"
        :key="pill.id"
        :pill="pill"
        @open-details="goToDetails"
    />


    <div class="mt-6 text-center">
      <button
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition duration-300"
      >
        + Add medication
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import PillCard from '../components/PillCard.vue'
import { useRouter } from 'vue-router'
const router = useRouter()



const pills = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedPill = ref(null)
function goToDetails(pill) {
  router.push({ name: 'PillDetails', params: { id: pill.id } })
}
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