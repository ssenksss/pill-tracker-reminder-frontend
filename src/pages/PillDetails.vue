<template>
  <div class="min-h-screen bg-white p-6">
    <button @click="$router.back()" class="text-sm text-blue-500 mb-4">&larr; Back</button>

    <div v-if="!pill" class="text-center text-gray-500">
      Loading pill details...
    </div>

    <div v-else>
      <div class="flex justify-center mb-6">
        <img
            v-if="pill.imageUrl"
            :src="pill.imageUrl"
            class="w-32 h-32 rounded-xl shadow object-contain"
            alt="Medication"
        />
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ pill.name }}</h1>
      <p class="text-gray-600 mb-2">📝 Description: {{ pill.description || 'No description available' }}</p>
      <p class="text-gray-600 mb-2">💊 Dosage: {{ pill.dosage }}</p>
      <p class="text-gray-600 mb-2">📅 Frequency: {{ pill.time }}</p>
      <p class="text-gray-600 mb-2">🕓 Last Taken: {{ pill.lastTaken || 'Unknown' }}</p>
      <p class="text-gray-600 mb-2">📦 Pills Left: {{ pill.count ?? 'N/A' }}</p>
      <p class="text-gray-600 mb-4">🔔 Refill Reminder: when {{ pill.refillReminderCount }} pills left</p>

      <div v-if="pill.interactions?.length">
        <h2 class="text-red-700 font-semibold text-md mb-2">⚠️ Drug Interactions</h2>
        <ul class="list-disc list-inside text-red-600">
          <li v-for="(interaction, index) in pill.interactions" :key="index">{{ interaction }}</li>
        </ul>
      </div>

      <button
          @click="$router.push(`/pill/${pill.id}/edit`)"
          class="bg-green-600 text-white px-6 py-2 rounded-full shadow"
      >
        Edit
      </button>

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const pill = ref(null)
const route = useRoute()

onMounted(async () => {
  const res = await fetch(`http://localhost:3000/api/pills/${route.params.id}`)
  if (res.ok) {
    pill.value = await res.json()
  } else {
    console.error('Failed to load pill details')
  }
})
</script>
