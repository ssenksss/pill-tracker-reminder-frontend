<!-- Pills -->
<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold text-primary mb-4">Medications</h2>

    <!-- Pretraga lekova -->
    <div class="mb-4">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Search medications..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <!-- Poruka kada se učitava -->
    <p v-if="loading" class="text-center text-gray-500">Loading...</p>

    <!-- Poruka ako nema rezultata -->
    <p v-if="!loading && filteredPills.length === 0" class="text-center text-gray-500">
      No pills found.
    </p>

    <!-- Prikaz kartica za lekove -->
    <PillCard
        v-for="pill in filteredPills"
        :key="pill.id"
        :pill="pill"
        @open-details="goToDetails"
        @delete-pill="deletePill"
    />

    <!-- Dugme za dodavanje novog leka -->
    <div class="mt-6 text-center">
      <button
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition duration-300"
          @click="goToAdd"
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

// Navigacija na detalje leka
function goToDetails(pill) {
  router.push({ name: 'PillDetails', params: { id: pill.id } })
}

// Navigacija na dodavanje leka
function goToAdd() {
  router.push('/add')
}

// Dohvatanje svih lekova
async function fetchPills() {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/pills')
    if (!res.ok) throw new Error('Error loading pills')
    pills.value = await res.json()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Brisanje leka
async function deletePill(id) {
  if (!confirm('Da li si sigurna da želiš da obrišeš ovaj lek?')) return

  try {
    const res = await fetch(`http://localhost:3000/api/pills/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Greška pri brisanju leka')

    await fetchPills() // Osveži listu nakon brisanja
  } catch (error) {
    alert(error.message)
  }
}

onMounted(() => {
  fetchPills()
})

// Pretraga lekova po imenu
const filteredPills = computed(() =>
    pills.value.filter(pill =>
        pill.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
)
</script>
