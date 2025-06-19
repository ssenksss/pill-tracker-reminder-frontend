<template>
  <div>
    <h2 class="text-xl font-semibold text-primary mb-4">All pills</h2>
    <p v-if="loading" class="text-center text-gray-500">Loading...</p>
    <p v-if="!loading && pills.length === 0" class="text-center text-gray-500">No pills.</p>
    <PillCard v-for="pill in pills" :key="pill.id" :pill="pill" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PillCard from '../components/PillCard.vue'

const pills = ref([])
const loading = ref(false)

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

onMounted(() => {
  fetchPills()
})
</script>
