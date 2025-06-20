<template>
  <div class="relative">
    <div
        class="flex items-center bg-white rounded-2xl shadow-md px-4 py-4 mb-4 hover:shadow-lg transition duration-200"
    >

      <div class="w-14 h-14 mr-4 flex-shrink-0">
        <img
            v-if="imageSrc"
            :src="imageSrc"
            :alt="`Image of ${pill.name}`"
            class="w-full h-full object-cover rounded-md bg-gray-200"
        />
        <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gray-100 rounded-md text-2xl"
        >
          💊
        </div>
      </div>

      <div class="flex-1">
        <p class="text-sm text-gray-900 font-semibold">
          {{ pill.name }} - {{ pill.dosage || 'N/A' }}
        </p>
        <p class="text-xs text-gray-500">
          {{ pill.context || 'After eating' }}
        </p>
        <p class="text-xs text-gray-500 mt-1">
          🕒 Today, {{ formatTime(pill.time) }}
        </p>
        <p v-if="pill.count !== undefined" class="text-xs text-gray-600 mt-1">
          💊 {{ pill.count }} pills left
        </p>
        <p
            v-if="pill.count !== undefined && pill.count < 5"
            class="text-xs text-red-500 mt-1"
        >
          ⚠️ Low supply – consider refill!
        </p>
      </div>

      <button
          @click="markAsTaken"
          class="text-green-600 text-xl ml-4 hover:scale-110 transition-transform"
          title="Mark as taken"
      >
        ✓
      </button>
    </div>


    <button
        @click="openDetails"
        class="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 text-sm shadow-md"
        title="Show details"
    >+</button>



  </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue'

const props = defineProps({
  pill: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-details'])

const imageSrc = computed(() => {
  if (!props.pill.image) return ''
  try {

    return new URL(`../assets/${props.pill.image}`, import.meta.url).href
  } catch {
    return ''
  }
})

function formatTime(time) {
  if (!time) return 'N/A'
  return time.slice(0, 5)
}

async function markAsTaken() {
  if (props.pill.count <= 0) return

  const updatedCount = props.pill.count - 1

  try {
    await fetch(`http://localhost:3000/api/pills/${props.pill.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...props.pill,
        count: updatedCount
      })
    })

    props.pill.count = updatedCount
  } catch (error) {
    console.error('Error updating pill count:', error)
  }
}

function openDetails() {
  emit('open-details', props.pill)
}
</script>


<style scoped>

.relative {
  position: relative;
}
.absolute {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
